// 行为指标体系
const behaviorSystem = {
  "主动性": {
    "自我概念": [
      { name: "说出意愿", score: 1 },
      { name: "表达情绪", score: 2 },
      { name: "独立完成", score: 3 },
      { name: "尝试重复", score: 4 },
      { name: "描述作品", score: 5 },
      { name: "对比他人", score: 6 },
      { name: "制定目标", score: 7 }
    ],
    "选取材料": [
      { name: "随意抓取", score: 1 },
      { name: "按指令选", score: 2 },
      { name: "自主选材", score: 3 },
      { name: "功能选材", score: 4 },
      { name: "美感组合", score: 5 },
      { name: "创新用材", score: 6 },
      { name: "规划分享", score: 7 }
    ]
  },
  "建构能力": {
    "运用建构方式": [
      { name: "平铺", score: 1 },
      { name: "垒高", score: 2 },
      { name: "架空", score: 3 },
      { name: "围合", score: 4 },
      { name: "模式", score: 5 },
      { name: "综合建构", score: 6 },
      { name: "创意主题", score: 7 }
    ],
    "再现建构主题": [
      { name: "无主题", score: 1 },
      { name: "想象搭建", score: 2 },
      { name: "参照实物", score: 3 },
      { name: "参照平面图", score: 4 },
      { name: "简单主题", score: 5 },
      { name: "复杂主题", score: 6 },
      { name: "自主设计", score: 7 }
    ],
    "合作交往": [
      { name: "协商分工", score: 1 },
      { name: "遵守规则", score: 2 },
      { name: "帮助同伴", score: 3 },
      { name: "创新建议", score: 4 },
      { name: "协调冲突", score: 5 },
      { name: "领导团队", score: 6 },
      { name: "反思改进", score: 7 }
    ],
    "游戏持续性": [
      { name: "＜5分钟", score: 1 },
      { name: "6~9分钟", score: 2 },
      { name: "10~14分钟", score: 3 },
      { name: "15~19分钟", score: 4 },
      { name: "20~24分钟", score: 5 },
      { name: "25~29分钟", score: 6 },
      { name: "≥30分钟", score: 7 }
    ],
    "问题解决": [
      { name: "寻求成人", score: 1 },
      { name: "同伴商量", score: 2 },
      { name: "独立尝试", score: 3 },
      { name: "提出方案", score: 4 },
      { name: "灵活调整", score: 5 },
      { name: "创造性解", score: 6 },
      { name: "总结经验", score: 7 }
    ]
  },
  "自我管理": {
    "分享交流": [
      { name: "无交流", score: 1 },
      { name: "单词回应", score: 2 },
      { name: "简单描述", score: 3 },
      { name: "细节补充", score: 4 },
      { name: "完整表达", score: 5 },
      { name: "主动提问", score: 6 },
      { name: "深度共情", score: 7 }
    ]
  }
};

// 获取所有二级维度
function getAllSecondaryDimensions() {
  const dimensions = [];
  for (const primary in behaviorSystem) {
    for (const secondary in behaviorSystem[primary]) {
      dimensions.push(secondary);
    }
  }
  return dimensions;
}

// 初始化班级幼儿数据
function initClassStudents() {
  const defaultStudents = [
    { id: 1, name: "张小明", gender: "男" },
    { id: 2, name: "李小萌", gender: "女" },
    { id: 3, name: "王天天", gender: "男" }
  ];
  
  if (!localStorage.getItem('class_student_list')) {
    localStorage.setItem('class_student_list', JSON.stringify(defaultStudents));
  }
}

// 获取班级幼儿列表
function getClassStudents() {
  initClassStudents();
  return JSON.parse(localStorage.getItem('class_student_list') || '[]');
}

// 添加幼儿
function addStudent(name, gender) {
  const students = getClassStudents();
  const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent = { id: newId, name, gender };
  students.push(newStudent);
  localStorage.setItem('class_student_list', JSON.stringify(students));
  return newStudent;
}

// 删除幼儿
function deleteStudent(id) {
  const students = getClassStudents();
  const filteredStudents = students.filter(s => s.id !== id);
  localStorage.setItem('class_student_list', JSON.stringify(filteredStudents));
}

// 获取指定日期的记录
function getRecordsByDate(date) {
  const key = `records_${date}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// 保存记录
function saveRecord(record) {
  const key = `records_${record.date}`;
  const records = getRecordsByDate(record.date);
  records.push(record);
  localStorage.setItem(key, JSON.stringify(records));
}

// 删除记录
function deleteRecord(date, index) {
  const key = `records_${date}`;
  const records = getRecordsByDate(date);
  records.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(records));
}

// 获取日期范围内的记录
function getRecordsByDateRange(startDate, endDate) {
  const records = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    const dateStr = formatDate(currentDate);
    const dayRecords = getRecordsByDate(dateStr);
    records.push(...dayRecords);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return records;
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取今日日期
function getToday() {
  return formatDate(new Date());
}

// 计算最近7天的日期范围
function getLast7Days() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}

// 计算记录的总分
function calculateTotalScore(records) {
  return records.reduce((total, record) => {
    return total + (record.score || 1);
  }, 0);
}

// 按二级维度分组计算分数
function calculateScoresByDimension(records) {
  const scores = {};
  
  // 初始化所有二级维度
  for (const primary in behaviorSystem) {
    for (const secondary in behaviorSystem[primary]) {
      scores[secondary] = 0;
    }
  }
  
  // 计算每个维度的分数
  records.forEach(record => {
    // 查找记录对应的二级维度
    for (const primary in behaviorSystem) {
      for (const secondary in behaviorSystem[primary]) {
        const behaviors = behaviorSystem[primary][secondary];
        if (behaviors.some(b => b.name === record.behaviorName)) {
          scores[secondary] += (record.score || 1);
          break;
        }
      }
    }
  });
  
  return scores;
}

// 按三级行为统计
function calculateScoresByBehavior(records) {
  const behaviorScores = {};
  
  records.forEach(record => {
    if (!behaviorScores[record.behaviorName]) {
      behaviorScores[record.behaviorName] = {
        count: 0,
        totalScore: 0,
        score: record.score || 1
      };
    }
    behaviorScores[record.behaviorName].count++;
    behaviorScores[record.behaviorName].totalScore += (record.score || 1);
  });
  
  return behaviorScores;
}

// 触感反馈
function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

// 注册 Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    if (window.location.protocol === 'file:') {
      console.warn('当前为本地文件协议，Service Worker 无法注册。请通过 http:// 访问以启用离线功能。');
    } else {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  }
}

// 初始化应用
function initApp() {
  initClassStudents();
  registerServiceWorker();
}

// 导出公共函数
window.App = {
  behaviorSystem,
  getAllSecondaryDimensions,
  getClassStudents,
  addStudent,
  deleteStudent,
  getRecordsByDate,
  saveRecord,
  deleteRecord,
  getRecordsByDateRange,
  formatDate,
  getToday,
  getLast7Days,
  calculateTotalScore,
  calculateScoresByDimension,
  calculateScoresByBehavior,
  vibrate,
  initApp
};