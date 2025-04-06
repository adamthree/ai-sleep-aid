document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const tabs = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const categoryItems = document.querySelectorAll('.category-item');
  const soundList = document.getElementById('sound-list');
  const audioPlayer = document.getElementById('audio-player');
  const audioToggle = document.querySelector('.player-toggle');
  const aiInput = document.getElementById('ai-input-field');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiVoiceBtn = document.getElementById('ai-voice-btn');
  const aiChatMessages = document.getElementById('ai-chat-messages');
  const shareModal = document.getElementById('share-modal');
  const audioSourcesModal = document.getElementById('audio-sources-modal');
  const audioSourcesList = document.querySelector('.audio-sources-list');
  const showAudioSourcesBtn = document.getElementById('show-audio-sources');
  const shareCloseButtons = document.querySelectorAll('.share-close');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const settingsShareBtn = document.querySelector('.settings-item[data-action="share"]');
  const startSleepBtn = document.querySelector('.hero-cta[data-action="start-sleep"]');
  
  // 当前播放的音频元素
  let currentAudio = null;
  let isPlaying = false;
  
  // 标签切换
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 移除所有激活状态
      tabs.forEach(item => item.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // 添加当前激活状态
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // 声音类别切换
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有激活状态
      categoryItems.forEach(catItem => catItem.classList.remove('active'));
      
      // 添加当前激活状态
      this.classList.add('active');
      
      // 获取选中的类别
      const category = this.getAttribute('data-category');
      
      // 根据类别渲染声音列表
      renderSoundsByCategory(category);
    });
  });
  
  // 根据类别渲染声音列表
  function renderSoundsByCategory(category) {
    // 清空声音列表
    soundList.innerHTML = '';
    
    // 获取指定类别的声音数据
    let sounds = [];
    
    if (category === 'nature') {
      sounds = soundData.nature;
    } else if (category === 'meditation') {
      sounds = soundData.meditation;
    } else if (category === 'whitenoise') {
      sounds = soundData.whitenoise;
    } else if (category === 'music') {
      sounds = soundData.music;
    } else if (category === 'stories') {
      sounds = soundData.stories;
    }
    
    // 为每个声音创建元素
    sounds.forEach(sound => {
      const soundItem = document.createElement('div');
      soundItem.className = 'sound-item';
      soundItem.setAttribute('data-sound', sound.id);
      
      // 使用SVG图标或默认图片
      const imgSrc = sound.image || `assets/images/sounds/${category}.svg`;
      
      soundItem.innerHTML = `
        <img src="${imgSrc}" alt="${sound.title}" class="sound-item-image">
        <div class="sound-item-overlay">
          <div class="sound-item-title">${sound.title}</div>
          <div class="sound-item-artist">${sound.artist}</div>
        </div>
        <div class="sound-item-play">
          <i class="fas fa-play"></i>
        </div>
      `;
      
      // 添加点击事件
      soundItem.addEventListener('click', function() {
        playSound(sound);
      });
      
      // 添加到声音列表
      soundList.appendChild(soundItem);
    });
  }
  
  // 播放声音
  function playSound(sound) {
    // 如果有正在播放的音频，先停止
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    // 创建新的音频元素
    const audio = new Audio();
    
    // 设置音频源
    if (sound.audio) {
      audio.src = sound.audio;
    } else {
      // 模拟音频源，实际项目中应该使用真实的音频文件
      audio.src = 'assets/sounds/' + sound.id + '.mp3';
    }
    
    // 更新播放器UI
    document.querySelector('.player-title').textContent = sound.title;
    document.querySelector('.player-artist').textContent = sound.artist;
    
    // 使用对应的图片
    const playerImage = document.querySelector('.player-image');
    playerImage.src = sound.image || `assets/images/sounds/${sound.category || 'nature'}.svg`;
    
    // 显示播放器
    audioPlayer.classList.add('active');
    
    // 播放错误处理
    audio.addEventListener('error', function() {
      alert('音频文件加载失败，请稍后再试');
      audioPlayer.classList.remove('active');
    });
    
    // 播放音频
    audio.play()
      .then(() => {
        isPlaying = true;
        document.querySelector('.player-play i').className = 'fas fa-pause';
      })
      .catch(error => {
        console.error('播放失败:', error);
        alert('音频播放失败，请检查您的设备是否允许自动播放');
      });
    
    // 保存当前音频
    currentAudio = audio;
    
    // 更新进度条
    updateProgress(audio);
  }
  
  // 更新进度条
  function updateProgress(audio) {
    setInterval(() => {
      if (isPlaying && !audio.paused) {
        const progress = (audio.currentTime / audio.duration) * 100;
        document.querySelector('.player-progress-current').style.width = progress + '%';
      }
    }, 1000);
  }
  
  // 播放/暂停切换
  document.querySelector('.player-play').addEventListener('click', function() {
    if (!currentAudio) return;
    
    if (isPlaying) {
      currentAudio.pause();
      this.querySelector('i').className = 'fas fa-play';
    } else {
      currentAudio.play();
      this.querySelector('i').className = 'fas fa-pause';
    }
    
    isPlaying = !isPlaying;
  });
  
  // 播放器切换显示
  audioToggle.addEventListener('click', function() {
    audioPlayer.classList.toggle('expanded');
  });
  
  // 开始助眠按钮 - 跳转到声音页面
  if (startSleepBtn) {
    startSleepBtn.addEventListener('click', function() {
      // 切换到声音标签
      tabs.forEach(item => item.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      const soundsTab = document.querySelector('.tab-item[data-tab="sounds-tab"]');
      soundsTab.classList.add('active');
      document.getElementById('sounds-tab').classList.add('active');
    });
  }
  
  // AI聊天功能
  function sendAiMessage() {
    const message = aiInput.value.trim();
    if (!message) return;
    
    // 添加用户消息
    addChatMessage(message, 'user');
    
    // 清空输入框
    aiInput.value = '';
    
    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = getAiResponse(message);
      addChatMessage(aiResponse, 'ai');
    }, 1000);
  }
  
  // 添加聊天消息
  function addChatMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${sender}`;
    
    const now = new Date();
    const timeStr = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    
    messageDiv.innerHTML = `
      <div class="message-content">${text}</div>
      <div class="message-time">${timeStr}</div>
    `;
    
    aiChatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }
  
  // 获取AI回复 (简单模拟)
  function getAiResponse(message) {
    message = message.toLowerCase();
    
    if (message.includes('失眠') || message.includes('睡不着') || message.includes('难以入睡')) {
      return '失眠是很常见的问题。您可以尝试：1. 保持规律的作息时间；2. 睡前一小时不使用电子设备；3. 尝试我们的"深度放松"冥想音频；4. 睡前热水澡可以帮助放松身体。您想现在尝试哪个音频放松吗？';
    } else if (message.includes('噩梦') || message.includes('梦魇')) {
      return '频繁的噩梦可能与日常压力有关。您可以尝试睡前写日记，记录并释放白天的焦虑。我们的"平静心灵"冥想对减少噩梦也很有帮助。';
    } else if (message.includes('推荐') || message.includes('建议')) {
      return '根据当前时间，我推荐您尝试"深度睡眠"音频，它结合了轻柔的雨声和7.8Hz的共振频率，有助于进入深度睡眠状态。您想现在开始播放吗？';
    } else if (message.includes('白噪音') || message.includes('噪音')) {
      return '白噪音是掩盖环境干扰的好方法。我们提供多种噪音类型：白噪音、粉红噪音和棕噪音。粉红噪音对大多数人效果最佳，它模拟轻柔的雨声或瀑布声。';
    } else if (message.includes('感谢') || message.includes('谢谢')) {
      return '不客气，很高兴能帮到您。祝您今晚睡个好觉！如果还有其他问题，随时可以问我。';
    } else if (message.includes('音乐') || message.includes('歌')) {
      return '我们的睡眠音乐选择了特定的节奏和频率，能帮助大脑进入睡眠状态。最受欢迎的是"睡眠钢琴曲"和"Delta脑波音乐"，它们都经过精心设计，促进深度放松。';
    } else {
      return '感谢您的信息。我可以帮您解答关于睡眠、放松技巧或推荐适合您的助眠音频。您可以告诉我您当前的睡眠困扰，或者想要什么类型的声音来帮助入睡。';
    }
  }
  
  // 发送按钮点击
  aiSendBtn.addEventListener('click', sendAiMessage);
  
  // 输入框回车发送
  aiInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendAiMessage();
    }
  });
  
  // 语音输入模拟
  aiVoiceBtn.addEventListener('click', function() {
    // 模拟语音识别中
    aiVoiceBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    aiVoiceBtn.disabled = true;
    
    // 模拟识别过程
    setTimeout(() => {
      aiVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      aiVoiceBtn.disabled = false;
      
      // 模拟语音输入结果
      aiInput.value = '我最近总是睡不好，有什么建议吗？';
      sendAiMessage();
    }, 2000);
  });
  
  // 分享弹窗
  if (settingsShareBtn) {
    settingsShareBtn.addEventListener('click', function() {
      shareModal.style.display = 'flex';
    });
  }
  
  // 显示音频来源
  if (showAudioSourcesBtn) {
    showAudioSourcesBtn.addEventListener('click', function() {
      // 填充音频来源列表
      renderAudioSources();
      audioSourcesModal.style.display = 'flex';
    });
  }
  
  // 渲染音频来源列表
  function renderAudioSources() {
    if (!audioSourcesList) return;
    
    audioSourcesList.innerHTML = '';
    
    // 合并所有分类的声音
    const allSounds = [
      ...soundData.nature, 
      ...soundData.meditation, 
      ...soundData.whitenoise, 
      ...soundData.music, 
      ...soundData.stories
    ];
    
    allSounds.forEach(sound => {
      if (sound.source || sound.downloadUrl) {
        const sourceItem = document.createElement('div');
        sourceItem.className = 'audio-source-item';
        
        sourceItem.innerHTML = `
          <div class="source-info">
            <h4>${sound.title}</h4>
            <p>作者: ${sound.artist}</p>
            ${sound.source ? `<p class="source-link">来源: <a href="${sound.source}" target="_blank">${sound.source}</a></p>` : ''}
          </div>
          ${sound.downloadUrl ? `<a href="${sound.downloadUrl}" target="_blank" class="download-btn"><i class="fas fa-download"></i></a>` : ''}
        `;
        
        audioSourcesList.appendChild(sourceItem);
      }
    });
  }
  
  // 关闭弹窗
  shareCloseButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // 找到最近的modal父元素
      const modal = this.closest('.share-modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // 复制链接
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      const linkInput = document.querySelector('.share-link input');
      linkInput.select();
      document.execCommand('copy');
      
      // 显示复制成功提示
      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i>';
      
      setTimeout(() => {
        this.innerHTML = originalHTML;
      }, 2000);
    });
  }
  
  // 初始化 - 默认渲染自然声音
  renderSoundsByCategory('nature');
  
  // 设置PWA相关事件
  window.addEventListener('beforeinstallprompt', (e) => {
    // 防止Chrome 67及更早版本自动显示安装提示
    e.preventDefault();
    // 将事件存储起来，以便稍后触发
    const deferredPrompt = e;
    
    // 可以在适当的时候触发安装提示
    document.addEventListener('click', (e) => {
      if (e.target.closest('.membership-btn')) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('用户接受了安装');
          } else {
            console.log('用户拒绝了安装');
          }
        });
      }
    });
  });
  
  // 响应式调整
  function handleResize() {
    if (window.innerWidth > 768) {
      // 在大屏幕上自动展开侧栏等操作
    }
  }
  
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化调用
}); 