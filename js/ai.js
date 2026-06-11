// AI分析页面 JavaScript

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_TIMEOUT = 30000; // 30秒超时

let currentType = 'teacher'; // 'teacher' or 'child'

// 语音识别相关
let recognition = null;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

// DOM元素
const typeTabs = document.getElementById('typeTabs');
const apiKeyInput = document.getElementById('apiKeyInput');
const contentInput = document.getElementById('contentInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingSection = document.getElementById('loadingSection');
const resultArea = document.getElementById('resultArea');
const resultContent = document.getElementById('resultContent');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const navItems = document.querySelectorAll('.nav-item');
const recordBtn = document.getElementById('recordBtn');
const voiceStatus = document.getElementById('voiceStatus');
const voiceSection = document.getElementById('voiceSection');

// 教师评价系统提示词
const TEACHER_SYSTEM_PROMPT = `你是一位专业的幼儿教育观察评估专家。请根据用户提供的观察记录，对照以下评估指标进行分析评分，并以Markdown表格格式输出结果。

如果是教师评价（CLASS量表），请从以下维度评分(1-7分)：积极氛围、消极氛围、教师敏感性、尊重幼儿观点、行为管理、效率、教学活动形式、认知发展、反馈质量、语言示范。

请以表格形式输出评分结果，包含维度、评分(1-7)、分析说明列。`;

// 幼儿评价系统提示词
const CHILD_SYSTEM_PROMPT = `你是一位专业的幼儿教育观察评估专家。请根据用户提供的观察记录，对照以下评估指标进行分析评分，并以Markdown表格格式输出结果。

如果是幼儿评价，请从以下14个领域判断行为层级(1-5分)：书面表达者、爱动手探究、艺术欣赏家、有趣的数学、探究有方法、空间探索者、自信小主人、我爱交朋友、专注坚持力、我爱幼儿园、喜欢小图书、艺术创作家、灵活小手指、阅读小能手。

请以表格形式输出评分结果，包含领域、评分(1-5)、发展水平、分析说明列。`;

// 初始化
function init() {
  checkSpeechRecognitionSupport();
  bindEvents();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// 检查浏览器是否支持语音识别
function checkSpeechRecognitionSupport() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    // 不支持语音识别，隐藏麦克风按钮
    voiceSection.classList.add('hidden');
    return;
  }
  
  // 检查是否在安全上下文中
  if (location.protocol === 'file:') {
    voiceSection.classList.add('hidden');
    return;
  }
  
  // 初始化语音识别
  initSpeechRecognition();
}

// 初始化语音识别实例
function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'zh-CN';
  
  recognition.onstart = () => {
    isRecording = true;
    updateRecordButtonState();
    voiceStatus.textContent = '录音中...';
  };
  
  recognition.onresult = (event) => {
    let finalText = '';
    let interimText = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript;
      } else {
        interimText += transcript;
      }
    }
    
    // 如果有最终确认的文本，追加到输入框
    if (finalText) {
      appendToContentInput(finalText);
    }
    
    // 更新状态显示临时文本
    if (interimText) {
      voiceStatus.textContent = '识别中: ' + interimText;
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    isRecording = false;
    updateRecordButtonState();
    
    if (event.error === 'not-allowed') {
      voiceStatus.textContent = '';
      showError('麦克风权限被拒绝，请在浏览器设置中允许使用麦克风');
    } else if (event.error === 'no-speech') {
      voiceStatus.textContent = '未检测到语音，请重试';
    } else {
      voiceStatus.textContent = '';
    }
  };
  
  recognition.onend = () => {
    isRecording = false;
    updateRecordButtonState();
    
    if (voiceStatus.textContent.startsWith('识别中') || voiceStatus.textContent === '录音中...') {
      voiceStatus.textContent = '已停止';
    }
  };
}

// 更新录音按钮状态
function updateRecordButtonState() {
  if (isRecording) {
    recordBtn.classList.add('recording');
    recordBtn.querySelector('.mic-icon').textContent = '⏹️';
  } else {
    recordBtn.classList.remove('recording');
    recordBtn.querySelector('.mic-icon').textContent = '🎤';
  }
}

// 切换录音状态
function toggleRecording() {
  if (!recognition) {
    showError('您的浏览器不支持语音识别');
    return;
  }
  
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

// 开始录音
function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      // 启动语音识别
      try {
        recognition.start();
      } catch (e) {
        console.error('Recognition start error:', e);
        recognition.stop();
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e2) {
            showError('启动语音识别失败，请刷新页面重试');
          }
        }, 100);
      }
      
      // 震动反馈
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    })
    .catch(err => {
      console.error('获取麦克风权限失败:', err);
      voiceStatus.textContent = '请允许麦克风权限';
      if (err.name === 'NotAllowedError') {
        showError('请在浏览器设置中允许麦克风权限以使用语音输入功能');
      }
    });
}

// 停止录音
function stopRecording() {
  recognition.stop();
  
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }
}

// 追加文本到输入框
function appendToContentInput(text) {
  const currentText = contentInput.value.trim();
  if (currentText) {
    contentInput.value = currentText + '\n' + text;
  } else {
    contentInput.value = text;
  }
}

// 绑定事件
function bindEvents() {
  // 类型切换
  typeTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.type;
      typeTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
  
  // 录音按钮
  recordBtn.addEventListener('click', toggleRecording);
  
  // 开始分析
  analyzeBtn.addEventListener('click', doAnalyze);
  
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
        window.location.href = 'class.html';
      }
    });
  });
}

// 执行分析
async function doAnalyze() {
  const apiKey = apiKeyInput.value.trim();
  const content = contentInput.value.trim();
  
  // 验证输入
  if (!apiKey) {
    showError('请输入 DeepSeek API Key');
    return;
  }
  
  if (!content) {
    showError('请输入观察记录内容');
    return;
  }
  
  // 显示加载状态
  hideError();
  hideResult();
  showLoading();
  
  // 获取当前类型的系统提示词
  const systemPrompt = currentType === 'teacher' ? TEACHER_SYSTEM_PROMPT : CHILD_SYSTEM_PROMPT;
  const typeLabel = currentType === 'teacher' ? '教师评价' : '幼儿评价';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(API_URL, {
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: content + '\n\n请根据以上指标进行分析。'
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `请求失败 (${response.status})`);
    }
    
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    
    if (!result) {
      throw new Error('未能获取分析结果');
    }
    
    hideLoading();
    showResult(result);
    
  } catch (error) {
    console.error('API Error:', error);
    hideLoading();
    
    if (error.name === 'AbortError') {
      showError('请求超时，请检查网络连接后重试');
    } else {
      showError(error.message || '分析失败，请检查API Key和网络连接');
    }
  }
}

// 显示加载状态
function showLoading() {
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = '分析中...';
  loadingSection.classList.remove('hidden');
}

// 隐藏加载状态
function hideLoading() {
  analyzeBtn.disabled = false;
  analyzeBtn.textContent = '开始分析';
  loadingSection.classList.add('hidden');
}

// 显示结果
function showResult(content) {
  const formatted = formatMarkdown(content);
  resultContent.innerHTML = formatted;
  resultArea.classList.remove('hidden');
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 隐藏结果
function hideResult() {
  resultArea.classList.add('hidden');
}

// 显示错误
function showError(message) {
  errorMessage.textContent = message;
  errorSection.classList.remove('hidden');
}

// 隐藏错误
function hideError() {
  errorSection.classList.add('hidden');
}

// 格式化Markdown结果
function formatMarkdown(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  const lines = html.split('\n');
  let inTable = false;
  let result = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // 检测表格行
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        result.push('<div class="result-table-wrapper"><table class="result-table">');
      }
      
      // 表头或数据行
      if (line.includes('---')) {
        continue;
      }
      
      const cells = line.split('|').filter(c => c.trim());
      const isHeader = cells.some(c => 
        c.includes('维度') || c.includes('领域') || c.includes('评分') || 
        c.includes('分析') || c.includes('发展') || c.includes('说明')
      );
      
      if (isHeader) {
        result.push('<thead><tr>');
        cells.forEach(cell => {
          result.push(`<th>${cell.trim()}</th>`);
        });
        result.push('</tr></thead><tbody>');
      } else {
        result.push('<tr>');
        cells.forEach(cell => {
          result.push(`<td>${cell.trim()}</td>`);
        });
        result.push('</tr>');
      }
    } else {
      if (inTable) {
        inTable = false;
        result.push('</tbody></table></div>');
      }
      
      if (line) {
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)[0].length;
          result.push(`<h${level}>${line.replace(/^#+\s*/, '')}</h${level}>`);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          result.push(`<li>${line.substring(2)}</li>`);
        } else {
          result.push(`<p>${line}</p>`);
        }
      }
    }
  }
  
  if (inTable) {
    result.push('</tbody></table></div>');
  }
  
  return result.join('');
}

document.addEventListener('DOMContentLoaded', init);
