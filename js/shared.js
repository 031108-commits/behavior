// 共用函数

/**
 * 获取今日日期 YYYY-MM-DD
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取幼儿名单
 */
function getStudentList() {
  const defaultList = [
    { id: 1, name: '张小明', gender: '男', icon: '👦' },
    { id: 2, name: '李小萌', gender: '女', icon: '👧' },
    { id: 3, name: '王天天', gender: '男', icon: '👦' }
  ];
  
  const stored = localStorage.getItem('class_student_list');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultList;
    }
  }
  return defaultList;
}

/**
 * 保存幼儿名单
 */
function saveStudentList(list) {
  localStorage.setItem('class_student_list', JSON.stringify(list));
}

/**
 * 获取指定日期的教师记录
 * @param {string} date YYYY-MM-DD格式
 */
function getTeacherRecords(date) {
  const key = `teacher_records_${date}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * 保存教师记录
 * @param {string} date YYYY-MM-DD格式
 * @param {Array} records 记录数组
 */
function saveTeacherRecords(date, records) {
  const key = `teacher_records_${date}`;
  localStorage.setItem(key, JSON.stringify(records));
}

/**
 * 添加教师记录
 */
function addTeacherRecord(date, teacherId, behaviorName, score) {
  const records = getTeacherRecords(date);
  const now = new Date();
  records.push({
    id: Date.now(),
    timestamp: now.getTime(),
    teacherId: teacherId,
    type: 'teacher',
    behaviorName: behaviorName,
    score: score,
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  });
  saveTeacherRecords(date, records);
  return records;
}

/**
 * 删除教师记录
 */
function deleteTeacherRecord(date, recordId) {
  const records = getTeacherRecords(date);
  const filtered = records.filter(r => r.id !== recordId);
  saveTeacherRecords(date, filtered);
  return filtered;
}

/**
 * 获取指定日期的幼儿评价记录
 * @param {string} date YYYY-MM-DD格式
 */
function getChildRecords(date) {
  const key = `child_records_${date}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * 保存幼儿评价记录
 */
function saveChildRecords(date, records) {
  const key = `child_records_${date}`;
  localStorage.setItem(key, JSON.stringify(records));
}

/**
 * 添加幼儿评价记录
 */
function addChildRecord(date, studentId, studentName, category, behaviorName, score) {
  const records = getChildRecords(date);
  const now = new Date();
  records.push({
    id: Date.now(),
    timestamp: now.getTime(),
    studentId: studentId,
    studentName: studentName,
    type: 'child',
    category: category,
    behaviorName: behaviorName,
    score: score,
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  });
  saveChildRecords(date, records);
  return records;
}

/**
 * 删除幼儿评价记录
 */
function deleteChildRecord(date, recordId) {
  const records = getChildRecords(date);
  const filtered = records.filter(r => r.id !== recordId);
  saveChildRecords(date, filtered);
  return filtered;
}
