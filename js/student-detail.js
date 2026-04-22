// 初始化应用
App.initApp();

// 全局变量
let studentId = null;
let student = null;
let startDate = '';
let endDate = '';

// DOM 元素
const studentNameEl = document.getElementById('studentName');
const studentGenderEl = document.getElementById('studentGender');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const searchBtn = document.getElementById('searchBtn');
const tableBody = document.getElementById('tableBody');
const subDetailContainer = document.getElementById('subDetailContainer');

// 获取 URL 参数
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    studentId: params.get('studentId')
  };
}

// 加载幼儿信息
function loadStudentInfo() {
  const params = getUrlParams();
  studentId = parseInt(params.studentId);
  
  if (!studentId) {
    studentNameEl.textContent = '未找到幼儿信息';
    return;
  }
  
  const students = App.getClassStudents();
  student = students.find(s => s.id === studentId);
  
  if (student) {
    studentNameEl.textContent = student.name;
    studentGenderEl.textContent = student.gender === '男' ? '👦' : '👧';
  } else {
    studentNameEl.textContent = '未找到幼儿信息';
  }
}

// 初始化日期范围
function initDateRange() {
  const last7Days = App.getLast7Days();
  startDateInput.value = last7Days.start;
  endDateInput.value = last7Days.end;
  startDate = last7Days.start;
  endDate = last7Days.end;
}

// 查询统计数据
function searchStats() {
  App.vibrate();
  startDate = startDateInput.value;
  endDate = endDateInput.value;
  
  if (startDate > endDate) {
    alert('开始日期不能晚于结束日期');
    return;
  }
  
  if (!student) return;
  
  // 获取日期范围内的记录
  const records = App.getRecordsByDateRange(startDate, endDate);
  // 筛选当前幼儿的记录
  const studentRecords = records.filter(record => record.studentId === studentId);
  
  // 生成表格
  generateTable(studentRecords);
  // 清空子详情
  subDetailContainer.innerHTML = '';
}

// 生成统计表格
function generateTable(records) {
  tableBody.innerHTML = '';
  
  // 计算每个二级维度的得分
  const scoresByDimension = App.calculateScoresByDimension(records);
  
  // 获取所有二级维度
  const dimensions = App.getAllSecondaryDimensions();
  
  // 生成表格内容
  dimensions.forEach(dimension => {
    const tr = document.createElement('tr');
    tr.dataset.dimension = dimension;
    
    const tdDimension = document.createElement('td');
    tdDimension.textContent = dimension;
    
    const tdScore = document.createElement('td');
    tdScore.textContent = scoresByDimension[dimension] || 0;
    
    tr.appendChild(tdDimension);
    tr.appendChild(tdScore);
    
    // 添加点击事件
    tr.addEventListener('click', () => {
      App.vibrate();
      showSubDetail(dimension, records);
    });
    
    tableBody.appendChild(tr);
  });
}

// 显示子维度详情
function showSubDetail(dimension, records) {
  // 筛选该维度的记录
  const dimensionRecords = records.filter(record => {
    // 查找记录对应的二级维度
    for (const primary in App.behaviorSystem) {
      if (App.behaviorSystem[primary][dimension]) {
        const behaviors = App.behaviorSystem[primary][dimension];
        if (behaviors.some(b => b.name === record.behaviorName)) {
          return true;
        }
      }
    }
    return false;
  });
  
  // 按三级行为统计
  const behaviorScores = App.calculateScoresByBehavior(dimensionRecords);
  
  // 生成子详情
  subDetailContainer.innerHTML = '';
  
  const subDetail = document.createElement('div');
  subDetail.className = 'sub-detail';
  subDetail.innerHTML = `<h4>${dimension} - 详细记录</h4>`;
  
  if (Object.keys(behaviorScores).length === 0) {
    subDetail.innerHTML += '<p>暂无记录</p>';
  } else {
    Object.entries(behaviorScores).forEach(([behaviorName, data]) => {
      const item = document.createElement('div');
      item.className = 'sub-detail-item';
      item.innerHTML = `
        <span>${behaviorName}(${data.score}分)</span>
        <span>${data.count}次，共${data.totalScore}分</span>
      `;
      subDetail.appendChild(item);
    });
  }
  
  subDetailContainer.appendChild(subDetail);
}

// 事件监听器
searchBtn.addEventListener('click', searchStats);

// 初始化
function init() {
  loadStudentInfo();
  initDateRange();
  searchStats();
}

// 启动应用
init();