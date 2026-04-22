// 初始化应用
App.initApp();

// DOM 元素
const studentList = document.getElementById('studentList');
const addStudentBtn = document.getElementById('addStudentBtn');
const addModal = document.getElementById('addModal');
const studentName = document.getElementById('studentName');
const studentGender = document.getElementById('studentGender');
const cancelBtn = document.getElementById('cancelBtn');
const confirmAddBtn = document.getElementById('confirmAddBtn');
const fileInput = document.getElementById('fileInput');
const backupBtn = document.getElementById('backupBtn');
const restoreBtn = document.getElementById('restoreBtn');
const dataManagementToggle = document.getElementById('dataManagementToggle');
const dataManagementContent = document.getElementById('dataManagementContent');

// 加载幼儿列表
function loadStudents() {
  const students = App.getClassStudents();
  studentList.innerHTML = '';
  
  if (students.length === 0) {
    studentList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">暂无幼儿信息</div>';
    return;
  }
  
  students.forEach(student => {
    const studentItem = document.createElement('div');
    studentItem.className = 'student-list-item';
    
    studentItem.innerHTML = `
      <div class="student-list-info">
        <div class="student-list-gender">${student.gender === '男' ? '👦' : '👧'}</div>
        <div>
          <div>${student.name}</div>
          <div style="font-size: 12px; color: #999;">ID: ${student.id}</div>
        </div>
      </div>
      <div class="student-list-actions">
        <button class="detail-btn" data-id="${student.id}">📊</button>
        <button class="delete-student-btn" data-id="${student.id}">🗑️</button>
      </div>
    `;
    
    studentList.appendChild(studentItem);
  });
  
  // 添加事件监听器
  addEventListeners();
}

// 添加事件监听器
function addEventListeners() {
  // 详情按钮点击事件
  document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      App.vibrate();
      const studentId = e.target.dataset.id;
      window.location.href = `student-detail.html?studentId=${studentId}`;
    });
  });
  
  // 删除按钮点击事件
  document.querySelectorAll('.delete-student-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      App.vibrate();
      const studentId = parseInt(e.target.dataset.id);
      deleteStudent(studentId);
    });
  });
}

// 删除幼儿
function deleteStudent(id) {
  if (confirm('确定要删除这个幼儿吗？')) {
    App.deleteStudent(id);
    loadStudents();
  }
}

// 打开添加模态框
function openAddModal() {
  App.vibrate();
  studentName.value = '';
  studentGender.value = '男';
  addModal.style.display = 'flex';
}

// 关闭添加模态框
function closeAddModal() {
  addModal.style.display = 'none';
}

// 添加幼儿
function addStudent() {
  const name = studentName.value.trim();
  const gender = studentGender.value;
  
  if (!name) {
    alert('请输入姓名');
    return;
  }
  
  App.addStudent(name, gender);
  closeAddModal();
  loadStudents();
}

// 处理文件导入
function handleFileImport(e) {
  App.vibrate();
  const file = e.target.files[0];
  if (!file) return;
  
  const importMode = document.querySelector('input[name="importMode"]:checked').value;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      processImportData(jsonData, importMode);
    } catch (error) {
      // 尝试解析 CSV
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const jsonData = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            jsonData.push(row);
          }
        }
        
        processImportData(jsonData, importMode);
      } catch (error) {
        alert('文件解析失败，请检查文件格式');
      }
    }
  };
  
  reader.readAsArrayBuffer(file);
}

// 处理导入数据
function processImportData(data, importMode) {
  if (data.length === 0) {
    alert('文件中没有数据');
    return;
  }
  
  // 识别列名
  const firstRow = data[0];
  let nameColumn = null;
  let genderColumn = null;
  
  for (const key in firstRow) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('姓名') || lowerKey.includes('name')) {
      nameColumn = key;
    } else if (lowerKey.includes('性别') || lowerKey.includes('sex') || lowerKey.includes('gender')) {
      genderColumn = key;
    }
  }
  
  if (!nameColumn) {
    alert('未找到姓名列');
    return;
  }
  
  // 处理数据
  const students = [];
  data.forEach(row => {
    const name = row[nameColumn]?.trim();
    if (name) {
      let gender = '男';
      if (genderColumn) {
        const genderValue = row[genderColumn]?.toString().toLowerCase();
        if (genderValue.includes('女') || genderValue.includes('female') || genderValue.includes('f')) {
          gender = '女';
        }
      }
      students.push({ name, gender });
    }
  });
  
  if (students.length === 0) {
    alert('未找到有效的幼儿数据');
    return;
  }
  
  // 导入数据
  if (importMode === 'override') {
    // 清空现有数据
    localStorage.removeItem('class_student_list');
  }
  
  // 添加新数据
  students.forEach(student => {
    App.addStudent(student.name, student.gender);
  });
  
  alert(`成功导入 ${students.length} 个幼儿`);
  loadStudents();
}

// 事件监听器
addStudentBtn.addEventListener('click', openAddModal);
cancelBtn.addEventListener('click', closeAddModal);
confirmAddBtn.addEventListener('click', addStudent);
fileInput.addEventListener('change', handleFileImport);

// 点击模态框外部关闭
addModal.addEventListener('click', (e) => {
  if (e.target === addModal) {
    closeAddModal();
  }
});

// 初始化
function init() {
  loadStudents();
}

// 备份数据
function backupData() {
  App.vibrate();
  
  try {
    // 收集所有数据
    const data = {
      version: '1.0',
      exportDate: new Date().toLocaleString('zh-CN'),
      data: {
        studentList: App.getClassStudents(),
        records: {}
      }
    };
    
    // 收集所有记录
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('records_')) {
        try {
          data.data.records[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.error('Error parsing record:', key, e);
        }
      }
    }
    
    // 转换为 JSON 字符串
    const jsonString = JSON.stringify(data, null, 2);
    
    // 创建 Blob 并下载
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `建构游戏备份_${new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('备份成功');
  } catch (error) {
    console.error('Backup error:', error);
    alert('备份失败，请重试');
  }
}

// 恢复数据
function restoreData() {
  App.vibrate();
  
  // 创建文件输入
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json';
  fileInput.style.display = 'none';
  
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const jsonString = e.target.result;
        const backupData = JSON.parse(jsonString);
        
        // 验证数据格式
        if (!backupData.version || !backupData.data) {
          throw new Error('无效的备份文件格式');
        }
        
        // 确认恢复
        if (confirm('确定要恢复数据吗？当前所有数据将被覆盖。')) {
          // 清空旧记录
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('records_')) {
              localStorage.removeItem(key);
            }
          }
          
          // 恢复幼儿名单
          if (backupData.data.studentList) {
            localStorage.setItem('class_student_list', JSON.stringify(backupData.data.studentList));
          }
          
          // 恢复记录
          if (backupData.data.records) {
            for (const key in backupData.data.records) {
              if (key.startsWith('records_')) {
                localStorage.setItem(key, JSON.stringify(backupData.data.records[key]));
              }
            }
          }
          
          alert('恢复成功');
          // 刷新页面
          window.location.reload();
        }
      } catch (error) {
        console.error('Restore error:', error);
        alert('恢复失败，请检查文件格式');
      }
    };
    
    reader.readAsText(file);
  });
  
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

// 切换数据管理区域
function toggleDataManagement() {
  App.vibrate();
  if (dataManagementContent.style.display === 'none') {
    dataManagementContent.style.display = 'block';
  } else {
    dataManagementContent.style.display = 'block'; // 保持显示，不折叠
  }
}

// 事件监听器
addStudentBtn.addEventListener('click', openAddModal);
cancelBtn.addEventListener('click', closeAddModal);
confirmAddBtn.addEventListener('click', addStudent);
fileInput.addEventListener('change', handleFileImport);
if (backupBtn) {
  backupBtn.addEventListener('click', backupData);
}
if (restoreBtn) {
  restoreBtn.addEventListener('click', restoreData);
}
if (dataManagementToggle) {
  dataManagementToggle.addEventListener('click', toggleDataManagement);
}

// 点击模态框外部关闭
addModal.addEventListener('click', (e) => {
  if (e.target === addModal) {
    closeAddModal();
  }
});

// 初始化
function init() {
  loadStudents();
}

// 启动应用
init();