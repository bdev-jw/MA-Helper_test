// 전역 객체에 초기화 함수 등록
window.initRegularModal = function() {
    initCalendar();
    
    document.getElementById("regularApplyBtn").addEventListener("click", () => {
        const selectedDates = document.getElementById("selectedDate").getAttribute("data-dates");
        const content = document.getElementById("regularContent").value;
        
        if (selectedDates && JSON.parse(selectedDates).length > 0 && content.trim() !== "") {
            addRegularApplication(JSON.parse(selectedDates), content);
            alert("정기 점검이 신청되었습니다.");
            closeModal(); // main.html에 정의된 전역 함수 사용
        } else {
            alert("날짜와 내용을 모두 입력해주세요.");
        }
    });
};

function addRegularApplication(dates, content) {
    if (window.regularApplications.length >= 10) window.regularApplications.shift();
    window.regularApplications.push({ dates, content, timestamp: new Date().toISOString() });
    updateRegularBadge();
}

function updateRegularBadge() {
    const regularIcon = document.getElementById("regularIcon");
    if (!regularIcon) return;
    
    regularIcon.querySelector(".badge")?.remove();
    if(window.regularApplications.length === 0) return;

    const allDates = window.regularApplications.flatMap(app => app.dates);
    if (allDates.length === 0) return;

    const earliestDate = allDates.sort()[0];
    const [year, month, day] = earliestDate.split('-');

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `${month}/${day}`;
    regularIcon.appendChild(badge);
}

function initCalendar() {
    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;
    calendarEl.innerHTML = "";
    
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth();
    let selectedDates = [];

    const selectedDateElement = document.getElementById("selectedDate");
    selectedDateElement.setAttribute("data-dates", JSON.stringify([]));
    selectedDateElement.textContent = "날짜를 선택해주세요";
    
    function renderCalendar() {
        // ... (기존 initCalendar의 renderCalendar 로직은 동일)
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        let calendarHTML = `<h3>${currentYear}년 ${currentMonth + 1}월</h3><div class="calendar-grid">`;
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        days.forEach(d => calendarHTML += `<div class="calendar-day-header">${d}</div>`);
        
        for(let i=0; i < firstDay; i++) calendarHTML += `<div></div>`;
        
        for(let i=1; i <= lastDate; i++) {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            let classes = 'calendar-day';
            if(selectedDates.includes(dateString)) classes += ' selected';
            calendarHTML += `<div class="${classes}" data-date="${dateString}">${i}</div>`;
        }
        calendarHTML += `</div>`;
        calendarEl.innerHTML = calendarHTML;
        
        calendarEl.querySelectorAll('.calendar-day').forEach(day => {
            day.addEventListener('click', (e) => {
                const date = e.target.dataset.date;
                if(!date) return;
                const index = selectedDates.indexOf(date);
                if(index > -1) {
                    selectedDates.splice(index, 1);
                    e.target.classList.remove('selected');
                } else {
                    selectedDates.push(date);
                    e.target.classList.add('selected');
                }
                selectedDateElement.setAttribute("data-dates", JSON.stringify(selectedDates));
                selectedDateElement.textContent = selectedDates.length > 0 ? `선택된 날짜: ${selectedDates.length}개` : "날짜를 선택해주세요";
            });
        });
    }
    renderCalendar();
}