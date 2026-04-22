// 初始化应用
window.addEventListener('DOMContentLoaded', function() {
  initDateRange();
  loadStudentsFilter();
  setupEventListeners();
});

// 全局变量
let selectedStudentId = 0; // 0 表示全班
let currentTableData = [];
let dateHeaders = [];

// 初始化日期范围
function initDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // 默认最近7天
  
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  
  if (!startDateInput || !endDateInput) {
    console.warn('日期选择器元素不存在');
    return;
  }
  
  startDateInput.valueAsDate = startDate;
  endDateInput.valueAsDate = endDate;
}

// 加载幼儿筛选器
function loadStudentsFilter() {
  const filterContainer = document.getElementById('studentsFilter');
  if (!filterContainer) return;
  
  // 清空容器
  filterContainer.innerHTML = '';
  
  // 添加全班选项
  const allStudentsOption = document.createElement('div');
  allStudentsOption.className = 'filter-item active';
  allStudentsOption.dataset.id = '0';
  allStudentsOption.innerHTML = '<span>全班幼儿</span>';
  allStudentsOption.addEventListener('click', function() {
    App.vibrate();
    // 移除其他选中状态
    document.querySelectorAll('.filter-item').forEach(item => item.classList.remove('active'));
    // 添加当前选中状态
    this.classList.add('active');
    selectedStudentId = 0;
  });
  filterContainer.appendChild(allStudentsOption);
  
  // 添加幼儿选项
  const students = App.getClassStudents();
  students.forEach(student => {
    const studentItem = document.createElement('div');
    studentItem.className = 'filter-item';
    studentItem.dataset.id = student.id;
    studentItem.innerHTML = `
      <span>${student.name}</span>
      <span class="gender-icon">${student.gender === '男' ? '👦' : '👧'}</span>
    `;
    studentItem.addEventListener('click', function() {
      App.vibrate();
      // 移除其他选中状态
      document.querySelectorAll('.filter-item').forEach(item => item.classList.remove('active'));
      // 添加当前选中状态
      this.classList.add('active');
      selectedStudentId = parseInt(this.dataset.id);
    });
    filterContainer.appendChild(studentItem);
  });
}

// 设置事件监听器
function setupEventListeners() {
  const aiAnalyzeBtn = document.getElementById('aiAnalyzeBtn');
  if (aiAnalyzeBtn) {
    aiAnalyzeBtn.addEventListener('click', startAnalysis);
  }
}

// 开始分析
function startAnalysis() {
  App.vibrate();
  
  // 获取 API Key
  const apiKey = document.getElementById('apiKey').value;
  if (!apiKey) {
    alert('请输入 DeepSeek API Key');
    return;
  }
  
  // 获取日期范围
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  if (!startDate || !endDate) {
    alert('请选择日期范围');
    return;
  }
  
  // 显示加载状态
  const aiResult = document.getElementById('aiResult');
  aiResult.innerHTML = '<p>AI 正在分析中，请稍候...</p>';
  
  // 收集数据
  const records = collectRecords(startDate, endDate, selectedStudentId);
  
  if (records.length === 0) {
    aiResult.innerHTML = '<p>所选日期范围内无数据</p>';
    return;
  }
  
  // 计算二级维度得分
  const dimensionScores = calculateDimensionScores(records);
  
  // 保存数据到全局变量
  currentTableData = dimensionScores;
  
  // 生成日期表头
  const start = new Date(startDate);
  const end = new Date(endDate);
  dateHeaders = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dateHeaders.push(`${month}-${day}`);
  }
  
  // 整理数据摘要
  let studentName = '全班幼儿';
  if (selectedStudentId !== 0) {
    const student = App.getClassStudents().find(s => s.id === selectedStudentId);
    if (student) {
      studentName = student.name;
    }
  }
  
  const dataSummary = {
    dateRange: `${startDate} 至 ${endDate}`,
    student: studentName,
    dimensions: dimensionScores
  };
  
  // 调用 AI 分析
  callAIAnalysis(apiKey, dataSummary);
}

// 收集记录
function collectRecords(startDate, endDate, studentId) {
  const records = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // 遍历日期范围内的所有日期
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = App.formatDate(d);
    const dayRecords = App.getRecordsByDate(dateStr);
    
    // 过滤幼儿
    if (studentId !== 0) {
      const filteredRecords = dayRecords.filter(record => record.studentId === studentId);
      records.push(...filteredRecords);
    } else {
      records.push(...dayRecords);
    }
  }
  
  return records;
}

// 计算二级维度得分
function calculateDimensionScores(records) {
  // 获取所有二级维度
  const dimensions = App.getAllSecondaryDimensions();
  const dimensionScores = [];
  
  dimensions.forEach(dimension => {
    let score = 0;
    
    records.forEach(record => {
      // 查找记录对应的二级维度
      for (const primary in App.behaviorSystem) {
        if (App.behaviorSystem[primary][dimension]) {
          const behaviors = App.behaviorSystem[primary][dimension];
          if (behaviors.some(b => b.name === record.behaviorName)) {
            score += (record.score || 1);
            break;
          }
        }
      }
    });
    
    dimensionScores.push({
      behavior: dimension,
      score: score
    });
  });
  
  return dimensionScores;
}

// 调用 AI 分析
function callAIAnalysis(apiKey, dataSummary) {
  const aiResult = document.getElementById('aiResult');
  
  // 获取教师输入的分析需求
  const teacherQuestion = document.getElementById('teacherQuestion').value || '请对以上数据进行综合分析，指出主要发现和教育建议。';
  
  /* !!!安全警告：此代码仅为本地演示，API Key 绝不能明文提交到公开仓库。如需部署，请使用后端代理或环境变量。 */
  
  fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一名资深的幼儿教育专家，擅长分析建构游戏中的儿童行为数据。请根据用户提供的数据和需求，生成一份专业、温暖、有指导意义的分析报告。'
        },
        {
          role: 'user',
          content: `你是一名幼儿教育专家。以下是在 ${dataSummary.dateRange} 期间，${dataSummary.student} 的建构游戏行为数据：\n${JSON.stringify(dataSummary.dimensions)}\n\n老师提出的分析需求是：${teacherQuestion}\n\n请结合数据和老师的需求，生成一份专业的分析报告。`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const analysis = data.choices[0].message.content;
      aiResult.innerHTML = `<p>${analysis.replace(/\n/g, '<br>')}</p>`;
    } else {
      throw new Error('Invalid API response');
    }
  })
  .catch(error => {
    console.error('AI analysis error:', error);
    let errorMessage = '分析失败，请稍后重试';
    
    if (error.message.includes('401')) {
      errorMessage = 'API 密钥错误，请检查配置';
    } else if (error.message.includes('429')) {
      errorMessage = '请求过于频繁，请稍后再试';
    } else if (error.message.includes('500')) {
      errorMessage = '服务器错误，请稍后重试';
    }
    
    aiResult.innerHTML = `<p style="color: #dc3545;">${errorMessage}</p>`;
  });
}