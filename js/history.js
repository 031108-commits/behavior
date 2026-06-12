// 统计页面 JavaScript

let currentType = 'teacher'; // 'teacher' or 'child'
let currentTeacher = 'A';
let currentChildId = 'all';
let students = [];
let queryResults = [];
let heatmapChart = null;

// DOM元素
const typeTabs = document.getElementById('typeTabs');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const teacherSelector = document.getElementById('teacherSelector');
const childSelector = document.getElementById('childSelector');
const studentScroll = document.getElementById('studentScroll');
const queryBtn = document.getElementById('queryBtn');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const noDataTip = document.getElementById('noDataTip');
const exportBtn = document.getElementById('exportBtn');
const heatmapBtn = document.getElementById('heatmapBtn');
const heatmapWrapper = document.getElementById('heatmapWrapper');
const heatmapContainer = document.getElementById('heatmapContainer');
const heatmapTitle = document.getElementById('heatmapTitle');
const navItems = document.querySelectorAll('.nav-item');
const childDetailModal = document.getElementById('childDetailModal');

// 教师评价10个二级维度
const TEACHER_DIMENSIONS = [
  '积极氛围', '消极氛围', '教师敏感性', '尊重幼儿观点',
  '行为管理', '效率', '教学活动形式', '认知发展',
  '反馈质量', '语言示范'
];

// 幼儿评价14个领域
const CHILD_DOMAINS = [
  '书面表达者', '爱动手探究', '艺术欣赏家', '有趣的数学',
  '探究有方法', '空间探索者', '自信小主人', '我爱交朋友',
  '专注坚持力', '我爱幼儿园', '喜欢小图书', '艺术创作家',
  '灵活小手指', '阅读小能手'
];

// 初始化
function init() {
  students = getStudentList();
  
  // 设置默认日期范围（最近7天）
  const today = new Date();
  endDate.value = formatDate(today);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);
  startDate.value = formatDate(weekAgo);
  
  renderStudentSelector();
  updateSelectorVisibility();
  bindEvents();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// 格式化日期为 YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 获取日期范围内的所有日期
function getDateRange(start, end) {
  const dates = [];
  const current = new Date(start);
  const endDate = new Date(end);
  
  while (current <= endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// 渲染幼儿选择器
function renderStudentSelector() {
  let html = '<button class="student-item active" data-id="all">全部</button>';
  
  students.forEach(student => {
    html += `<button class="student-item" data-id="${student.id}">`;
    html += `${student.icon} ${student.name}`;
    html += `</button>`;
  });
  
  studentScroll.innerHTML = html;
  
  // 绑定点击事件
  studentScroll.querySelectorAll('.student-item').forEach(btn => {
    btn.addEventListener('click', () => {
      currentChildId = btn.dataset.id;
      studentScroll.querySelectorAll('.student-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
}

// 更新选择器可见性
function updateSelectorVisibility() {
  if (currentType === 'teacher') {
    teacherSelector.classList.remove('hidden');
    childSelector.classList.add('hidden');
  } else {
    teacherSelector.classList.add('hidden');
    childSelector.classList.remove('hidden');
  }
}

// 执行查询
function doQuery() {
  const start = startDate.value;
  const end = endDate.value;
  
  if (!start || !end) {
    alert('请选择日期范围');
    return;
  }
  
  if (new Date(start) > new Date(end)) {
    alert('开始日期不能晚于结束日期');
    return;
  }
  
  const dates = getDateRange(start, end);
  
  if (currentType === 'teacher') {
    queryTeacherData(dates);
  } else {
    queryChildData(dates);
  }
  
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}

// 查询教师评价数据
function queryTeacherData(dates) {
  const data = {};
  
  // 初始化
  TEACHER_DIMENSIONS.forEach(dim => {
    data[dim] = {};
    dates.forEach(date => {
      data[dim][date] = 0;
    });
  });
  
  // 收集数据
  dates.forEach(date => {
    const key = `teacher_records_${date}`;
    const records = JSON.parse(localStorage.getItem(key) || '[]');
    
    records.forEach(record => {
      if (record.teacherId === currentTeacher && record.type === 'teacher') {
        if (data[record.behaviorName]) {
          data[record.behaviorName][date] += record.score;
        }
      }
    });
  });
  
  queryResults = { type: 'teacher', dates, data, dimensions: TEACHER_DIMENSIONS };
  renderTable();
}

// 查询幼儿评价数据
function queryChildData(dates) {
  const data = {};
  
  // 初始化
  CHILD_DOMAINS.forEach(domain => {
    data[domain] = {};
    dates.forEach(date => {
      data[domain][date] = 0;
    });
  });
  
  // 收集数据
  dates.forEach(date => {
    const key = `child_records_${date}`;
    const records = JSON.parse(localStorage.getItem(key) || '[]');
    
    records.forEach(record => {
      if (record.type === 'child') {
        if (currentChildId === 'all' || record.childId.toString() === currentChildId) {
          if (data[record.categoryName]) {
            data[record.categoryName][date] += record.score;
          }
        }
      }
    });
  });
  
  queryResults = { type: 'child', dates, data, dimensions: CHILD_DOMAINS };
  renderTable();
}

// 渲染表格
function renderTable() {
  // 查询新数据后隐藏热力图
  hideHeatmap();
  
  if (!queryResults.dates || queryResults.dates.length === 0) {
    noDataTip.classList.remove('hidden');
    tableBody.innerHTML = '<tr><td>请选择条件后点击查询</td></tr>';
    return;
  }
  
  // 检查是否有数据
  let hasData = false;
  for (const dim in queryResults.data) {
    for (const date of queryResults.dates) {
      if (queryResults.data[dim][date] > 0) {
        hasData = true;
        break;
      }
    }
    if (hasData) break;
  }
  
  if (!hasData) {
    noDataTip.classList.remove('hidden');
    tableBody.innerHTML = '<tr><td>该范围内暂无数据</td></tr>';
    return;
  }
  
  noDataTip.classList.add('hidden');
  
  // 渲染表头
  let headHtml = '<tr><th>领域/日期</th>';
  queryResults.dates.forEach(date => {
    const shortDate = date.substring(5); // MM-DD格式
    headHtml += `<th>${shortDate}</th>`;
  });
  headHtml += '</tr>';
  tableHead.innerHTML = headHtml;
  
  // 渲染表体
  let bodyHtml = '';
  queryResults.dimensions.forEach((dim, index) => {
    const zebraClass = index % 2 === 0 ? 'zebra-light' : 'zebra-dark';
    bodyHtml += `<tr class="${zebraClass}"><td class="row-header">${dim}</td>`;
    
    queryResults.dates.forEach(date => {
      const value = queryResults.data[dim][date];
      bodyHtml += `<td>${value}</td>`;
    });
    
    bodyHtml += '</tr>';
  });
  tableBody.innerHTML = bodyHtml;
}

// 导出CSV
function exportCSV() {
  if (!queryResults.dates || queryResults.dates.length === 0) {
    alert('暂无数据可导出');
    return;
  }
  
  // 检查是否有数据
  let hasData = false;
  for (const dim in queryResults.data) {
    for (const date of queryResults.dates) {
      if (queryResults.data[dim][date] > 0) {
        hasData = true;
        break;
      }
    }
    if (hasData) break;
  }
  
  if (!hasData) {
    alert('暂无数据可导出');
    return;
  }
  
  const dimensions = currentType === 'teacher' ? TEACHER_DIMENSIONS : CHILD_DOMAINS;
  
  // 构建CSV
  let csv = '\uFEFF'; // BOM for UTF-8
  
  // 表头
  csv += `行为\\日期,${queryResults.dates.join(',')}\n`;
  
  // 数据行
  dimensions.forEach(dim => {
    const row = [dim];
    queryResults.dates.forEach(date => {
      row.push(queryResults.data[dim][date].toString());
    });
    csv += row.join(',') + '\n';
  });
  
  // 下载
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `区域观察统计_${startDate.value}_${endDate.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// 隐藏热力图
function hideHeatmap() {
  heatmapWrapper.style.display = 'none';
  if (heatmapChart) {
    heatmapChart.dispose();
    heatmapChart = null;
  }
}

// 生成热力图
function generateHeatmap() {
  if (!queryResults.dates || queryResults.dates.length === 0) {
    alert('暂无数据');
    return;
  }
  
  // 检查是否有数据
  let hasData = false;
  let maxValue = 0;
  for (const dim in queryResults.data) {
    for (const date of queryResults.dates) {
      const val = queryResults.data[dim][date];
      if (val > 0) {
        hasData = true;
        if (val > maxValue) maxValue = val;
      }
    }
  }
  
  if (!hasData) {
    alert('暂无数据');
    return;
  }
  
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
  
  // 显示热力图容器
  heatmapWrapper.style.display = 'block';
  
  // 设置标题
  const titleText = currentType === 'teacher' ? '教师评价热力图' : '幼儿评价热力图';
  heatmapTitle.textContent = titleText;
  
  // 准备数据
  const dimensions = queryResults.dimensions;
  const dates = queryResults.dates.map(d => d.substring(5)); // MM-DD格式
  
  // 构建热力图数据 [日期索引, 维度索引, 值]
  const heatmapData = [];
  dates.forEach((date, dateIndex) => {
    dimensions.forEach((dim, dimIndex) => {
      const value = queryResults.data[dim][queryResults.dates[dateIndex]];
      heatmapData.push([dateIndex, dimIndex, value]);
    });
  });
  
  // 销毁旧图表
  if (heatmapChart) {
    heatmapChart.dispose();
  }
  
  // 创建图表
  heatmapChart = echarts.init(heatmapContainer);
  
  const option = {
    title: {
      text: titleText,
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#333'
      }
    },
    tooltip: {
      position: 'top',
      formatter: function(params) {
        return `${dates[params.data[0]]}<br/>${dimensions[params.data[1]]}: ${params.data[2]}`;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 10,
        rotate: 45
      }
    },
    yAxis: {
      type: 'category',
      data: dimensions,
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 10
      }
    },
    visualMap: {
      min: 0,
      max: maxValue > 0 ? maxValue : 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
      }
    },
    series: [{
      name: '评分',
      type: 'heatmap',
      data: heatmapData,
      label: {
        show: true,
        fontSize: 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  heatmapChart.setOption(option);
  
  // 滚动到热力图位置
  heatmapWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 绑定事件
function bindEvents() {
  // 类型切换
  typeTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      typeTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSelectorVisibility();
      
      // 切换类型后隐藏热力图
      hideHeatmap();
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
  
  // 教师选择
  teacherSelector.querySelectorAll('.selector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTeacher = btn.dataset.teacher;
      teacherSelector.querySelectorAll('.selector-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
  
  // 查询按钮
  queryBtn.addEventListener('click', doQuery);
  
  // 导出按钮
  exportBtn.addEventListener('click', exportCSV);
  
  // 热力图按钮
  heatmapBtn.addEventListener('click', generateHeatmap);
  
  // 导航切换
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'teacher') {
        window.location.href = 'teacher.html';
      } else if (page === 'child') {
        window.location.href = 'child.html';
      } else if (page === 'history') {
        // 已在当前页
      } else if (page === 'class') {
        window.location.href = 'class.html';
      } else if (page === 'ai') {
        window.location.href = 'ai.html';
      }
    });
  });
  
  // 弹窗关闭
  document.getElementById('closeChildDetail').addEventListener('click', () => {
    childDetailModal.classList.add('hidden');
  });
  
  document.getElementById('closeChildDetailBtn').addEventListener('click', () => {
    childDetailModal.classList.add('hidden');
  });
  
  childDetailModal.addEventListener('click', (e) => {
    if (e.target === childDetailModal) {
      childDetailModal.classList.add('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
