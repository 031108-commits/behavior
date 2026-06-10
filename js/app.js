// 行为指标体系 - CLASS课堂互动评估量表
const behaviorSystem = {
  "❤️ 情感支持": {
    "积极氛围": [
      { id: 'pc_1', name: "温暖尊重", score: 1, fullDesc: '教师与幼儿之间表现出温暖、尊重的关系' },
      { id: 'pc_2', name: "积极情感", score: 2, fullDesc: '师幼间有积极的情感交流（微笑、笑声、鼓励性语言）' },
      { id: 'pc_3', name: "尊重接纳", score: 3, fullDesc: '教师对幼儿表现出尊重和接纳' },
      { id: 'pc_4', name: "同伴支持", score: 4, fullDesc: '教师鼓励幼儿之间的积极互动和相互支持' }
    ],
    "消极氛围（反向）": [
      { id: 'nc_1', name: "易怒否定", score: 1, fullDesc: '教师表现出易怒、严厉或否定性的情绪' },
      { id: 'nc_2', name: "威胁控制", score: 2, fullDesc: '教师对幼儿使用威胁、讽刺或严厉的控制' },
      { id: 'nc_3', name: "同伴冲突", score: 3, fullDesc: '幼儿之间出现严重的消极互动' }
    ],
    "教师敏感性": [
      { id: 'ts_1', name: "察觉需求", score: 1, fullDesc: '教师能够及时察觉幼儿的需求（安全、安慰、帮助）' },
      { id: 'ts_2', name: "个别支持", score: 2, fullDesc: '教师提供个别化的安慰、保证和支持' },
      { id: 'ts_3', name: "自由求助", score: 3, fullDesc: '幼儿能够自由地寻求教师的支持和帮助' }
    ],
    "尊重幼儿观点": [
      { id: 'rs_1', name: "鼓励表达", score: 1, fullDesc: '教师鼓励幼儿表达自己的想法和观点' },
      { id: 'rs_2', name: "提供选择", score: 2, fullDesc: '教师为幼儿提供选择的机会' },
      { id: 'rs_3', name: "尊重自主", score: 3, fullDesc: '教师在活动中尊重幼儿的自主性和领导力' }
    ]
  },
  "📋 班级管理": {
    "行为管理": [
      { id: 'bm_1', name: "清晰规则", score: 1, fullDesc: '教师清晰地陈述行为期望和规则' },
      { id: 'bm_2', name: "有效预防", score: 2, fullDesc: '教师能够有效防止和处理不当行为' },
      { id: 'bm_3', name: "幼儿自律", score: 3, fullDesc: '幼儿表现出恰当的行为和自控能力' }
    ],
    "效率": [
      { id: 'pr_1', name: "准备充分", score: 1, fullDesc: '教师为活动做好准备，过渡时间短' },
      { id: 'pr_2', name: "清楚规则", score: 2, fullDesc: '教师和幼儿都知道应该做什么，很少混乱' },
      { id: 'pr_3', name: "节奏适中", score: 3, fullDesc: '活动节奏适中，没有长时间的等待' }
    ],
    "教学活动形式": [
      { id: 'ilf_1', name: "多元方式", score: 1, fullDesc: '教师使用多种方式（讲解、示范、提问）让幼儿参与' },
      { id: 'ilf_2', name: "材料激发", score: 2, fullDesc: '教师有效使用材料和教具激发幼儿兴趣' },
      { id: 'ilf_3', name: "持续参与", score: 3, fullDesc: '幼儿对活动表现出持续的兴趣和参与' }
    ]
  },
  "🧠 教育支持": {
    "认知发展": [
      { id: 'cd_1', name: "分析推理", score: 1, fullDesc: '教师鼓励幼儿分析和推理（为什么？怎么样？）' },
      { id: 'cd_2', name: "联系经验", score: 2, fullDesc: '教师将活动与幼儿已有经验相联系' },
      { id: 'cd_3', name: "丰富解释", score: 3, fullDesc: '教师提供丰富的解释和扩展性信息' }
    ],
    "反馈质量": [
      { id: 'qf_1', name: "具体反馈", score: 1, fullDesc: '教师给予幼儿具体的、过程性的反馈' },
      { id: 'qf_2', name: "追问扩展", score: 2, fullDesc: '教师通过追问帮助幼儿扩展和深化理解' },
      { id: 'qf_3', name: "鼓励解释", score: 3, fullDesc: '教师鼓励幼儿解释自己的思考和解决问题的过程' }
    ],
    "语言示范": [
      { id: 'lm_1', name: "丰富词汇", score: 1, fullDesc: '教师使用丰富的词汇和语言描述' },
      { id: 'lm_2', name: "往复对话", score: 2, fullDesc: '教师与幼儿进行频繁的、往复的对话交流' },
      { id: 'lm_3', name: "开放提问", score: 3, fullDesc: '教师通过开放式问题扩展幼儿的语言表达' }
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