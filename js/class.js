// 班级管理页面 JavaScript

const STORAGE_KEY = 'class_student_list';
let students = [];
let pendingImportData = [];
let deleteTargetId = null;

// DOM元素
const studentList = document.getElementById('studentList');
const noStudentTip = document.getElementById('noStudentTip');
const addStudentBtn = document.getElementById('addStudentBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const navItems = document.querySelectorAll('.nav-item');

// 弹窗元素
const addModal = document.getElementById('addModal');
const deleteModal = document.getElementById('deleteModal');
const importModal = document.getElementById('importModal');
const detailModal = document.getElementById('detailModal');

// 初始化
function init() {
  loadStudents();
  renderStudentList();
  bindEvents();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// 加载幼儿列表
function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    students = JSON.parse(saved);
  } else {
    // 默认名单
    students = [
      { id: 1, name: '张小明', icon: '👦' },
      { id: 2, name: '李小萌', icon: '👧' },
      { id: 3, name: '王天天', icon: '👦' }
    ];
    saveStudents();
  }
}

// 保存幼儿列表
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// 渲染幼儿列表
function renderStudentList() {
  if (students.length === 0) {
    noStudentTip.classList.remove('hidden');
    studentList.innerHTML = '';
    return;
  }
  
  noStudentTip.classList.add('hidden');
  
  let html = '';
  students.forEach(student => {
    html += `
      <div class="student-card">
        <div class="student-info">
          <span class="student-avatar">${student.icon}</span>
          <span class="student-name">${student.name}</span>
        </div>
        <div class="student-actions">
          <button class="action-icon detail-btn" data-id="${student.id}" title="查看详情">📊</button>
          <button class="action-icon delete-btn" data-id="${student.id}" title="删除">🗑️</button>
        </div>
      </div>
    `;
  });
  
  studentList.innerHTML = html;
  
  // 绑定详情按钮
  studentList.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showStudentDetail(parseInt(btn.dataset.id));
    });
  });
  
  // 绑定删除按钮
  studentList.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showDeleteConfirm(parseInt(btn.dataset.id));
    });
  });
}

// 显示添加弹窗
function showAddModal() {
  document.getElementById('studentName').value = '';
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gender === 'boy');
  });
  addModal.classList.remove('hidden');
  
  if (navigator.vibrate) {
    navigator.vibrate(15);
  }
}

// 隐藏添加弹窗
function hideAddModal() {
  addModal.classList.add('hidden');
}

// 添加幼儿
function doAddStudent() {
  const name = document.getElementById('studentName').value.trim();
  const gender = document.querySelector('.gender-btn.active').dataset.gender;
  
  if (!name) {
    alert('请输入幼儿姓名');
    return;
  }
  
  const icon = gender === 'boy' ? '👦' : '👧';
  const newStudent = {
    id: Date.now(),
    name: name,
    icon: icon
  };
  
  students.push(newStudent);
  saveStudents();
  renderStudentList();
  hideAddModal();
  
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// 显示删除确认
function showDeleteConfirm(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  
  deleteTargetId = id;
  document.getElementById('deleteStudentName').textContent = student.name;
  deleteModal.classList.remove('hidden');
  
  if (navigator.vibrate) {
    navigator.vibrate(15);
  }
}

// 隐藏删除确认
function hideDeleteConfirm() {
  deleteModal.classList.add('hidden');
  deleteTargetId = null;
}

// 确认删除
function doDeleteStudent() {
  if (!deleteTargetId) return;
  
  students = students.filter(s => s.id !== deleteTargetId);
  saveStudents();
  renderStudentList();
  hideDeleteConfirm();
  
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// 显示幼儿详情
function showStudentDetail(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;
  
  // 收集该幼儿最近的评价记录
  const recentRecords = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('child_records_')) {
      const records = JSON.parse(localStorage.getItem(key) || '[]');
      records.forEach(r => {
        if (r.childId === id) {
          recentRecords.push({
            date: key.replace('child_records_', ''),
            category: r.categoryName,
            level: r.levelName,
            score: r.score
          });
        }
      });
    }
  }
  
  // 按日期排序，取最近10条
  recentRecords.sort((a, b) => b.date.localeCompare(a.date));
  const displayRecords = recentRecords.slice(0, 10);
  
  let html = `
    <div class="detail-header">
      <span class="detail-avatar">${student.icon}</span>
      <span class="detail-name">${student.name}</span>
    </div>
    <div class="detail-stats">
      <div class="stat-item">
        <span class="stat-num">${recentRecords.length}</span>
        <span class="stat-desc">条评价记录</span>
      </div>
    </div>
  `;
  
  if (displayRecords.length > 0) {
    html += '<div class="detail-records"><h4>最近评价</h4>';
    displayRecords.forEach(r => {
      html += `
        <div class="record-item">
          <span class="record-date">${r.date}</span>
          <span class="record-domain">${r.category}</span>
          <span class="record-level">${r.level} (${r.score}分)</span>
        </div>
      `;
    });
    html += '</div>';
  } else {
    html += '<div class="no-records-tip">暂无评价记录</div>';
  }
  
  document.getElementById('detailBody').innerHTML = html;
  detailModal.classList.remove('hidden');
  
  if (navigator.vibrate) {
    navigator.vibrate(15);
  }
}

// 触发文件选择
function triggerFileInput() {
  fileInput.click();
  
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

// 处理文件导入
function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      // 解析数据
      const parsedStudents = [];
      jsonData.forEach(row => {
        // 尝试识别姓名和性别列
        const name = row['姓名'] || row['name'] || row['Name'] || row['学生姓名'];
        let gender = row['性别'] || row['gender'] || row['Gender'];
        
        if (name && typeof name === 'string' && name.trim()) {
          // 解析性别
          let icon = '👦';
          if (gender) {
            gender = String(gender).trim().toLowerCase();
            if (gender.includes('女') || gender.includes('girl')) {
              icon = '👧';
            }
          }
          
          parsedStudents.push({
            name: name.trim(),
            icon: icon
          });
        }
      });
      
      if (parsedStudents.length === 0) {
        alert('未能解析到有效的幼儿数据，请检查文件格式');
        return;
      }
      
      pendingImportData = parsedStudents;
      document.getElementById('importCount').textContent = parsedStudents.length;
      
      // 显示预览
      let previewHtml = '';
      parsedStudents.slice(0, 5).forEach(s => {
        previewHtml += `<span class="preview-item">${s.icon} ${s.name}</span>`;
      });
      if (parsedStudents.length > 5) {
        previewHtml += `<span class="preview-item">...等${parsedStudents.length}人</span>`;
      }
      document.getElementById('importPreview').innerHTML = previewHtml;
      
      importModal.classList.remove('hidden');
      
    } catch (error) {
      console.error('Parse error:', error);
      alert('文件解析失败，请确保是有效的Excel或CSV文件');
    }
  };
  
  reader.readAsArrayBuffer(file);
  // 重置input以允许选择相同文件
  event.target.value = '';
}

// 执行导入（追加）
function doAppendImport() {
  const newStudents = pendingImportData.map(s => ({
    id: Date.now() + Math.random(),
    name: s.name,
    icon: s.icon
  }));
  
  students = students.concat(newStudents);
  saveStudents();
  renderStudentList();
  closeImportModal();
  
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// 执行导入（覆盖）
function doOverwriteImport() {
  students = pendingImportData.map(s => ({
    id: Date.now() + Math.random(),
    name: s.name,
    icon: s.icon
  }));
  
  saveStudents();
  renderStudentList();
  closeImportModal();
  
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// 关闭导入弹窗
function closeImportModal() {
  importModal.classList.add('hidden');
  pendingImportData = [];
}

// 隐藏详情弹窗
function hideDetailModal() {
  detailModal.classList.add('hidden');
}

// 绑定事件
function bindEvents() {
  // 添加按钮
  addStudentBtn.addEventListener('click', showAddModal);
  
  // 导入按钮
  importBtn.addEventListener('click', triggerFileInput);
  fileInput.addEventListener('change', handleFileImport);
  
  // 添加弹窗
  document.getElementById('closeAddModal').addEventListener('click', hideAddModal);
  document.getElementById('cancelAdd').addEventListener('click', hideAddModal);
  document.getElementById('confirmAdd').addEventListener('click', doAddStudent);
  
  // 性别选择
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // 删除弹窗
  document.getElementById('closeDeleteModal').addEventListener('click', hideDeleteConfirm);
  document.getElementById('cancelDelete').addEventListener('click', hideDeleteConfirm);
  document.getElementById('confirmDelete').addEventListener('click', doDeleteStudent);
  
  // 导入弹窗
  document.getElementById('closeImportModal').addEventListener('click', closeImportModal);
  document.getElementById('cancelImport').addEventListener('click', closeImportModal);
  document.getElementById('appendImport').addEventListener('click', doAppendImport);
  document.getElementById('overwriteImport').addEventListener('click', doOverwriteImport);
  
  // 详情弹窗
  document.getElementById('closeDetailModal').addEventListener('click', hideDetailModal);
  document.getElementById('closeDetailBtn').addEventListener('click', hideDetailModal);
  
  // 弹窗点击遮罩关闭
  [addModal, deleteModal, importModal, detailModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
  
  // 导航切换
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'teacher') {
        window.location.href = 'teacher.html';
      } else if (page === 'child') {
        window.location.href = 'child.html';
      } else if (page === 'history') {
        window.location.href = 'history.html';
      } else if (page === 'class') {
        // 已在当前页
      } else if (page === 'ai') {
        window.location.href = 'ai.html';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
