// 教师评价页 JavaScript

// CLASS量表数据
const CLASS_DATA = [
  {
    dimension: '❤️ 情感支持',
    subDimensions: [
      {
        name: '积极氛围',
        behaviors: [
          { name: '温暖尊重', score: 1 },
          { name: '积极情感', score: 2 },
          { name: '尊重接纳', score: 3 },
          { name: '同伴支持', score: 4 }
        ]
      },
      {
        name: '消极氛围（反向）',
        behaviors: [
          { name: '易怒否定', score: 1 },
          { name: '威胁控制', score: 2 },
          { name: '同伴冲突', score: 3 }
        ]
      },
      {
        name: '教师敏感性',
        behaviors: [
          { name: '察觉需求', score: 1 },
          { name: '个别支持', score: 2 },
          { name: '自由求助', score: 3 }
        ]
      },
      {
        name: '尊重幼儿观点',
        behaviors: [
          { name: '鼓励表达', score: 1 },
          { name: '提供选择', score: 2 },
          { name: '尊重自主', score: 3 }
        ]
      }
    ]
  },
  {
    dimension: '📋 班级管理',
    subDimensions: [
      {
        name: '行为管理',
        behaviors: [
          { name: '清晰规则', score: 1 },
          { name: '有效预防', score: 2 },
          { name: '幼儿自律', score: 3 }
        ]
      },
      {
        name: '效率',
        behaviors: [
          { name: '准备充分', score: 1 },
          { name: '清楚规则', score: 2 },
          { name: '节奏适中', score: 3 }
        ]
      },
      {
        name: '教学活动形式',
        behaviors: [
          { name: '多元方式', score: 1 },
          { name: '材料激发', score: 2 },
          { name: '持续参与', score: 3 }
        ]
      }
    ]
  },
  {
    dimension: '🧠 教育支持',
    subDimensions: [
      {
        name: '认知发展',
        behaviors: [
          { name: '分析推理', score: 1 },
          { name: '联系经验', score: 2 },
          { name: '丰富解释', score: 3 }
        ]
      },
      {
        name: '反馈质量',
        behaviors: [
          { name: '具体反馈', score: 1 },
          { name: '追问扩展', score: 2 },
          { name: '鼓励解释', score: 3 }
        ]
      },
      {
        name: '语言示范',
        behaviors: [
          { name: '丰富词汇', score: 1 },
          { name: '往复对话', score: 2 },
          { name: '开放提问', score: 3 }
        ]
      }
    ]
  }
];

// 当前状态
let currentDate = getTodayDate();
let currentTeacher = 'A';

// DOM元素
const datePicker = document.getElementById('datePicker');
const teacherTabs = document.querySelectorAll('.teacher-tabs .tab-btn');
const indicatorsSection = document.getElementById('indicatorsSection');
const recordsList = document.getElementById('recordsList');
const navItems = document.querySelectorAll('.nav-item');

// 初始化
function init() {
  // 设置日期选择器默认值
  datePicker.value = currentDate;
  
  // 渲染指标区域
  renderIndicators();
  
  // 加载记录
  renderRecords();
  
  // 绑定事件
  bindEvents();
  
  // 注册Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// 绑定事件
function bindEvents() {
  // 日期变更
  datePicker.addEventListener('change', (e) => {
    currentDate = e.target.value;
    renderRecords();
  });
  
  // 教师切换
  teacherTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      teacherTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTeacher = btn.dataset.teacher;
      renderRecords();
    });
  });
  
  // 导航切换
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'teacher') {
        // 已在当前页
      } else if (page === 'child') {
        window.location.href = 'child.html';
      } else if (page === 'history') {
        window.location.href = 'history.html';
      } else if (page === 'class') {
        window.location.href = 'class.html';
      } else if (page === 'ai') {
        window.location.href = 'ai.html';
      }
    });
  });
}

// 渲染指标区域
function renderIndicators() {
  let html = '';
  
  CLASS_DATA.forEach(dim => {
    html += `<div class="dimension">`;
    html += `<div class="dimension-title">${dim.dimension}</div>`;
    
    dim.subDimensions.forEach(sub => {
      html += `<div class="sub-dimension">`;
      html += `<div class="sub-dimension-title">${sub.name}</div>`;
      html += `<div class="behavior-grid">`;
      
      sub.behaviors.forEach(behavior => {
        html += `<button class="behavior-btn" data-name="${behavior.name}" data-score="${behavior.score}">`;
        html += `<span class="name">${behavior.name}</span>`;
        html += `<span class="score">+${behavior.score}</span>`;
        html += `</button>`;
      });
      
      html += `</div></div>`;
    });
    
    html += `</div>`;
  });
  
  indicatorsSection.innerHTML = html;
  
  // 绑定行为按钮点击事件
  document.querySelectorAll('.behavior-btn').forEach(btn => {
    btn.addEventListener('click', handleBehaviorClick);
  });
}

// 处理行为点击
function handleBehaviorClick(e) {
  const btn = e.currentTarget;
  const name = btn.dataset.name;
  const score = parseInt(btn.dataset.score);
  
  // 触感反馈
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
  
  // 记录数据
  addTeacherRecord(currentDate, currentTeacher, name, score);
  
  // 更新记录列表
  renderRecords();
  
  // 按钮动画效果
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = '';
  }, 100);
}

// 渲染记录列表
function renderRecords() {
  const allRecords = getTeacherRecords(currentDate);
  // 筛选当前教师的记录
  const filteredRecords = allRecords
    .filter(r => r.teacherId === currentTeacher)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  if (filteredRecords.length === 0) {
    recordsList.innerHTML = '<div class="no-records">暂无记录</div>';
    return;
  }
  
  let html = '';
  filteredRecords.forEach(record => {
    html += `<div class="record-item" data-id="${record.id}">`;
    html += `<div class="record-info">`;
    html += `<div class="record-name">${record.behaviorName} (+${record.score})</div>`;
    html += `<div class="record-meta">${record.time}</div>`;
    html += `</div>`;
    html += `<button class="record-delete" data-id="${record.id}">删除</button>`;
    html += `</div>`;
  });
  
  recordsList.innerHTML = html;
  
  // 绑定删除事件
  document.querySelectorAll('.record-delete').forEach(btn => {
    btn.addEventListener('click', handleDeleteRecord);
  });
}

// 处理删除记录
function handleDeleteRecord(e) {
  const recordId = parseInt(e.target.dataset.id);
  
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
  
  deleteTeacherRecord(currentDate, recordId);
  renderRecords();
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
