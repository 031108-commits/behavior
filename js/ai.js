// AI 视频分析功能
window.addEventListener('DOMContentLoaded', function() {
  initChildSelector();
  initDatePicker();
  initVideoUpload();
  initParamsToggle();
  initAnalyzeButton();
  initTabSwitching();
});

// 全局变量
let selectedChildId = null;
let videoFile = null;

// ============ 幼儿选择器 ============
function initChildSelector() {
  const childScroll = document.getElementById('childScroll');
  if (!childScroll) return;
  
  childScroll.innerHTML = '';
  
  // 添加"未选择"选项
  const noSelectItem = document.createElement('div');
  noSelectItem.className = 'child-item';
  noSelectItem.dataset.id = '';
  noSelectItem.innerHTML = '<span class="child-avatar">❓</span><span class="child-name">未选择</span>';
  noSelectItem.addEventListener('click', function() {
    App.vibrate();
    selectChild(null, this);
  });
  childScroll.appendChild(noSelectItem);
  
  // 添加幼儿选项
  const students = App.getClassStudents();
  students.forEach(student => {
    const childItem = document.createElement('div');
    childItem.className = 'child-item';
    childItem.dataset.id = student.id;
    childItem.innerHTML = `
      <span class="child-avatar">${student.gender === '男' ? '👦' : '👧'}</span>
      <span class="child-name">${student.name}</span>
    `;
    childItem.addEventListener('click', function() {
      App.vibrate();
      selectChild(student.id, this);
    });
    childScroll.appendChild(childItem);
  });
}

function selectChild(childId, element) {
  document.querySelectorAll('.child-item').forEach(item => item.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }
  selectedChildId = childId;
}

// ============ 日期选择器 ============
function initDatePicker() {
  const dateInput = document.getElementById('observationDate');
  if (!dateInput) return;
  
  const today = new Date();
  dateInput.valueAsDate = today;
}

// ============ 视频上传 ============
function initVideoUpload() {
  const uploadArea = document.getElementById('videoUploadArea');
  const videoInput = document.getElementById('videoInput');
  const removeBtn = document.getElementById('removeVideoBtn');
  
  if (!uploadArea || !videoInput) return;
  
  // 点击上传
  uploadArea.addEventListener('click', function() {
    videoInput.click();
  });
  
  // 文件选择
  videoInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
      handleVideoFile(e.target.files[0]);
    }
  });
  
  // 拖拽上传
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        handleVideoFile(file);
      } else {
        alert('请上传视频文件');
      }
    }
  });
  
  // 移除视频
  if (removeBtn) {
    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      removeVideo();
    });
  }
}

function handleVideoFile(file) {
  videoFile = file;
  
  const uploadArea = document.getElementById('videoUploadArea');
  const videoPreview = document.getElementById('videoPreview');
  const previewVideo = document.getElementById('previewVideo');
  
  uploadArea.style.display = 'none';
  videoPreview.style.display = 'block';
  
  const url = URL.createObjectURL(file);
  previewVideo.src = url;
}

function removeVideo() {
  videoFile = null;
  
  const uploadArea = document.getElementById('videoUploadArea');
  const videoPreview = document.getElementById('videoPreview');
  const videoInput = document.getElementById('videoInput');
  const previewVideo = document.getElementById('previewVideo');
  
  uploadArea.style.display = 'flex';
  videoPreview.style.display = 'none';
  previewVideo.src = '';
  if (videoInput) videoInput.value = '';
}

// ============ 参数折叠面板 ============
function initParamsToggle() {
  const toggles = [
    { header: 'toggleApiToken', content: 'apiTokenContent' },
    { header: 'toggleWorkflowId', content: 'workflowIdContent' }
  ];
  
  toggles.forEach(toggle => {
    const header = document.getElementById(toggle.header);
    const content = document.getElementById(toggle.content);
    
    if (header && content) {
      header.addEventListener('click', function() {
        App.vibrate();
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? 'block' : 'none';
        header.querySelector('.toggle-arrow').textContent = isHidden ? '▲' : '▼';
      });
    }
  });
}

// ============ 分析按钮 ============
function initAnalyzeButton() {
  const btn = document.getElementById('startAnalyzeBtn');
  if (btn) {
    btn.addEventListener('click', startAnalysis);
  }
}

// ============ 选项卡切换 ============
function initTabSwitching() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      App.vibrate();
      
      // 切换按钮状态
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // 切换内容
      const tabName = this.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      document.getElementById('tab' + capitalize(tabName)).style.display = 'block';
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============ 开始分析流程 ============
async function startAnalysis() {
  App.vibrate();
  
  // 验证视频
  if (!videoFile) {
    alert('请先上传视频');
    return;
  }
  
  // 验证 API Token
  const apiToken = document.getElementById('apiToken').value;
  if (!apiToken) {
    alert('请输入 API Token');
    return;
  }
  
  // 验证工作流 ID
  const workflowId = document.getElementById('workflowId').value;
  if (!workflowId) {
    alert('请输入工作流 ID');
    return;
  }
  
  // 获取参数
  const gameType = document.getElementById('gameTypeSelect').value;
  const observationDate = document.getElementById('observationDate').value;
  
  // 显示进度
  showProgress();
  
  try {
    // 调用扣子工作流（直接上传视频）
    updateProgress('正在上传视频...', '');
    const result = await callCozeWorkflow(
      apiToken,
      workflowId,
      videoFile,
      gameType,
      `观察日期: ${observationDate}, 幼儿ID: ${selectedChildId || '未指定'}`
    );
    
    // 展示结果
    hideProgress();
    displayResults(result);
    
  } catch (error) {
    hideProgress();
    alert('分析失败: ' + error.message);
    console.error(error);
  }
}

// ============ 扣子工作流 API（直接上传视频） ============
async function callCozeWorkflow(apiToken, workflowId, videoFile, gameType, observationNotes) {
  // 创建 FormData 直接上传视频文件
  const formData = new FormData();
  formData.append('file', videoFile);  // 视频文件
  formData.append('workflow_id', workflowId);
  formData.append('parameters', JSON.stringify({
    game_type: gameType,
    observation_notes: observationNotes
  }));
  
  updateProgress('正在等待 AI 分析...', '');
  
  const response = await fetch('https://api.coze.cn/v1/workflow/run', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiToken
      // 注意：不设置 Content-Type，让浏览器自动设置 multipart/form-data
    },
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (data.code !== 0) {
    throw new Error(data.msg || '工作流执行失败');
  }
  
  // 返回工作流结果
  return data.data;
}

// ============ 进度显示 ============
function showProgress() {
  const progressSection = document.getElementById('progressSection');
  const resultSection = document.getElementById('resultSection');
  const analyzeBtn = document.getElementById('startAnalyzeBtn');
  
  if (progressSection) progressSection.style.display = 'flex';
  if (resultSection) resultSection.style.display = 'none';
  if (analyzeBtn) analyzeBtn.disabled = true;
}

function hideProgress() {
  const progressSection = document.getElementById('progressSection');
  const analyzeBtn = document.getElementById('startAnalyzeBtn');
  
  if (progressSection) progressSection.style.display = 'none';
  if (analyzeBtn) analyzeBtn.disabled = false;
}

function updateProgress(text, detail) {
  const progressText = document.getElementById('progressText');
  const progressDetail = document.getElementById('progressDetail');
  
  if (progressText) progressText.textContent = text;
  if (progressDetail) progressDetail.textContent = detail;
}

// ============ 结果展示 ============
function displayResults(result) {
  const resultSection = document.getElementById('resultSection');
  if (resultSection) resultSection.style.display = 'block';
  
  // 解析工作流返回的内容
  const output = result.outputs || result;
  const content = typeof output === 'string' ? output : JSON.stringify(output);
  
  // 提取检核表和分析报告
  const parts = extractReportParts(content);
  
  // 渲染检核表
  renderChecklistTable(parts.checklist);
  
  // 渲染分析报告
  const reportContent = document.getElementById('reportContent');
  if (reportContent) {
    reportContent.innerHTML = `<div class="report-text">${parts.report.replace(/\n/g, '<br>')}</div>`;
  }
  
  // 渲染谈话建议
  const suggestionsContent = document.getElementById('suggestionsContent');
  if (suggestionsContent) {
    suggestionsContent.innerHTML = `<div class="suggestions-text">${parts.suggestions.replace(/\n/g, '<br>')}</div>`;
  }
}

function extractReportParts(content) {
  let checklist = '';
  let report = '';
  let suggestions = '';
  
  // 查找 Markdown 表格（检核表）
  const tableMatch = content.match(/(\|.+\|[\s\S]*?(?=\n\n|\n##|$))/);
  if (tableMatch) {
    checklist = tableMatch[0];
  }
  
  // 查找"谈话建议"或"建议"部分
  const suggestionsMatch = content.match(/(?:谈话建议|建议|Recommendations?)[:：]?\s*([\s\S]*?)(?=\n##|$)/i);
  if (suggestionsMatch) {
    suggestions = suggestionsMatch[1];
  }
  
  // 剩余部分作为分析报告
  if (tableMatch) {
    report = content.replace(tableMatch[0], '').replace(suggestionsMatch ? suggestionsMatch[0] : '', '');
  } else {
    report = content;
  }
  
  return { checklist, report, suggestions: suggestions || '暂无建议' };
}

// ============ Markdown 表格渲染 ============
function markdownToHtmlTable(mdText) {
  const lines = mdText.trim().split('\n');
  if (lines.length < 2) return '';
  
  let html = '<thead><tr>';
  let bodyRows = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || !line.startsWith('|')) continue;
    
    const cells = line.split('|').filter(cell => cell.trim() !== '');
    
    if (i === 0) {
      cells.forEach(cell => {
        html += `<th>${escapeHtml(cell.trim())}</th>`;
      });
      html += '</tr></thead><tbody>';
    } else if (line.includes('---')) {
      continue;
    } else {
      const row = '<tr>' + cells.map(cell => `<td>${escapeHtml(cell.trim())}</td>`).join('') + '</tr>';
      bodyRows.push(row);
    }
  }
  
  html += bodyRows.join('') + '</tbody>';
  return html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderChecklistTable(markdown) {
  const table = document.getElementById('checklistTable');
  if (!table) return;
  
  if (!markdown || markdown.trim() === '') {
    table.innerHTML = '<tbody><tr><td>暂无检核表数据</td></tr></tbody>';
    return;
  }
  
  const html = markdownToHtmlTable(markdown);
  table.innerHTML = html;
}
