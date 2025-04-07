document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const soundList = document.getElementById('sound-list');
  const audioPlayer = document.getElementById('audio-player');
  const playerImage = document.getElementById('player-image');
  const playerClose = document.getElementById('player-close');
  const playerPlay = document.querySelector('.player-play');
  const soundCategories = document.querySelectorAll('.category-item');
  const tabItems = document.querySelectorAll('.tab-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const shareButtons = document.querySelectorAll('[data-action="share"]');
  const shareModal = document.getElementById('share-modal');
  const shareCloseButtons = document.querySelectorAll('.share-close');
  const audioSourcesList = document.querySelector('.audio-sources-list');
  const showAudioSourcesBtn = document.getElementById('show-audio-sources');
  const audioSourcesModal = document.getElementById('audio-sources-modal');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const worldMapContainer = document.getElementById('interactive-map');
  const popularLocationItems = document.querySelectorAll('.location-item');
  const checkinShareButtons = document.querySelectorAll('.share-checkin-btn');
  const createCheckinBtn = document.querySelector('.create-checkin-btn');
  const aiVoiceBtn = document.getElementById('ai-voice-btn');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiInputField = document.getElementById('ai-input-field');

  // 状态变量
  let currentCategory = 'nature'; // 默认分类
  let isPlaying = false;
  let activeSoundTracks = []; // 活跃音轨列表
  let masterVolume = 0.7; // 主音量
  let voiceRecognition = null; // 语音识别对象
  let isContinuousMode = false; // 是否连续语音模式

  // 当前AI对话状态
  let isAiResponding = false;
  let shouldResumeVoiceAfterResponse = false;

  // 音频元素
  let currentAudio = null;
  const playerEl = document.getElementById('audio-player');
  const playerTitle = document.querySelector('.player-title');
  const playerArtist = document.querySelector('.player-artist');
  const playerProgress = document.querySelector('.player-progress-current');
  const playerPlayBtn = document.querySelector('.player-play');
  const playerCloseBtn = document.getElementById('player-close');

  // 声音播放功能
  function playSound(soundId, title, artist, image) {
    // 停止当前正在播放的音频
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    // 获取音频URL
    const audioSrc = getSoundUrl(soundId);
    
    // 创建新的音频元素
    currentAudio = new Audio(audioSrc);
    currentAudio.loop = true;
    
    // 加载和播放
    currentAudio.addEventListener('canplaythrough', function() {
      currentAudio.play()
        .then(() => {
          isPlaying = true;
          playerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
          showNotification('开始播放', `正在播放: ${title}`);
        })
        .catch(error => {
          console.error('播放失败:', error);
          showNotification('播放失败', '无法播放所选音频，请尝试其他音频。');
        });
    });
    
    currentAudio.addEventListener('error', function() {
      console.error('音频加载错误');
      showNotification('加载失败', '无法加载所选音频，请检查网络连接或尝试其他音频。');
    });
    
    // 更新播放器UI
    playerImage.src = image;
    playerTitle.textContent = title;
    playerArtist.textContent = artist;
    playerEl.style.display = 'flex';
    
    // 显示播放器
    setTimeout(() => {
      playerEl.classList.add('active');
    }, 10);
    
    // 更新进度条
    if (currentAudio) {
      setInterval(() => {
        if (isPlaying && currentAudio.duration) {
          const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
          playerProgress.style.width = `${progress}%`;
        }
      }, 1000);
    }
  }
  
  // 获取音频URL
  function getSoundUrl(soundId) {
    // 稳定的音频源
    const soundUrls = {
      'rain': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0f6c318b4.mp3',
      'ocean': 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_d6f899a183.mp3',
      'forest': 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_dca145d650.mp3',
      'fire': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_5c4d07a6a6.mp3',
      'birds': 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_fcc2b3e25f.mp3',
      'wind': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_4f66bee6c5.mp3',
      'thunder': 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_9788d2a482.mp3',
      'white-noise': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8a21bc5.mp3',
      'tibetan-bowl': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_f9eb8b8420.mp3',
      'piano-sleep': 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_b5e66836e0.mp3'
    };
    
    return soundUrls[soundId] || `assets/sounds/${soundId}.mp3`;
  }

  // 获取分类的显示名称
  function getCategoryDisplayName(category) {
    const displayNames = {
      'nature': '自然音效',
      'meditation': '冥想音乐',
      'whitenoise': '白噪音',
      'music': '轻音乐',
      'stories': '睡眠故事'
    };
    
    return displayNames[category] || '音效';
  }

  // 显示通知
  function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // 渲染声音列表
  function renderSoundList(category = 'nature') {
    soundList.innerHTML = '';
    
    const sounds = soundData[category] || [];
    sounds.forEach(sound => {
      const soundItem = document.createElement('div');
      soundItem.className = 'sound-item';
      soundItem.innerHTML = `
        <img src="${sound.image}" alt="${sound.title}" class="sound-item-image">
        <div class="sound-item-overlay">
          <div class="sound-item-title">${sound.title}</div>
          <div class="sound-item-artist">${sound.artist}</div>
        </div>
        <div class="sound-item-play">
          <i class="fas fa-play"></i>
        </div>
      `;
      
      soundItem.addEventListener('click', () => {
        playSound(sound.id, sound.title, sound.artist, sound.image);
      });
      
      soundList.appendChild(soundItem);
    });
  }

  // 切换声音分类
  soundCategories.forEach(item => {
    item.addEventListener('click', () => {
      const category = item.getAttribute('data-category');
      
      // 更新活跃状态
      soundCategories.forEach(cat => cat.classList.remove('active'));
      item.classList.add('active');
      
      // 渲染对应分类的声音列表
      renderSoundList(category);
    });
  });

  // 切换标签页
  tabItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      
      // 更新活跃状态
      tabItems.forEach(tab => tab.classList.remove('active'));
      item.classList.add('active');
      
      // 显示对应的标签内容
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    });
  });

  // 播放/暂停按钮事件
  playerPlayBtn.addEventListener('click', () => {
    if (!currentAudio) return;
    
    if (isPlaying) {
      currentAudio.pause();
      playerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
      isPlaying = false;
    } else {
      currentAudio.play();
      playerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
      isPlaying = true;
    }
  });

  // 关闭播放器按钮事件
  playerCloseBtn.addEventListener('click', () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    
    playerEl.classList.remove('active');
    setTimeout(() => {
      playerEl.style.display = 'none';
    }, 300);
    
    isPlaying = false;
  });

  // AI聊天功能
  const aiChatMessages = document.getElementById('ai-chat-messages');
  
  // 发送AI消息
  function sendAiMessage(message) {
    if (!message.trim()) return;
    
    // 添加用户消息
    const userMessageEl = document.createElement('div');
    userMessageEl.className = 'message message-user';
    userMessageEl.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-time">${getCurrentTime()}</div>
    `;
    aiChatMessages.appendChild(userMessageEl);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    
    // 清空输入框
    aiInputField.value = '';
    
    // 处理消息内容
    processAiMessage(message);
  }
  
  // 处理AI消息
  function processAiMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // 简单的响应逻辑
    let response = '';
    
    if (lowerMessage.includes('你好') || lowerMessage.includes('嗨') || lowerMessage.includes('hi')) {
      response = '你好！我是梦境守护者AI助手，有什么可以帮到你的？';
    } else if (lowerMessage.includes('播放') || lowerMessage.includes('听')) {
      if (lowerMessage.includes('雨') || lowerMessage.includes('雨声')) {
        playSound('rain', '轻柔雨声', '大自然', 'assets/images/sounds/rain.svg');
        response = '正在为你播放轻柔的雨声，希望能帮助你放松入睡。';
      } else if (lowerMessage.includes('海') || lowerMessage.includes('海浪')) {
        playSound('ocean', '海浪声', '大自然', 'assets/images/sounds/ocean.svg');
        response = '正在为你播放平静的海浪声，闭上眼睛想象自己躺在海边的沙滩上吧。';
      } else if (lowerMessage.includes('森林') || lowerMessage.includes('鸟')) {
        playSound('forest', '森林声音', '大自然', 'assets/images/sounds/forest.svg');
        response = '正在为你播放森林的环境声，包含鸟鸣和自然风声。';
      } else {
        response = '抱歉，我没有找到你想听的声音。你可以尝试"雨声"，"海浪声"或"森林声音"。';
      }
    } else if (lowerMessage.includes('失眠')) {
      response = '失眠是常见的睡眠问题。我建议你可以：<br>1. 尝试规律作息，每天同一时间上床<br>2. 睡前避免咖啡因和蓝光设备<br>3. 尝试深呼吸或冥想<br>4. 听一些放松的自然声音';
    } else if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
      response = '不客气！如果还有其他问题，随时可以问我。祝你有个美好的梦境！';
    } else {
      response = '我还在学习中，暂时理解不了这个问题。你可以问我关于睡眠的建议，或者让我播放一些助眠声音。';
    }
    
    // 显示AI回复
    setTimeout(() => {
      const aiMessageEl = document.createElement('div');
      aiMessageEl.className = 'message message-ai';
      aiMessageEl.innerHTML = `
        <div class="message-content">${response}</div>
        <div class="message-time">${getCurrentTime()}</div>
      `;
      aiChatMessages.appendChild(aiMessageEl);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }, 1000);
  }
  
  // 获取当前时间
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // AI发送按钮事件
  aiSendBtn.addEventListener('click', () => {
    sendAiMessage(aiInputField.value);
  });
  
  // AI输入框回车事件
  aiInputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendAiMessage(aiInputField.value);
    }
  });

  // 初始加载默认分类的声音列表
  renderSoundList('nature');

  // 添加音轨
  function addSoundTrack(sound) {
    // 检查音轨是否已存在
    const existingTrack = activeSoundTracks.find(track => track.sound.id === sound.id);
    if (existingTrack) {
      // 如果音轨已存在，将其音量恢复到较高水平
      existingTrack.volume = masterVolume;
      if (existingTrack.audio) {
        existingTrack.audio.volume = masterVolume;
      }
      return;
    }
    
    // 更新播放器UI（无论音频是否加载成功，都更新UI）
    updatePlayerUI(sound);
    
    // 创建新的音频元素
    const audio = new Audio();
    
    // 尝试设置音频源
    const audioUrl = getSoundUrl(sound.id);
    audio.src = audioUrl;
    
    // 设置循环播放
    audio.loop = true;
    
    // 设置音量
    audio.volume = masterVolume;
    
    // 错误处理
    audio.addEventListener('error', function() {
      console.log('音频加载失败，使用模拟播放模式');
      showNotification('播放提示', '正在使用模拟播放模式');
    });
    
    // 添加到活动音轨列表
    activeSoundTracks.push({
      sound: sound,
      audio: audio,
      volume: masterVolume
    });
    
    // 尝试播放
    audio.play().then(() => {
      showNotification('开始播放', `正在播放: ${sound.title}`);
    }).catch(error => {
      console.log('浏览器阻止了自动播放:', error);
      showNotification('播放提示', '请点击屏幕任意位置启动播放');
      
      // 添加一次性点击事件启动播放
      document.body.addEventListener('click', function playOnClick() {
        audio.play().then(() => {
          showNotification('开始播放', `正在播放: ${sound.title}`);
        }).catch(() => {
          showNotification('播放失败', '请检查您的浏览器设置，允许音频播放');
        });
        document.body.removeEventListener('click', playOnClick);
      }, { once: true });
    });
    
    // 更新音轨混合器UI
    updateMixerUI();
    
    // 更新进度条
    updateProgress(audio);
  }
}); 