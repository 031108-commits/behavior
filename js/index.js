// 初始化应用
App.initApp();

// 全局变量
let currentDate = App.getToday();
let selectedStudent = null;

// DOM 元素
const datePicker = document.getElementById('datePicker');
const confirmDate = document.getElementById('confirmDate');
const recordCount = document.getElementById('recordCount');
const totalScore = document.getElementById('totalScore');
const studentsContainer = document.getElementById('studentsContainer');
const behaviorContainer = document.getElementById('behaviorContainer');
const recordsList = document.getElementById('recordsList');
const historyModeTip = document.getElementById('historyModeTip');
const historyDateText = document.getElementById('historyDateText');
const backToTodayBtn = document.getElementById('backToTodayBtn');

// 初始化日期选择器
datePicker.value = currentDate;

// 加载幼儿列表
function loadStudents() {
  const students = App.getClassStudents();
  studentsContainer.innerHTML = '';
  
  students.forEach(student => {
    const studentItem = document.createElement('div');
    studentItem.className = 'student-item';
    studentItem.dataset.id = student.id;
    studentItem.dataset.name = student.name;
    studentItem.dataset.gender = student.gender;
    
    studentItem.innerHTML = `
      <div>${student.name}</div>
      <div class="student-gender">${student.gender === '男' ? '👦' : '👧'}</div>
    `;
    
    studentItem.addEventListener('click', () => {
      App.vibrate();
      selectStudent(studentItem);
    });
    
    studentsContainer.appendChild(studentItem);
  });
}

// 选择幼儿
function selectStudent(studentItem) {
  // 移除其他幼儿的选中状态
  document.querySelectorAll('.student-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 添加当前幼儿的选中状态
  studentItem.classList.add('active');
  
  // 保存选中的幼儿信息
  selectedStudent = {
    id: parseInt(studentItem.dataset.id),
    name: studentItem.dataset.name,
    gender: studentItem.dataset.gender
  };
}

// 加载行为指标体系
function loadBehaviorSystem() {
  behaviorContainer.innerHTML = '';
  
  for (const primary in App.behaviorSystem) {
    const section = document.createElement('div');
    section.className = 'behavior-section';
    
    section.innerHTML = `
      <div class="behavior-section-header">
        <span>${Object.keys(App.behaviorSystem).indexOf(primary) === 0 ? '💪' : Object.keys(App.behaviorSystem).indexOf(primary) === 1 ? '🧩' : '🗣️'}</span>
        <span>${primary}</span>
      </div>
    `;
    
    for (const secondary in App.behaviorSystem[primary]) {
      const subsection = document.createElement('div');
      subsection.className = 'behavior-subsection';
      subsection.innerHTML = `<h3>${secondary}</h3>`;
      
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'behavior-buttons';
      
      App.behaviorSystem[primary][secondary].forEach(behavior => {
        const button = document.createElement('button');
        button.className = 'behavior-btn';
        button.textContent = `${behavior.name} +${behavior.score}`;
        button.dataset.behavior = behavior.name;
        button.dataset.score = behavior.score;
        
        button.addEventListener('click', () => {
          App.vibrate();
          recordBehavior(behavior.name, behavior.score);
        });
        
        buttonsContainer.appendChild(button);
      });
      
      subsection.appendChild(buttonsContainer);
      section.appendChild(subsection);
    }
    
    behaviorContainer.appendChild(section);
  }
}

// 记录行为
function recordBehavior(behaviorName, score) {
  if (!selectedStudent) {
    alert('请先选择幼儿');
    return;
  }
  
  const record = {
    timestamp: new Date().toLocaleTimeString(),
    date: currentDate,
    studentId: selectedStudent.id,
    studentName: selectedStudent.name,
    gender: selectedStudent.gender,
    behaviorName: behaviorName,
    score: score
  };
  
  App.saveRecord(record);
  loadRecords();
  updateSummary();
}

// 加载记录列表
function loadRecords() {
  const records = App.getRecordsByDate(currentDate);
  recordsList.innerHTML = '';
  
  if (records.length === 0) {
    recordsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">暂无记录</div>';
    return;
  }
  
  // 按时间倒序排列
  records.sort((a, b) => {
    return new Date(`2000-01-01 ${b.timestamp}`) - new Date(`2000-01-01 ${a.timestamp}`);
  });
  
  records.forEach((record, index) => {
    const recordItem = document.createElement('div');
    recordItem.className = 'record-item';
    
    // 检查是否为补录记录（当前日期不是今天）
    const isHistoryRecord = currentDate !== App.getToday();
    
    recordItem.innerHTML = `
      <div class="record-info">
        <div>${record.studentName} ${record.gender === '男' ? '👦' : '👧'} ${isHistoryRecord ? '📌' : ''}</div>
        <div>${record.behaviorName}</div>
        <div class="record-time">${record.timestamp}</div>
      </div>
      <div class="record-score">+${record.score || 1}</div>
      <button class="delete-btn" data-index="${index}">🗑️</button>
    `;
    
    recordsList.appendChild(recordItem);
  });
  
  // 添加删除事件监听器
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      App.vibrate();
      const index = parseInt(e.target.dataset.index);
      deleteRecord(index);
    });
  });
}

// 删除记录
function deleteRecord(index) {
  if (confirm('确定要删除这条记录吗？')) {
    App.deleteRecord(currentDate, index);
    loadRecords();
    updateSummary();
  }
}

// 更新统计信息
function updateSummary() {
  const records = App.getRecordsByDate(currentDate);
  recordCount.textContent = records.length;
  totalScore.textContent = App.calculateTotalScore(records);
}

// 日期选择事件
confirmDate.addEventListener('click', () => {
  App.vibrate();
  currentDate = datePicker.value;
  const today = App.getToday();
  
  if (currentDate !== today) {
    // 显示提示条
    historyModeTip.style.display = 'flex';
    // 更新提示文字
    const dateObj = new Date(currentDate);
    const formattedDate = `${dateObj.getFullYear()}年${String(dateObj.getMonth() + 1).padStart(2, '0')}月${String(dateObj.getDate()).padStart(2, '0')}日`;
    historyDateText.textContent = formattedDate;
    // 可选：给行为按钮区域添加边框提示
    behaviorContainer.style.border = '2px solid #ffecb5';
    behaviorContainer.style.borderRadius = '8px';
    behaviorContainer.style.padding = '10px';
  } else {
    // 隐藏提示条
    historyModeTip.style.display = 'none';
    // 移除行为按钮区域的边框提示
    behaviorContainer.style.border = 'none';
    behaviorContainer.style.padding = '0';
  }
  
  loadRecords();
  updateSummary();
});

// 初始化
function init() {
  loadStudents();
  loadBehaviorSystem();
  loadRecords();
  updateSummary();
}

// 回到今天
function goToToday() {
  App.vibrate();
  const today = App.getToday();
  datePicker.value = today;
  // 触发日期选择事件
  confirmDate.click();
}

// 为回到今天按钮添加点击事件监听器
backToTodayBtn.addEventListener('click', goToToday);

// 启动应用
init();