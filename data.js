// status: '대기' | '승인' | '반려',
// reviewedBy: '김팀장',
// reviewedAt: '2025-07-08'

const clients = {
    test1:{
        id:'test1@mesa.kr',
        client_name:'(주)에스비에스(SBS)',
        password:'123',
        business_info: {
            project_name: "방송 IT 통합 유지보수",
            delivered_equipment: 'Nutanix',
            sales_person:'최성영',
            engineer:'김두현',
            startDate: '2024-01-01',
            endDate:'2025-12-31',
            logoPath: "/public/sbs.png"
        },
        maintenance_data:{
            equipment1: {
                name: "NUTANIX",
                records: [
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: 'TS4500 I/0 Slot 장애처리',
                    manager: '강영구',
                    status: '대기',
                    reviewedBy: null,
                    reviewedAt: null
                },
                {
                    date: '2025-01-16',
                    cycle: '발생시',
                    content: 'Tfinity , TS4500 마이그레이션',
                    manager: '강영구'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: '장애 처리 및 테스트',
                    manager: '김두현'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: '장애 처리',
                    manager: '황인성'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: 'TS4500 I/0 Slot 장애처리',
                    manager: '한형구'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: 'TS4500 I/0 Slot 장애처리',
                    manager: '강영구'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: 'TS4500 I/0 Slot 장애처리',
                    manager: '강영구'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: 'TS4500 I/0 Slot 장애처리',
                    manager: '강영구'
                },
                {
                    date: '2025-01-21',
                    cycle: '발생시',
                    content: 'TS4500 I/0 Slot 장애처리',
                    manager: '강영구'
                }
            ]
        },
            equipment2: {
                name: "NETBACKUP",
                records: [
                {
                    date: '2024-12-15',
                    cycle: '2개월',
                    content: '부품 교체',
                    manager: '박민수'
                }
                ]
            },
                equipment3: {
                    name: "CIDER",
                    records: [
                    {
                        date: '2024-11-30',
                        cycle: '3개월',
                        content: '소프트웨어 업데이트',
                        manager: '김지혜'
                    }
                ]
            },
                equipment4: {
                    name: "DELL",
                    records: [
                    {
                        date: '2024-10-10',
                        cycle: '매주',
                        content: '상태 점검',
                        manager: '이상우'
                    }
                ]
            },
            equipment5: {
                name: "LAMPAD",
                records: [
                {
                    date: '2024-12-15',
                    cycle: '2개월',
                    content: '부품 교체',
                    manager: '박민수'
                }
            ]
        },
            equipment6: {
                name: "RIMINI",
                records: [
                {
                    date: '2024-11-30',
                    cycle: '3개월',
                    content: '소프트웨어 업데이트',
                    manager: '김지혜'
                }
            ]
        },
            equipment7: {
                name: "REDHAT",
                records: [
                {
                    date: '2024-10-10',
                    cycle: '매주',
                    content: '상태 점검',
                    manager: '이상우'
                }
            ]
        },
            equipment8: {
                name: "VERITAS",
                records: [
                {
                    date: '2024-10-10',
                    cycle: '매주',
                    content: '상태 점검',
                    manager: '이상우'
                }
            ]
        },
            equipment9: {
                name: "QSTAR",
                records: [
                {
                    date: '2024-10-10',
                    cycle: '매주',
                    content: '상태 점검',
                    manager: '이상우'
                }
            ]
        },
            equipment10: {
                name: "STRATUS",
                records: [
                {
                    date: '2024-10-10',
                    cycle: '매주',
                    content: '상태 점검',
                    manager: '이상우'
                }
            ]
        }
            }
        },
        test2:{
            id:'test2@mesa.kr',
            client_name:'홈앤쇼핑',
            password:'123',
            business_info: {
                project_name: "25년도 유지보수",
                delivered_equipment: 'NBU(A)/INFOSCALE',
                sales_person:'신은철',
                engineer:'정재승/황인성',
                startDate: '2025-01-01',
                endDate:'2025-12-31',
                logoPath:'/public/homeshoping.svg'
            },
            maintenance_data:{
                equipment1: {
                    name: "VRTS-NBU(A)",
                    records: [
                    {
                        date: '2025-03-24',
                        cycle: '발생시',
                        content: 'NBUA 5250 설치 지원',
                        manager: '강영구'
                    },
                    {
                        date: '2025-03-24',
                        cycle: '발생시',
                        content: '입고 임대장비 구성 및 RACK 재배치',
                        manager: '정재승'
                    },
                    {
                        date: '2025-03-17',
                        cycle: '발생시',
                        content: '임대장비 입고 및 업그레이드',
                        manager: '정재승'
                    },
                    {
                        date: '2025-03-17',
                        cycle: '발생시',
                        content: 'NBUA 5240 업그레이드',
                        manager: '강영구'
                    },
                    {
                        date: '2025-03-05',
                        cycle: '발생시',
                        content: '업그레이드',
                        manager: '정재승'
                    },
                    {
                        date: '2025-02-16',
                        cycle: '발생시',
                        content: 'DB백업 장애처리',
                        manager: '정재승'
                    },
                    {
                        date: '2025-01-02',
                        cycle: '발생시',
                        content: '인증서 만료 오류 조치 처리',
                        manager: '김수호'
                    }
                ]
            },
                equipment2: {
                    name: "VRTS-INFOSCALE",
                    records: [
                    {
                        date: '2025-03-19',
                        cycle: '발생시',
                        content: '점검',
                        manager: '심상기'
                    },
                    {
                        date: '2025-02-28',
                        cycle: '발생시',
                        content: '장애 해결',
                        manager: '심상기'
                    },
                    {
                        date: '2025-02-12',
                        cycle: '발생시',
                        content: '정기 방문 점검',
                        manager: '심상기'
                    },
                    {
                        date: '2025-02-01',
                        cycle: '발생시',
                        content: '장애 관련 유선 대응',
                        manager: '심상기'
                    },
                    {
                        date: '2025-01-20',
                        cycle: '발생시',
                        content: '점검',
                        manager: '심상기'
                    }
                ]
            },
            equipment3: {
                name: "NTNX-HCI"
            },
            equipment4: {
                name: "NTNX-SW"
            },
            equipment5: {
                name: "STRATUS"
            },
            equipment6: {
                name: "SPECTRA-LOGIC"
            },
            equipment7: {
                name: "DELL-EMC"
            },
            equipment8: {
                name: "ETC"
            }
            }
        }
    }
    

const engineers = [
    {
      id: "dhkim@mesa.kr",
      password:'123',
      name: "김두현",
      gender: "남",
      position: "차장",
      experience: "4년차",
      photo: "/public/man.png",
      role:'member',
      team: '1팀',
      assignments: [
        {
          client: "(주)에스비에스(SBS)",
          projects: [
            {
              projectName: "방송 IT 통합 유지보수",
              equipments: ["서버 A", "서버 B", "네트워크 스위치","NUTANIX"]
            },
            {
              projectName: "보도국장비지원",
              equipments: ["카메라1호기", "송출장비"]
            }
          ]
        },
        {
          client: "KBS",
          projects: [
            {
              projectName: "본관네트워크",
              equipments: ["코어스위치", "AP"]
            }
          ]
        }
      ]
    },
  
    {
      id: "jwlee@mesa.kr",
      password:'123',
      name: "이준원",
      gender: "남",
      position: "과장",
      experience: "6년차",
      photo: "/public/profile_hjy.jpg",
      role:'reader',
      team: '1팀',
      assignments: [
        {
          client: "MBC",
          projects: [
            {
              projectName: "송출센터지원",
              equipments: ["송출서버1", "송출서버2"]
            }
          ]
        }
      ]
    }
  
    // 추가 엔지니어를 이 패턴으로 계속 추가하면 됨
  ];

// ✅ 브라우저 환경이면 전역 변수 등록
if (typeof window !== 'undefined') {
    window.engineers = engineers;
    window.clients = clients;
  }
  
  // ✅ Node.js 환경이면 모듈로 내보내기
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { engineers, clients };
  }