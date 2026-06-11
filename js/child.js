// 幼儿评价页 JavaScript

// 14个评价领域数据
const DOMAINS_DATA = [
  {
    id: 1,
    name: '书面表达者',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '喜欢用简单的图画或符号表达一定的意思' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '能用图画和符号表达愿望和想法，姿势正确，能认识自己的名字' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '能用图画和符号表现事物或故事，姿势正确，能写自己的名字' }
    ]
  },
  {
    id: 2,
    name: '爱动手探究',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '喜欢摆弄各种物品，好奇、好问' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '经常乐于动手、动脑探索未知的事物' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '乐于在动手、动脑中寻找答案，对发现感到高兴和满足' }
    ]
  },
  {
    id: 3,
    name: '艺术欣赏家',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '喜欢观赏大自然中美的事物，对鸟鸣水声感兴趣，喜欢听音乐看表演看艺术作品' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '观赏时关注色彩形态特征，能感知声音变化，专心观看并有模仿参与愿望，愿意参加艺术欣赏活动并产生联想情绪反应' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '喜欢收集美的事物，关注有特点的声音并模仿联想，对自然景色建筑名胜感兴趣，能通过表情动作语言表达对作品理解，能分享交流艺术体验' }
    ]
  },
  {
    id: 4,
    name: '有趣的数学',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '感知物体形状多样对形状感兴趣，体验生活中用到数，感知不同时间做不同事' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '感知形状方位并用词语描述，用数字符号描述事物，理解事件先后顺序并用语言描述' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '感知空间大小与人们活动关系，发现排列规律并尝试创造，发现数学方法解决问题并体验乐趣，感受理解时间先后长短形成时间意识' }
    ]
  },
  {
    id: 5,
    name: '探究有方法',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '仔细观察感兴趣事物发现明显特征，用多种感官或动作探索事物' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '观察比较事物发现异同并简单描述，根据观察提问并大胆猜测，通过简单调查收集信息，用图画符号记录探究过程' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '观察比较分析基础上发现描述特征变化及关系，用简单方法验证猜测并调整，制订简单调查计划收集信息，用数字图画图表符号记录，与同伴合作交流发现和结果' }
    ]
  },
  {
    id: 6,
    name: '空间探索者',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '感知物体基本空间位置与上下前后里外等方位并理解方位词意义' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '能使用"中间""旁边"等各种方位词描述物体位置和运动方向' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '按指示空间方位的语言或简单图示取放物品反应正确，能辨别以自己为中心的左右方位' }
    ]
  },
  {
    id: 7,
    name: '自信小主人',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '按自己兴趣选择活动，为成果感到开心，愿做力所能及的事，乐意接受小任务' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '按自己想法活动，了解自己优点长处并满意，自己的事自己做不依赖，喜欢承担小任务并尝试做计划，愿意尝试有难度的活动' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '主动发起活动并坚持表达想法，做了好事想做得更好，自己的事自己做愿意学不会的，敢于尝试有挑战性任务并努力完成，能对自己计划事情结果进行回忆分析并调整' }
    ]
  },
  {
    id: 8,
    name: '我爱交朋友',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '愿意与同伴共同游戏并友好提出请求，愿接受成人照料关心共同活动，在指导下愿意分享玩具，冲突时能听从成人劝解' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '喜欢与同伴游戏有稳定玩伴，主动寻求成人陪伴帮助安慰，喜欢和长辈交谈，运用简单交往技巧加入游戏，知道轮流分享适当妥协并在成人帮助下和平解决矛盾，能谦让幼小体弱同伴' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '有自己的好朋友还喜欢交新朋友，有问题能询问别人遇到困难能求助，愿意分享交流高兴有趣的事，能想办法结伴游戏并分工合作协商克服困难解决矛盾，敢于坚持不同意见并说出理由，能谦让照顾幼小体弱同伴也不让别人欺负自己' }
    ]
  },
  {
    id: 9,
    name: '专注坚持力',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '对感兴趣活动能持续集中注意一段时间，在提示下不频繁更换活动' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '活动中有注意力集中时段，遇到困难在鼓励下能继续进行' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '有一定抗干扰能力能认真负责完成接受的任务，遇到困难能多次尝试不轻易放弃直到完成' }
    ]
  },
  {
    id: 10,
    name: '我爱幼儿园',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '在帮助下能适应集体生活环境，喜欢参加群体活动爱上幼儿园' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '能主动参加群体活动，愿意和家长一同参与社区活动，面对新伙伴新老师能适应变化愿意参与' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '对小学生活充满向往好奇，活动中能与同伴共同协商制定规则，面对新伙伴新老师能较快适应新人际环境主动参与' }
    ]
  },
  {
    id: 11,
    name: '喜欢小图书',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '能主动要求成人讲故事读图书，喜欢倾听跟读韵律感强的儿歌童谣' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '会反复翻阅自己喜欢的图书，喜欢向别人讲述听过的故事或看过的图书，喜欢观察常见标识符号能感知理解其意义' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '能专注阅读图书不受外界干扰，乐意与他人交流讨论图书故事内容，对图书和生活中文字符号感兴趣了解其表达意义' }
    ]
  },
  {
    id: 12,
    name: '艺术创作家',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '经常自哼自唱或模仿有趣声调动作表情，经常涂涂画画粘粘贴贴，能模仿唱出短小歌曲，能跟随熟悉或节奏感强音乐做动作，能用简单线条色彩大致画出喜欢的人或事物' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '经常唱唱跳跳喜欢参加歌唱律动舞蹈乐器弹奏等活动，喜欢用绘画捏泥折纸等方式表现观察到的事物和想象，能用自然声音适中音量和基本准确音调唱歌' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '积极参加各类艺术活动对某类活动形式表现偏爱，乐于运用多种工具材料或不同表现手法表达观察到的事物和感受想象，艺术活动中能独立表现也能与同伴合作表现' }
    ]
  },
  {
    id: 13,
    name: '灵活小手指',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '能熟练使用勺子，能用大拇指食指中指抓笔涂涂画画，能沿直线剪与边线基本吻合，能拼插或拆分雪花片等游戏材料' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '能使用筷子，能用笔沿边线较直地画出简单图形或折纸时边线能基本对齐，能剪出由直线构成的简单图形边线吻合，能用泥巴等材料进行简单塑型' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '能熟练使用筷子，能用笔等工具画出线条基本平滑的常见图形，能剪出由曲线构成的简单图形边线吻合和平滑，能使用镊子订书机锤子等简单工具' }
    ]
  },
  {
    id: 14,
    name: '阅读小能手',
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: '能听懂短小儿歌或故事所表达的主要内容，能通过观察图画说出画面所表达的内容和事件，能了解图书中的文字是和画面一起表达意义的' },
      { level: 2, name: '行为2', score: 2, desc: '稳定达到行为1却与行为3尚有差距' },
      { level: 3, name: '行为3', score: 3, desc: '能大致说出所听故事的主要内容，能通过观察图书连续画面大致说出故事主要情节，能随着文学作品情节展开体会作品所表达的各种情绪情感' },
      { level: 4, name: '行为4', score: 4, desc: '稳定达到行为3却与行为5尚有差距' },
      { level: 5, name: '行为5', score: 5, desc: '能说出所阅读文学作品的主要内容，能根据故事部分情节或图画画面线索续编或创编故事，阅读图书及听故事后能发表自己对作品的看法，能初步感受文学作品中的语言美' }
    ]
  }
];

// 14领域×5层级精简描述（用于细则参考表格，不超过30字）
const DOMAINS_REFERENCE = [
  { name: '书面表达者', l1: '用简单图画符号表达意思', l2: '稳定达到行为1与3之间', l3: '能用图画符号表达愿望想法', l4: '稳定达到行为3与5之间', l5: '能用图画符号表现故事，能写名字' },
  { name: '爱动手探究', l1: '喜欢摆弄物品，好奇好问', l2: '稳定达到行为1与3之间', l3: '经常动手动脑探索未知事物', l4: '稳定达到行为3与5之间', l5: '乐于动手动脑寻找答案，对发现感到满足' },
  { name: '艺术欣赏家', l1: '喜欢观赏自然美，对声音感兴趣', l2: '稳定达到行为1与3之间', l3: '关注色彩形态，感知声音变化', l4: '稳定达到行为3与5之间', l5: '收集美物，模仿联想声音，表达作品理解' },
  { name: '有趣的数学', l1: '感知形状多样，体验数，感知时间', l2: '稳定达到行为1与3之间', l3: '用词语描述形状方位，用符号描述事物', l4: '稳定达到行为3与5之间', l5: '感知空间关系，发现排列规律' },
  { name: '探究有方法', l1: '仔细观察特征，用感官探索', l2: '稳定达到行为1与3之间', l3: '比较事物异同，提问猜测', l4: '稳定达到行为3与5之间', l5: '分析特征关系，验证猜测，合作交流' },
  { name: '空间探索者', l1: '感知基本空间位置与方位', l2: '稳定达到行为1与3之间', l3: '能用方位词描述物体位置运动', l4: '稳定达到行为3与5之间', l5: '按图示取放物品，辨别左右方位' },
  { name: '自信小主人', l1: '按兴趣选择，为成果开心', l2: '稳定达到行为1与3之间', l3: '按想法活动，了解优点，自己做', l4: '稳定达到行为3与5之间', l5: '主动发起尝试挑战，回忆分析调整' },
  { name: '我爱交朋友', l1: '愿与同伴游戏，愿分享', l2: '稳定达到行为1与3之间', l3: '有稳定玩伴，主动寻求帮助', l4: '稳定达到行为3与5之间', l5: '交新朋友，分工合作协商，坚持意见' },
  { name: '专注坚持力', l1: '感兴趣活动能集中注意', l2: '稳定达到行为1与3之间', l3: '有注意力集中时段，鼓励下继续', l4: '稳定达到行为3与5之间', l5: '抗干扰完成任务，多次尝试不放弃' },
  { name: '我爱幼儿园', l1: '帮助下适应集体，喜欢活动', l2: '稳定达到行为1与3之间', l3: '主动参加活动，愿意参与社区', l4: '稳定达到行为3与5之间', l5: '向往小学，协商规则，适应新环境' },
  { name: '喜欢小图书', l1: '主动要求讲故事，跟读儿歌', l2: '稳定达到行为1与3之间', l3: '反复翻阅图书，讲述故事', l4: '稳定达到行为3与5之间', l5: '专注阅读，交流讨论，了解文字意义' },
  { name: '艺术创作家', l1: '自哼自唱涂画粘贴', l2: '稳定达到行为1与3之间', l3: '唱跳参加活动，多种方式表现', l4: '稳定达到行为3与5之间', l5: '偏爱艺术，独立与同伴合作表现' },
  { name: '灵活小手指', l1: '熟练用勺抓笔，沿直线剪', l2: '稳定达到行为1与3之间', l3: '使用筷子，沿边线画图形', l4: '稳定达到行为3与5之间', l5: '熟练用筷，画平滑图形，剪曲线' },
  { name: '阅读小能手', l1: '听懂故事，观察图画说出内容', l2: '稳定达到行为1与3之间', l3: '说出故事内容，观察画面说情节', l4: '稳定达到行为3与5之间', l5: '续编创编故事，发表看法，感受语言美' }
];

// 当前状态
let currentDate = getTodayDate();
let currentChildId = null;
let students = [];
let domains = [...DOMAINS_DATA];
let expandedDomainId = null;
let longPressTimer = null;

// DOM元素
const datePicker = document.getElementById('datePicker');
const studentScroll = document.getElementById('studentScroll');
const evalCount = document.getElementById('evalCount');
const domainsList = document.getElementById('domainsList');
const addDomainBtn = document.getElementById('addDomainBtn');
const customDomainModal = document.getElementById('customDomainModal');
const descModal = document.getElementById('descModal');
const navItems = document.querySelectorAll('.nav-item');

// 初始化
function init() {
  // 加载学生列表
  students = getStudentList();
  
  // 加载自定义领域
  loadCustomDomains();
  
  // 设置日期选择器默认值
  datePicker.value = currentDate;
  
  // 渲染幼儿选择区
  renderStudentSelector();
  
  // 渲染领域列表
  renderDomainsList();
  
  // 渲染评价细则参考表格
  renderReferenceTable();
  
  // 绑定事件
  bindEvents();
  
  // 注册Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed:', err));
  }
}

// 加载自定义领域
function loadCustomDomains() {
  const stored = localStorage.getItem('custom_domains');
  if (stored) {
    try {
      const customDomains = JSON.parse(stored);
      customDomains.forEach(d => domains.push(d));
    } catch (e) {}
  }
}

// 保存自定义领域
function saveCustomDomains() {
  const customDomains = domains.filter(d => d.id > 1000);
  localStorage.setItem('custom_domains', JSON.stringify(customDomains));
}

// 绑定事件
function bindEvents() {
  // 日期变更
  datePicker.addEventListener('change', (e) => {
    currentDate = e.target.value;
    renderDomainsList();
    updateEvalCount();
  });
  
  // 添加自定义领域按钮
  addDomainBtn.addEventListener('click', () => {
    customDomainModal.classList.remove('hidden');
    document.getElementById('customDomainName').value = '';
    document.getElementById('customDomainName').focus();
  });
  
  // 关闭自定义领域弹窗
  document.getElementById('closeModal').addEventListener('click', () => {
    customDomainModal.classList.add('hidden');
  });
  
  document.getElementById('cancelAddDomain').addEventListener('click', () => {
    customDomainModal.classList.add('hidden');
  });
  
  // 确认添加自定义领域
  document.getElementById('confirmAddDomain').addEventListener('click', () => {
    const name = document.getElementById('customDomainName').value.trim();
    if (name) {
      addCustomDomain(name);
      customDomainModal.classList.add('hidden');
    }
  });
  
  // 关闭描述弹窗
  document.getElementById('closeDescModal').addEventListener('click', () => {
    descModal.classList.add('hidden');
  });
  
  document.getElementById('closeDescBtn').addEventListener('click', () => {
    descModal.classList.add('hidden');
  });
  
  // 点击弹窗背景关闭
  customDomainModal.addEventListener('click', (e) => {
    if (e.target === customDomainModal) {
      customDomainModal.classList.add('hidden');
    }
  });
  
  descModal.addEventListener('click', (e) => {
    if (e.target === descModal) {
      descModal.classList.add('hidden');
    }
  });
  
  // 导航切换
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'teacher') {
        window.location.href = 'teacher.html';
      } else if (page === 'child') {
        // 已在当前页
      } else if (page === 'history') {
        window.location.href = 'history.html';
      } else if (page === 'class') {
        window.location.href = 'class.html';
      } else if (page === 'ai') {
        window.location.href = 'ai.html';
      }
    });
  });
  
  // 细则参考折叠/展开
  const referenceHeader = document.getElementById('referenceHeader');
  const referenceSection = document.getElementById('referenceSection');
  referenceHeader.addEventListener('click', () => {
    referenceSection.classList.toggle('collapsed');
    // 触感反馈
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  });
}

// 添加自定义领域
function addCustomDomain(name) {
  const newDomain = {
    id: Date.now(),
    name: name,
    isCustom: true,
    levels: [
      { level: 0, name: '未观察到', score: 0, desc: '该幼儿在此领域未有可观察到的行为表现' },
      { level: 1, name: '行为1', score: 1, desc: `${name}行为1描述` },
      { level: 2, name: '行为2', score: 2, desc: `${name}行为2描述` },
      { level: 3, name: '行为3', score: 3, desc: `${name}行为3描述` },
      { level: 4, name: '行为4', score: 4, desc: `${name}行为4描述` },
      { level: 5, name: '行为5', score: 5, desc: `${name}行为5描述` }
    ]
  };
  domains.push(newDomain);
  saveCustomDomains();
  renderDomainsList();
  
  // 触感反馈
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// 渲染幼儿选择区
function renderStudentSelector() {
  let html = '<div class="student-scroll-inner">';
  
  students.forEach(student => {
    const isActive = currentChildId === student.id;
    html += `<button class="student-item ${isActive ? 'active' : ''}" data-id="${student.id}">`;
    html += `<span class="student-icon">${student.icon}</span>`;
    html += `<span class="student-name">${student.name}</span>`;
    html += `</button>`;
  });
  
  html += '</div>';
  studentScroll.innerHTML = html;
  
  // 绑定点击事件
  studentScroll.querySelectorAll('.student-item').forEach(btn => {
    btn.addEventListener('click', () => {
      currentChildId = parseInt(btn.dataset.id);
      expandedDomainId = null;
      renderStudentSelector();
      renderDomainsList();
      updateEvalCount();
      
      // 触感反馈
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    });
  });
}

// 获取当前幼儿的领域评价记录
function getChildDomainRecords() {
  if (!currentChildId) return {};
  const records = getChildRecords(currentDate);
  const result = {};
  records.forEach(r => {
    if (r.childId === currentChildId && r.type === 'child') {
      result[r.categoryId] = r;
    }
  });
  return result;
}

// 获取总领域数
function getTotalDomains() {
  return domains.length;
}

// 更新已评领域计数
function updateEvalCount() {
  if (!currentChildId) {
    evalCount.innerHTML = `今日已评领域：<span>0</span>/${getTotalDomains()}`;
    return;
  }
  const records = getChildDomainRecords();
  const count = Object.keys(records).length;
  evalCount.innerHTML = `今日已评领域：<span>${count}</span>/${getTotalDomains()}`;
}

// 渲染领域列表
function renderDomainsList() {
  if (!currentChildId) {
    domainsList.innerHTML = `
      <div class="placeholder-section">
        <div class="icon">👶</div>
        <div class="title">请先选择幼儿</div>
        <div class="desc">从上方选择要评价的幼儿</div>
      </div>
    `;
    return;
  }
  
  const records = getChildDomainRecords();
  let html = '';
  
  domains.forEach(domain => {
    const record = records[domain.id];
    const isExpanded = expandedDomainId === domain.id;
    const selectedLevel = record ? record.level : null;
    const selectedInfo = record ? `${record.levelName}(${record.score}分)` : '未评';
    
    html += `<div class="domain-card ${isExpanded ? 'expanded' : ''}" data-id="${domain.id}">`;
    
    // 卡片头部（点击展开/折叠）
    html += `<div class="domain-header" data-id="${domain.id}">`;
    html += `<span class="domain-name">${domain.name}</span>`;
    html += `<span class="domain-status">${selectedInfo}</span>`;
    html += `<span class="domain-arrow">▼</span>`;
    html += `</div>`;
    
    // 层级选择区（带动画）
    html += `<div class="domain-levels" data-id="${domain.id}">`;
    domain.levels.forEach(lv => {
      const isSelected = selectedLevel === lv.level;
      html += `<button class="level-btn ${isSelected ? 'selected' : ''}" 
                   data-domain="${domain.id}" 
                   data-level="${lv.level}"
                   data-name="${lv.name}"
                   data-score="${lv.score}"
                   data-desc="${lv.desc}">`;
      html += `<span class="level-name">${lv.name}</span>`;
      html += `<span class="level-score">${lv.score}分</span>`;
      html += `</button>`;
    });
    html += `</div>`;
    
    html += `</div>`;
  });
  
  domainsList.innerHTML = html;
  
  // 绑定卡片头部点击事件（展开/折叠）
  document.querySelectorAll('.domain-header').forEach(header => {
    header.addEventListener('click', () => {
      const id = parseInt(header.dataset.id);
      expandedDomainId = expandedDomainId === id ? null : id;
      renderDomainsList();
      
      // 触感反馈
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    });
  });
  
  // 绑定层级按钮点击事件
  document.querySelectorAll('.level-btn').forEach(btn => {
    btn.addEventListener('click', handleLevelClick);
    
    // 长按显示描述
    btn.addEventListener('touchstart', handleLongPressStart, { passive: true });
    btn.addEventListener('touchend', handleLongPressEnd);
    btn.addEventListener('mousedown', handleLongPressStart);
    btn.addEventListener('mouseup', handleLongPressEnd);
    btn.addEventListener('mouseleave', handleLongPressEnd);
  });
}

// 长按开始
function handleLongPressStart(e) {
  longPressTimer = setTimeout(() => {
    const btn = e.currentTarget;
    showLevelDesc(btn);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, 500);
}

// 长按结束
function handleLongPressEnd() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
}

// 显示层级描述弹窗
function showLevelDesc(btn) {
  const name = btn.dataset.name;
  const score = btn.dataset.score;
  const desc = btn.dataset.desc;
  
  document.getElementById('descModalTitle').textContent = `${name} (${score}分)`;
  document.getElementById('descModalText').textContent = desc;
  descModal.classList.remove('hidden');
}

// 处理层级点击
function handleLevelClick(e) {
  const btn = e.currentTarget;
  const domainId = parseInt(btn.dataset.domain);
  const level = parseInt(btn.dataset.level);
  const name = btn.dataset.name;
  const score = parseInt(btn.dataset.score);
  const desc = btn.dataset.desc;
  
  const student = students.find(s => s.id === currentChildId);
  const domain = domains.find(d => d.id === domainId);
  
  // 保存记录（覆盖同领域旧记录）
  saveChildDomainRecord(currentDate, currentChildId, student.name, domainId, domain.name, level, name, score, desc);
  
  // 触感反馈
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
  
  // 收起展开区域
  expandedDomainId = null;
  
  // 重新渲染
  renderDomainsList();
  updateEvalCount();
}

// 保存幼儿领域记录（覆盖模式）
function saveChildDomainRecord(date, childId, childName, categoryId, categoryName, level, levelName, score, desc) {
  const records = getChildRecords(date);
  
  // 过滤掉同一天、同一幼儿、同一领域的旧记录
  const filtered = records.filter(r => 
    !(r.childId === childId && r.type === 'child' && r.categoryId === categoryId)
  );
  
  // 添加新记录
  const now = new Date();
  filtered.push({
    id: Date.now(),
    timestamp: now.getTime(),
    childId: childId,
    childName: childName,
    categoryId: categoryId,
    categoryName: categoryName,
    level: level,
    levelName: levelName,
    score: score,
    desc: desc,
    type: 'child',
    time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  });
  
  saveChildRecords(date, filtered);
}

// 渲染评价细则参考表格
function renderReferenceTable() {
  const tbody = document.getElementById('referenceTableBody');
  let html = '';
  
  DOMAINS_REFERENCE.forEach((domain, index) => {
    const zebraClass = index % 2 === 0 ? 'zebra-light' : 'zebra-dark';
    html += `<tr class="${zebraClass}">`;
    html += `<td class="domain-cell">${domain.name}</td>`;
    html += `<td>${domain.l1}</td>`;
    html += `<td>${domain.l2}</td>`;
    html += `<td>${domain.l3}</td>`;
    html += `<td>${domain.l4}</td>`;
    html += `<td>${domain.l5}</td>`;
    html += `</tr>`;
  });
  
  tbody.innerHTML = html;
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
