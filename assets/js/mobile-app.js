document.addEventListener('DOMContentLoaded', function() {
  // 初始化页面
  initTabNavigation();
  initSoundPlayers();
  initAIChat();
  initAudioPlayer();
  initShareFeatures();
  initMixer();
  initTimerControls();
  
  // 模拟已加载的内容，显示音频播放器
  setTimeout(function() {
    document.getElementById('audio-player').classList.add('active');
  }, 2000);
});

// 标签页导航
function initTabNavigation() {
  const tabItems = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('data-tab');
      
      // 移除所有活动类
      tabItems.forEach(tab => tab.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // 添加活动类到当前标签
      this.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });
}

// 声音播放器初始化
function initSoundPlayers() {
  const soundItems = document.querySelectorAll('.sound-item');
  const audioPlayer = document.getElementById('audio-player');
  const playerTitle = audioPlayer.querySelector('.player-title');
  const playerArtist = audioPlayer.querySelector('.player-artist');
  const playerImage = audioPlayer.querySelector('.player-image');
  const playerPlayButton = audioPlayer.querySelector('.player-play i');
  
  soundItems.forEach(item => {
    item.addEventListener('click', function() {
      const soundName = this.getAttribute('data-sound');
      const title = this.querySelector('.sound-item-title').textContent;
      const artist = this.querySelector('.sound-item-artist').textContent;
      const imageUrl = this.querySelector('.sound-item-image').src;
      
      // 更新播放器信息
      playerTitle.textContent = title;
      playerArtist.textContent = artist;
      playerImage.src = imageUrl;
      playerPlayButton.className = 'fas fa-pause';
      
      // 显示音频播放器
      audioPlayer.classList.add('active');
      
      // 如果有实际的音频，可以在这里播放
      console.log(`播放声音: ${soundName}`);
    });
  });
  
  // 播放器切换按钮
  const playerToggle = audioPlayer.querySelector('.player-toggle');
  playerToggle.addEventListener('click', function() {
    audioPlayer.classList.toggle('active');
  });
  
  // 播放/暂停按钮
  const playPauseBtn = audioPlayer.querySelector('.player-play');
  playPauseBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    if (icon.classList.contains('fa-pause')) {
      icon.className = 'fas fa-play';
      console.log('暂停播放');
    } else {
      icon.className = 'fas fa-pause';
      console.log('开始播放');
    }
  });
  
  // 进度更新（模拟）
  let progress = 30;
  setInterval(function() {
    if (playerPlayButton.classList.contains('fa-pause')) {
      progress = (progress + 1) % 100;
      audioPlayer.querySelector('.player-progress-current').style.width = `${progress}%`;
    }
  }, 1000);
}

// AI聊天功能
function initAIChat() {
  const aiInput = document.getElementById('ai-input-field');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiVoiceBtn = document.getElementById('ai-voice-btn');
  const aiChatMessages = document.getElementById('ai-chat-messages');
  
  // 预设的AI回复
  const aiResponses = {
    '默认': '我可以帮您改善睡眠质量，请告诉我您遇到了什么问题？',
    '失眠': '失眠是很常见的睡眠问题。我建议您尝试以下方法：1. 保持规律的睡眠时间；2. 睡前减少屏幕使用；3. 尝试我们的"深度放松"音频助眠。',
    '无法入睡': '我理解您的困扰。尝试这些方法：1. 睡前一小时避免蓝光设备；2. 建立固定的睡前仪式；3. 尝试我们的"深度放松"音频冥想，它专为入睡困难设计。',
    '早醒': '早醒可能与多种因素有关。建议您：1. 保持卧室安静昏暗；2. 晚上减少液体摄入；3. 尝试我们的"深度睡眠"音频，它能帮助您保持睡眠状态。',
    '做噩梦': '频繁做噩梦会影响睡眠质量。您可以尝试：1. 睡前放松心情；2. 进行意识清晰梦训练；3. 使用我们的"平静梦境"引导冥想。',
    '打呼噜': '打呼噜可能影响睡眠质量。建议：1. 尝试侧睡；2. 保持健康体重；3. 使用专用枕头；4. 严重情况请咨询医生。',
    '睡觉时间': '成年人理想的睡眠时间为7-9小时。您可以设置睡眠计划，我们会在适当时间提醒您入睡和起床。',
    '冥想': '我们提供多种冥想音频，包括引导式冥想、专注冥想和睡前放松冥想。您可以在"声音"选项卡中找到它们。',
    '白噪音': '白噪音能有效掩盖环境噪音，帮助入睡。我们提供多种白噪音，包括风扇声、雨声和海浪声。',
    '助眠音乐': '音乐能帮助放松身心，我们提供专门设计的助眠音乐，包括轻柔钢琴曲、自然声音和环境音乐。',
    '购买会员': '升级到专业会员可以享受更多功能，包括无限制音频访问、高级AI睡眠分析和个性化睡眠计划。您可以在"我的"页面中购买会员。'
  };
  
  // 发送消息
  function sendMessage() {
    const messageText = aiInput.value.trim();
    if (messageText === '') return;
    
    // 添加用户消息
    addMessage(messageText, 'user');
    aiInput.value = '';
    
    // 处理响应（简单匹配关键词）
    setTimeout(function() {
      let response = aiResponses['默认'];
      Object.keys(aiResponses).forEach(key => {
        if (messageText.includes(key)) {
          response = aiResponses[key];
        }
      });
      addMessage(response, 'ai');
    }, 1000);
  }
  
  // 添加消息到聊天框
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = '刚刚';
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeDiv);
    
    aiChatMessages.appendChild(messageDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }
  
  // 事件监听
  aiSendBtn.addEventListener('click', sendMessage);
  aiInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // 语音输入模拟
  aiVoiceBtn.addEventListener('click', function() {
    this.classList.add('recording');
    
    // 模拟录音中
    setTimeout(() => {
      this.classList.remove('recording');
      aiInput.value = '我最近睡眠质量不好，经常失眠';
      aiInput.focus();
    }, 2000);
  });
}

// 音频播放器功能
function initAudioPlayer() {
  // 模拟进度变化
  const progressBar = document.querySelector('.player-progress-current');
  let width = 0;
  
  setInterval(() => {
    const playerButton = document.querySelector('.player-play i');
    if (playerButton.classList.contains('fa-pause')) {
      width = (width + 0.5) % 100;
      progressBar.style.width = width + '%';
    }
  }, 1000);
}

// 分享功能
function initShareFeatures() {
  const shareModal = document.getElementById('share-modal');
  const shareLinks = document.querySelectorAll('[data-action="share"]');
  const closeButton = shareModal.querySelector('.share-close');
  const copyButton = document.getElementById('copy-link-btn');
  const shareLink = shareModal.querySelector('.share-link input');
  const sharePlatforms = shareModal.querySelectorAll('.share-platform');
  
  // 打开分享弹窗
  function openShareModal() {
    shareModal.classList.add('active');
  }
  
  // 关闭分享弹窗
  function closeShareModal() {
    shareModal.classList.remove('active');
  }
  
  // 复制链接
  function copyLink() {
    shareLink.select();
    document.execCommand('copy');
    
    // 显示复制成功提示
    copyButton.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
  }
  
  // 添加事件监听
  if (shareLinks.length > 0) {
    shareLinks.forEach(link => {
      link.addEventListener('click', openShareModal);
    });
  }
  
  closeButton.addEventListener('click', closeShareModal);
  copyButton.addEventListener('click', copyLink);
  
  // 分享平台点击
  sharePlatforms.forEach(platform => {
    platform.addEventListener('click', function() {
      const platformName = this.querySelector('i').className.split('-')[1];
      console.log(`分享到平台: ${platformName}`);
      
      // 这里可以添加实际的分享功能
      // 模拟分享成功
      this.classList.add('shared');
      setTimeout(() => {
        this.classList.remove('shared');
      }, 1000);
    });
  });
  
  // 为设置中的分享按钮添加事件
  const profileShareBtn = document.querySelector('.settings-item .settings-left i.fa-share-alt');
  if (profileShareBtn) {
    profileShareBtn.parentElement.parentElement.addEventListener('click', openShareModal);
  }
}

// 声音混合器功能
function initMixer() {
  const sliders = document.querySelectorAll('.channel-volume');
  
  sliders.forEach(slider => {
    slider.addEventListener('input', function() {
      const value = this.value;
      const valueDisplay = this.nextElementSibling;
      if (valueDisplay) {
        valueDisplay.textContent = value + '%';
      }
      
      // 如果有实际的音频混合功能，可以在这里实现
      console.log(`音量调整: ${this.previousElementSibling.textContent} = ${value}%`);
    });
  });
}

// 定时器控制
function initTimerControls() {
  const timerDisplay = document.querySelector('.timer-display');
  const timerButtons = document.querySelectorAll('.timer-btn');
  let timerInterval;
  let remainingTime = 30 * 60; // 30分钟，以秒为单位
  
  // 更新定时器显示
  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // 开始定时器
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      if (remainingTime > 0) {
        remainingTime--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        console.log('定时器结束');
        // 这里可以添加定时结束后的行为，如停止播放音频
      }
    }, 1000);
  }
  
  // 设置时间
  function setTime(minutes) {
    remainingTime = minutes * 60;
    updateTimerDisplay();
    startTimer();
  }
  
  // 为按钮添加事件
  timerButtons.forEach(button => {
    button.addEventListener('click', function() {
      const text = this.textContent.trim();
      
      // 移除所有活动状态
      timerButtons.forEach(btn => btn.classList.remove('primary'));
      this.classList.add('primary');
      
      if (text.includes('15')) {
        setTime(15);
      } else if (text.includes('30')) {
        setTime(30);
      } else if (text.includes('60')) {
        setTime(60);
      } else if (text.includes('自定义')) {
        // 打开自定义时间设置
        const customTime = prompt('请输入定时时间（分钟）：', '45');
        if (customTime && !isNaN(customTime)) {
          setTime(parseInt(customTime));
        }
      }
    });
  });
  
  // 初始更新
  updateTimerDisplay();
} 