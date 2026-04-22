// 初始化应用
App.initApp();

// 全局变量
let selectedStudentId = 0; // 0 表示全班
let startDate = '';
let endDate = '';
let currentTableData = [];
let dateHeaders = [];

// DOM 元素
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const searchBtn = document.getElementById('searchBtn');
const studentsFilter = document.getElementById('studentsFilter');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const exportBtn = document.getElementById('exportBtn');
const heatmapBtn = document.getElementById('heatmapBtn');

// 初始化日期范围
const last7Days = App.getLast7Days();
startDateInput.value = last7Days.start;
endDateInput.value = last7Days.end;
startDate = last7Days.start;
endDate = last7Days.end;

// 加载幼儿筛选器
function loadStudentsFilter() {
  const students = App.getClassStudents();
  
  // 清空现有内容
  studentsFilter.innerHTML = '';
  
  // 添加全班选项
  const allStudentsOption = document.createElement('div');
  allStudentsOption.className = 'student-item active';
  allStudentsOption.dataset.id = '0';
  allStudentsOption.innerHTML = `
    <div>全班幼儿</div>
    <div class="student-gender">👥</div>
  `;
  allStudentsOption.addEventListener('click', () => {
    App.vibrate();
    selectStudent(allStudentsOption);
  });
  studentsFilter.appendChild(allStudentsOption);
  
  students.forEach(student => {
    const studentItem = document.createElement('div');
    studentItem.className = 'student-item';
    studentItem.dataset.id = student.id;
    
    studentItem.innerHTML = `
      <div>${student.name}</div>
      <div class="student-gender">${student.gender === '男' ? '👦' : '👧'}</div>
    `;
    
    studentItem.addEventListener('click', () => {
      App.vibrate();
      selectStudent(studentItem);
    });
    
    studentsFilter.appendChild(studentItem);
  });
}

// 选择幼儿
function selectStudent(studentItem) {
  // 移除其他选项的选中状态
  document.querySelectorAll('.student-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 添加当前选项的选中状态
  studentItem.classList.add('active');
  
  // 保存选中的幼儿ID
  selectedStudentId = parseInt(studentItem.dataset.id);
  
  // 重新查询数据
  searchStats();
}

// 生成日期数组
function generateDateArray(start, end) {
  const dates = [];
  const currentDate = new Date(start);
  const endDate = new Date(end);
  
  while (currentDate <= endDate) {
    dates.push(App.formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// 格式化日期为 MM-DD
function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
  
  // 获取日期范围内的记录
  let records = App.getRecordsByDateRange(startDate, endDate);
  
  // 如果选择了特定幼儿，筛选记录
  if (selectedStudentId > 0) {
    records = records.filter(record => record.studentId === selectedStudentId);
  }
  
  // 生成日期数组
  const dates = generateDateArray(startDate, endDate);
  
  // 生成表格
  generateTable(dates, records);
}

// 更新导出按钮状态
function updateExportButtonState(hasData) {
  if (hasData) {
    exportBtn.disabled = false;
    exportBtn.style.opacity = '1';
    exportBtn.style.cursor = 'pointer';
  } else {
    exportBtn.disabled = true;
    exportBtn.style.opacity = '0.5';
    exportBtn.style.cursor = 'not-allowed';
  }
}

// 生成统计表格
function generateTable(dates, records) {
  // 清空表格
  tableHeader.innerHTML = '<th>维度</th>';
  tableBody.innerHTML = '';
  
  // 重置全局数据
  currentTableData = [];
  dateHeaders = dates.map(date => formatDateShort(date));
  
  // 添加日期列
  dates.forEach(date => {
    const th = document.createElement('th');
    th.textContent = formatDateShort(date);
    tableHeader.appendChild(th);
  });
  
  // 获取所有二级维度
  const dimensions = App.getAllSecondaryDimensions();
  
  // 生成表格内容
  dimensions.forEach(dimension => {
    const tr = document.createElement('tr');
    const rowData = {
      behavior: dimension,
      counts: []
    };
    
    // 添加维度名称
    const tdDimension = document.createElement('td');
    tdDimension.textContent = dimension;
    tr.appendChild(tdDimension);
    
    // 计算每个日期的得分
    dates.forEach(date => {
      const dayRecords = records.filter(record => record.date === date);
      const dimensionScore = calculateDimensionScore(dayRecords, dimension);
      rowData.counts.push(dimensionScore);
      
      const tdScore = document.createElement('td');
      tdScore.textContent = dimensionScore;
      tr.appendChild(tdScore);
    });
    
    tableBody.appendChild(tr);
    currentTableData.push(rowData);
  });
  
  // 更新导出按钮状态
  const hasData = records.length > 0;
  updateExportButtonState(hasData);
  
  // 自动滚动到表格位置
  document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth' });
}

// 计算指定维度的得分
function calculateDimensionScore(records, dimension) {
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
  
  return score;
}

// 导出表格为Excel (CSV格式)
function exportTable() {
  App.vibrate();
  
  if (!currentTableData.length) {
    alert('暂无数据可导出');
    return;
  }
  
  // 构建表头
  let csvContent = '行为\日期,' + dateHeaders.join(',') + '\n';
  
  // 构建数据行
  currentTableData.forEach(row => {
    const rowData = [row.behavior, ...row.counts];
    csvContent += rowData.join(',') + '\n';
  });
  
  // 添加 BOM 以支持中文
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 触发下载
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `建构统计_${startDateInput.value}_${endDateInput.value}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 事件监听器
searchBtn.addEventListener('click', searchStats);
exportBtn.addEventListener('click', exportTable);
if (heatmapBtn) {
  heatmapBtn.addEventListener('click', generateHeatmap);
}

// 生成热力图
function generateHeatmap() {
  App.vibrate();
  
  if (currentTableData.length === 0) {
    alert('暂无数据');
    return;
  }
  
  // 显示热力图容器
  const heatmapContainer = document.getElementById('heatmapContainer');
  heatmapContainer.style.display = 'block';
  
  // 初始化 ECharts 实例
  const myChart = echarts.init(heatmapContainer);
  
  // 准备数据
  const dimensions = currentTableData.map(item => item.behavior);
  const dates = dateHeaders;
  
  // 计算最大分值
  let maxScore = 0;
  currentTableData.forEach(item => {
    item.counts.forEach(score => {
      if (score > maxScore) {
        maxScore = score;
      }
    });
  });
  
  // 生成热力图数据
  const heatmapData = [];
  currentTableData.forEach((item, dimIndex) => {
    item.counts.forEach((score, dateIndex) => {
      heatmapData.push([dimIndex, dateIndex, score]);
    });
  });
  
  // 配置项
  const option = {
    title: { text: '建构能力发展热力图', left: 'center' },
    xAxis: { 
      type: 'category',
      data: dimensions,  // 8个二级维度
      axisLabel: { rotate: 45, fontSize: 11 }
    },
    yAxis: { 
      type: 'category',
      data: dates,  // 日期数组
      axisLabel: { fontSize: 11 }
    },
    visualMap: {
      min: 0,
      max: maxScore,  // 动态计算最大分值
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
      inRange: { color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'] }
    },
    series: [{
      type: 'heatmap',
      data: heatmapData,
      label: { show: true, fontSize: 10 },
      emphasis: { itemStyle: { borderColor: '#333', borderWidth: 1 } }
    }],
    grid: { height: '70%', top: '15%' }
  };
  
  // 渲染图表
  myChart.setOption(option);
  
  // 响应式调整
  window.addEventListener('resize', function() {
    myChart.resize();
  });
}

// 初始化
function init() {
  loadStudentsFilter();
  searchStats();
}

// 启动应用
init();