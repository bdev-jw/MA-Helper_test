// 맨 위에 추가
const { Together } = require('together-ai');

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY, // .env에 반드시 설정
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const data = require('./data.js');

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://ma-helper-test.netlify.app',
  'http://127.0.0.1:5502',
  'http://localhost:5502'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS 정책에 의해 차단됨: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

// ✅ MongoDB 연결
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("❌ 환경 변수 MONGODB_URI가 없습니다!");
  process.exit(1);
}

// ✅ 스키마 정의
const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  client_name: String,
  password: { type: String, required: true },
  business_info: Object,
  maintenance_data: { type: Object, default: {} }
});
const Client = mongoose.model('Client', ClientSchema);

const EngineerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: String,
  name: String,
  role: { type: String, required: true, enum: ['leader', 'member'] },
  gender: String,
  position: String,
  experience: String,
  photo: String,
  team: String,
  assignments: Array
});
const Engineer = mongoose.model('Engineer', EngineerSchema);

// ✅ 데이터 초기화
const initializeData = async () => {
  console.log('📌 데이터 초기화 시작...');
  try {
    const existingClients = await Client.countDocuments();
    const existingEngineers = await Engineer.countDocuments();

    if (existingClients > 0 && existingEngineers > 0) {
      console.log('✅ 기존 데이터가 존재하므로 초기화를 건너뜁니다.');
      return;
    }

    if (existingClients === 0) {
      let insertCount = 0;
      for (const key in data.clients) {
        const clientData = { ...data.clients[key] };
        const convertedMaintenanceData = {};
        for (const equipKey in clientData.maintenance_data) {
          const equipData = clientData.maintenance_data[equipKey];
          if (equipData && equipData.name && equipData.records) {
            convertedMaintenanceData[equipData.name] = equipData.records;
          } else if (equipData && equipData.name) {
            convertedMaintenanceData[equipData.name] = [];
          }
        }
        clientData.maintenance_data = convertedMaintenanceData;
        const newClient = new Client(clientData);
        await newClient.save();
        insertCount++;
        console.log(`✅ ${newClient.id} (${newClient.client_name}) 저장됨`);
      }
      console.log(`🚀 총 ${insertCount}개 클라이언트 저장 완료`);
    }

    if (existingEngineers === 0) {
      await Engineer.insertMany(data.engineers);
      console.log(`🚀 총 ${data.engineers.length}명 엔지니어 저장 완료`);
    } else {
      console.log('✅ 기존 엔지니어 데이터가 존재하므로 초기화를 건너뜁니다.');
    }

  } catch (error) {
    console.error('❌ 초기화 오류:', error);
    throw error;
  }
};

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ MongoDB Atlas 연결됨');
    initializeData().then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 서버 실행 중 (포트 ${port})...`);
        console.log(`🌐 접근 가능한 주소: http://localhost:${port}`);
      });
    }).catch(error => {
      console.error('❌ 초기화 오류:', error);
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB 연결 실패:', err);
    process.exit(1);
  });

// ✅ 고객사 로그인
app.post('/api/login', async (req, res) => {
    try {
        const { id, password } = req.body;
        const client = await Client.findOne({ id, password });
        if (client) {
            res.json(client);
        } else {
            res.status(401).json({ message: 'ID 또는 비밀번호가 잘못되었습니다.' });
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
});

// ✅ 클라이언트 데이터 조회
app.get('/api/client/:id', async (req, res) => {
    try {
        const client = await Client.findOne({ id: req.params.id });
        if (!client) return res.status(404).json({ message: "사용자 없음" });
        res.json(client);
    } catch (error) {
        console.error('클라이언트 조회 오류:', error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 유지보수 조회 (고객사용) - 수정됨
app.get('/api/maintenance/:clientId', async (req, res) => {
    try {
        const client = await Client.findOne({ id: req.params.clientId });
        if (!client) {
            return res.status(404).json({ message: "고객사를 찾을 수 없습니다." });
        }

        const clientFacingData = {};
        // 장비별로 순회
        for (const equipment in client.maintenance_data) {
            if (Object.prototype.hasOwnProperty.call(client.maintenance_data, equipment)) {
                const records = client.maintenance_data[equipment];
                if (Array.isArray(records)) {
                    // '승인' 상태의 기록만 필터링하고, '업무 요약'을 'content'로 바꿔서 전달
                    clientFacingData[equipment] = records
                        .map(record => ({
                            date: record.date,
                            cycle: record.cycle,
                            content: record.content_simple, // <-- 수정: 상세 내용 대신 업무 요약을 content 필드로 전달
                            manager: record.manager
                        }));
                }
            }
        }
        res.json(clientFacingData);

    } catch (error) {
        console.error('고객사용 유지보수 조회 오류:', error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 유지보수 추가 (고객사)
app.post('/api/maintenance/:clientId', async (req, res) => {
    try {
        const { equipment, date, cycle, content, manager } = req.body;
        const client = await Client.findOne({ id: req.params.clientId });
        if (!client) return res.status(404).json({ message: "사용자 없음" });
        if (!client.maintenance_data[equipment]) {
            client.maintenance_data[equipment] = [];
        }
        client.maintenance_data[equipment].push({ date, cycle, content, manager });
        await client.save();
        res.json({ message: "추가 완료", maintenance_data: client.maintenance_data });
    } catch (error) {
        console.error('유지보수 추가 오류:', error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 엔지니어 목록 조회
app.get('/api/engineers', async (req, res) => {
    try {
        const engineers = await Engineer.find({});
        if (!engineers || engineers.length === 0) {
            return res.status(404).json({ message: '엔지니어 정보 없음' });
        }
        res.json(engineers);
    } catch (error) {
        console.error('엔지니어 목록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
});

// ✅ 엔지니어 로그인 확인
app.post('/api/engineer-login', async(req, res) => {
    try {
        const { id, password } = req.body;
        const engineer = await Engineer.findOne({ id, password });
        if (engineer) {
            res.json({
                id: engineer.id,
                name: engineer.name,
                role: engineer.role,
                team: engineer.team,
                assignments: engineer.assignments || []
            });
        } else {
            res.status(401).json({ message: 'ID 또는 비밀번호가 잘못되었습니다.' });
        }
    } catch (error) {
        console.error('엔지니어 로그인 오류:', error);
        res.status(500).json({ message: '서버 오류', error: error.message });
    }
});

// ✅ 엔지니어 기록 저장 API - 수정됨
app.post('/api/engineer-record', async (req, res) => {
    try {
        const { manager, client, project, equipment, date, content, content_simple } = req.body; // ← 수정: content_simple 추가

        if (!manager || !client || !project || !equipment || !date || !content || !content_simple) { // ← 수정: content_simple 검증
            return res.status(400).json({ message: '필수 항목(업무 요약 포함) 누락' });
        }

        const clientDoc = await Client.findOne({ client_name: client });
        if (!clientDoc) {
            return res.status(404).json({ message: `고객사 '${client}'를 찾을 수 없습니다.` });
        }
        
        if (!clientDoc.maintenance_data) clientDoc.maintenance_data = {};
        
        const equipmentKey = equipment.trim();
        if (!Array.isArray(clientDoc.maintenance_data[equipmentKey])) {
            clientDoc.maintenance_data[equipmentKey] = [];
        }

        const newRecord = {
            date,
            cycle: "발생시",
            content,          // ← 상세 내용
            content_simple,   // ← 추가: 업무 요약
            manager,
            status: '대기',
            reviewedBy: null,
            reviewedAt: null
        };

        clientDoc.maintenance_data[equipmentKey].push(newRecord);
        clientDoc.markModified(`maintenance_data.${equipmentKey}`);
        await clientDoc.save();
        
        const savedRecordForResponse = {
             id: `${clientDoc.id}_${equipmentKey}_${date}_${new Date().getTime()}`,
             project: clientDoc.business_info?.project_name || equipmentKey,
             client: clientDoc.client_name,
             equipment: equipmentKey,
             date: newRecord.date,
             performer: newRecord.manager,
             content: newRecord.content,               // ← 상세 내용 (엔지니어용)
             content_simple: newRecord.content_simple, // ← 추가: 업무 요약 (엔지니어용)
             status: newRecord.status
        };

        res.status(201).json(savedRecordForResponse);

    } catch (error) {
        console.error("❌ 기록 저장 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

// ✅ 파일 업로드
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        res.json({ message: '파일 업로드 성공', filename: req.file.filename });
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        res.status(500).json({ message: '파일 업로드 실패', error: error.message });
    }
});

// ✅ 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// ✅ 테스트 API
app.get('/api/test', (req, res) => {
    res.json({ 
        message: "테스트 성공: 서버가 작동 중입니다.",
        timestamp: new Date().toISOString(),
        cors: "CORS 설정 완료"
    });
});

// ✅ 클라이언트 목록 조회 API 추가 (디버깅용)
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find({}, 'client_name id business_info.project_name');
        res.json({
            message: "클라이언트 목록 조회 성공",
            count: clients.length,
            clients: clients
        });
    } catch (error) {
        console.error('클라이언트 목록 조회 오류:', error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// 엔지니어별 업무 기록 조회 - 수정됨
app.get('/api/engineer-records/:engineerId', async (req, res) => {
    try {
        const engineerId = req.params.engineerId;
        const engineer = await Engineer.findOne({ id: engineerId });
        if (!engineer) {
            return res.json([]);
        }
        
        const engineerName = engineer.name;
        const clients = await Client.find({});
        const engineerRecords = [];
        
        clients.forEach(client => {
            if (client.maintenance_data) {
                Object.keys(client.maintenance_data).forEach(equipment => {
                    const records = client.maintenance_data[equipment];
                    if (Array.isArray(records)) {
                        records.forEach((record, index) => {
                            if (record.manager === engineerName) {
                                engineerRecords.push({
                                    id: `${client.id}_${equipment}_${record.date}_${index}`,
                                    project: client.business_info?.project_name || equipment,
                                    client: client.client_name,
                                    equipment: equipment,
                                    date: record.date,
                                    performer: record.manager,
                                    content: record.content, // ← 수정: 상세 내용 전달
                                    content_simple: record.content_simple, // ← 추가: 업무 요약도 전달
                                    status: record.status || '승인'
                                });
                            }
                        });
                    }
                });
            }
        });
        
        engineerRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(engineerRecords);
    } catch (error) {
        console.error('❌ 엔지니어 기록 조회 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 업무 기록 상태 변경(승인/반려) API
app.patch('/api/engineer-record/:recordId/approve', async (req, res) => {
  try {
    const { status, reviewer } = req.body;
    const { recordId } = req.params;
    
    const [clientId, equipment, originalDate, recordIndex] = recordId.split('_');
    
    const client = await Client.findOne({ id: clientId });
    if (!client) return res.status(404).json({ message: "고객사를 찾을 수 없습니다." });

    const records = client.maintenance_data?.[equipment];
    const record = records?.[parseInt(recordIndex)];

    if (!record || record.date !== originalDate) {
        return res.status(404).json({ message: "해당 업무 기록을 찾을 수 없습니다." });
    }

    record.status = status;
    record.reviewedBy = reviewer;
    record.reviewedAt = new Date().toISOString();

    client.markModified(`maintenance_data.${equipment}`);
    await client.save();

    res.json({ message: '상태 변경 완료', updatedRecord: record });
  } catch(error) {
     console.error('❌ 상태 변경 오류:', error);
     res.status(500).json({ message: '서버 오류' });
  }
});

// 팀장용: 팀원 승인 대기 기록 조회 API
app.get('/api/team-records/:leaderId', async (req, res) => {
  try {
    const leader = await Engineer.findOne({ id: req.params.leaderId });
    if (!leader || leader.role !== 'leader') {
      return res.status(403).json({ message: "팀장 권한이 없습니다." });
    }

    const teamMembers = await Engineer.find({ team: leader.team, role: 'member' });
    const memberNames = teamMembers.map(m => m.name);

    const clients = await Client.find({});
    const recordsToApprove = [];

    clients.forEach(client => {
      Object.entries(client.maintenance_data || {}).forEach(([equipment, list]) => {
        if (Array.isArray(list)) {
            list.forEach((record, index) => {
                if (memberNames.includes(record.manager) && record.status === '대기') {
                    recordsToApprove.push({
                        id: `${client.id}_${equipment}_${record.date}_${index}`,
                        client: client.client_name,
                        project: client.business_info?.project_name || equipment,
                        equipment,
                        date: record.date,
                        performer: record.manager,
                        content: record.content, // 팀장은 상세 내용을 보고 승인해야 함
                        status: record.status
                    });
                }
            });
        }
      });
    });

    recordsToApprove.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(recordsToApprove);
  } catch (error) {
     console.error('❌ 팀 기록 조회 오류:', error);
     res.status(500).json({ message: '서버 오류' });
  }
});

// AI 응답 생성 API
app.post('/api/ai-chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: '프롬프트가 없습니다.' });
  }
  try {
    const result = await together.chat.completions.create({
      model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    const reply = result.choices?.[0]?.message?.content || '응답 없음';
    res.json({ reply });
  } catch (error) {
    console.error('AI 응답 오류:', error);
    res.status(500).json({ message: 'AI 호출 실패', error: error.message });
  }
});

// ✅ 404 에러 처리
app.use((req, res) => {
    console.log(`❌ 404 - 경로를 찾을 수 없음: ${req.method} ${req.path}`);
    res.status(404).json({ 
        message: '경로를 찾을 수 없습니다',
        requestedPath: req.path,
        method: req.method
    });
});

// ✅ 전역 에러 처리
app.use((error, req, res, next) => {
    console.error('❌ 서버 오류:', error);
    res.status(500).json({ 
        message: '서버 내부 오류',
        error: process.env.NODE_ENV === 'development' ? error.message : '서버 오류가 발생했습니다'
    });
});