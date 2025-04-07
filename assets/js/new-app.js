document.addEventListener('DOMContentLoaded', function() {
  // DOM元素
  const soundGrid = document.getElementById('sound-grid');
  const playerContainer = document.getElementById('player-container');
  const playerThumbnail = document.getElementById('player-thumbnail');
  const playerTitle = document.getElementById('player-title');
  const playerSubtitle = document.getElementById('player-subtitle');
  const playerProgressBar = document.getElementById('player-progress-bar');
  const playerPlayBtn = document.getElementById('player-play-btn');
  const playIcon = document.getElementById('play-icon');
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const categoryItems = document.querySelectorAll('.category-item');
  const mixerContainer = document.getElementById('mixer-container');
  const mixerChannels = document.getElementById('mixer-channels');
  const clearMixBtn = document.getElementById('clear-mix-btn');
  const saveMixBtn = document.getElementById('save-mix-btn');
  const aiMessages = document.getElementById('ai-messages');
  const aiInputField = document.getElementById('ai-input-field');
  const aiSendBtn = document.getElementById('ai-send-btn');
  const aiVoiceBtn = document.getElementById('ai-voice-btn');
  const notification = document.getElementById('notification');
  
  // 状态变量
  let isPlaying = false;
  let currentCategory = 'nature';
  let activeSounds = [];
  let masterVolume = 0.7;
  
  // 获取实际音频URL
  function getSoundUrl(soundId) {
    // 使用可靠的开源音频源
    const soundUrls = {
      'rain': 'https://freesound.org/data/previews/346/346176_5861568-lq.mp3',
      'forest': 'https://freesound.org/data/previews/244/244942_1952064-lq.mp3',
      'ocean': 'https://freesound.org/data/previews/527/527597_11597890-lq.mp3',
      'river': 'https://freesound.org/data/previews/163/163578_2959932-lq.mp3',
      'tibetan-bowl': 'https://freesound.org/data/previews/408/408740_5121236-lq.mp3',
      'om-chanting': 'https://freesound.org/data/previews/131/131645_2398403-lq.mp3',
      'white-noise': 'https://freesound.org/data/previews/505/505402_7443375-lq.mp3',
      'pink-noise': 'https://freesound.org/data/previews/179/179562_1976076-lq.mp3',
      'piano-sleep': 'https://freesound.org/data/previews/612/612095_5674468-lq.mp3',
      'ambient-sleep': 'https://freesound.org/data/previews/419/419428_7866282-lq.mp3'
    };
    
    // 备用音频源
    const backupSounds = {
      'rain': 'https://www.soundjay.com/nature/rain-01.mp3',
      'forest': 'https://www.soundjay.com/nature/sounds/forest-morning-1.mp3',
      'ocean': 'https://www.soundjay.com/nature/ocean-wave-1.mp3',
      'river': 'https://www.soundjay.com/nature/stream-1.mp3',
      'tibetan-bowl': 'https://www.soundjay.com/bells/bell-meditation-01.mp3',
      'om-chanting': 'https://freesound.org/data/previews/131/131645_2398403-lq.mp3',
      'white-noise': 'https://freesound.org/data/previews/125/125930_1064124-lq.mp3',
      'pink-noise': 'https://freesound.org/data/previews/22/22252_78093-lq.mp3',
      'piano-sleep': 'https://freesound.org/data/previews/176/176387_1381134-lq.mp3',
      'ambient-sleep': 'https://freesound.org/data/previews/59/59967_49271-lq.mp3'
    };
    
    console.log(`获取音频URL: ${soundId}`);
    // 如果没有找到URL，返回备用音频
    return soundUrls[soundId] || backupSounds[soundId] || 'https://freesound.org/data/previews/125/125930_1064124-lq.mp3';
  }
  
  // 获取备用声音URL
  function getBackupSoundUrl(soundId) {
    const backupSounds = {
      'rain': 'https://cdn.pixabay.com/download/audio/2022/03/26/audio_1c1b15c5a6.mp3',
      'forest': 'https://cdn.pixabay.com/download/audio/2021/10/25/audio_d40dab1e68.mp3',
      'ocean': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1519592a5.mp3',
      'river': 'https://cdn.pixabay.com/download/audio/2022/01/10/audio_d1aa7083e9.mp3',
      'tibetan-bowl': 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_95fee22a33.mp3',
      'om-chanting': 'https://cdn.pixabay.com/download/audio/2022/11/26/audio_7c84f4f4ea.mp3',
      'white-noise': 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_d6ba7a2592.mp3',
      'pink-noise': 'https://cdn.pixabay.com/download/audio/2022/03/01/audio_c4d440ff4a.mp3',
      'piano-sleep': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_8eb4bd8592.mp3',
      'ambient-sleep': 'https://cdn.pixabay.com/download/audio/2022/04/27/audio_94aedc1721.mp3'
    };
    
    console.log(`获取备用音频URL: ${soundId}`);
    return backupSounds[soundId] || 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1519592a5.mp3';
  }
  
  // 初始化声音列表
  function initSoundGrid() {
    const container = document.querySelector('.sounds-grid-container');
    if (!container) {
      console.error("找不到声音网格容器");
      return;
    }
    
    container.innerHTML = '';
    
    // 获取当前分类的声音
    const sounds = soundData[currentCategory] || [];
    
    // 创建声音卡片
    sounds.forEach(sound => {
      const soundCard = document.createElement('div');
      soundCard.className = 'sound-card';
      soundCard.dataset.soundId = sound.id;
      
      // 检查是否是活动声音
      if (activeSounds.some(s => s.id === sound.id)) {
        soundCard.classList.add('active');
      }
      
      soundCard.innerHTML = `
        <div class="sound-card-img">
          <img src="${sound.image}" alt="${sound.title}">
          <div class="sound-play-btn">
            <i class="fas ${activeSounds.some(s => s.id === sound.id) ? 'fa-pause' : 'fa-play'}"></i>
          </div>
        </div>
        <div class="sound-card-info">
          <div class="sound-title">${sound.title}</div>
          <div class="sound-subtitle">${sound.artist}</div>
        </div>
      `;
      
      // 点击事件
      soundCard.addEventListener('click', () => {
        toggleSound(sound);
      });
      
      container.appendChild(soundCard);
    });
  }
  
  // 切换声音播放状态
  function toggleSound(sound) {
    console.log("点击声音:", sound.id); // 添加调试日志
    
    // 检查声音是否已经在活动列表中
    const existingIndex = activeSounds.findIndex(s => s.id === sound.id);
    
    if (existingIndex >= 0) {
      console.log("移除已存在的声音");
      // 移除声音
      const removedSound = activeSounds.splice(existingIndex, 1)[0];
      if (removedSound.audio) {
        removedSound.audio.pause();
        removedSound.audio = null;
      }
      
      // 更新UI
      updateSoundCardState(sound.id, false);
      
      // 如果没有活动声音，隐藏播放器和混音器
      if (activeSounds.length === 0) {
        playerContainer.classList.remove('active');
        mixerContainer.style.display = 'none';
        isPlaying = false;
      } else {
        // 更新播放器为另一个活动声音
        updatePlayerInfo(activeSounds[0]);
        updateMixerChannels();
      }
      
      // 触发自定义事件
      document.dispatchEvent(new CustomEvent('soundDeactivated', {
        detail: { soundId: sound.id }
      }));
    } else {
      console.log("添加新声音");
      // 创建音频对象
      const audio = new Audio();
      
      // 获取声音URL
      const soundUrl = getSoundUrl(sound.id);
      console.log("使用音频URL:", soundUrl);
      
      // 设置音频参数
      audio.src = soundUrl;
      audio.loop = true;
      audio.volume = masterVolume;
      
      // 音频加载错误处理
      audio.onerror = function(e) {
        console.error("音频加载错误", e);
        // 尝试使用备用URL
        const backupUrl = getBackupSoundUrl(sound.id);
        console.log("尝试备用URL:", backupUrl);
        audio.src = backupUrl;
        
        // 再次尝试播放
        const playPromise = audio.play().catch(err => {
          console.error("备用播放错误:", err);
          showAudioInteractionPrompt();
        });
      };
      
      // 添加到活动声音列表
      activeSounds.push({
        id: sound.id,
        title: sound.title,
        image: sound.image,
        audio: audio
      });
      
      // 预先更新UI，不等待播放成功
      updateSoundCardState(sound.id, true);
      updatePlayerInfo(sound);
      playerContainer.classList.add('active');
      
      // 显示混音器（如果有多个声音）
      if (activeSounds.length > 1) {
        mixerContainer.style.display = 'block';
      }
      
      // 更新混音器
      updateMixerChannels();
      
      // 触发自定义事件
      document.dispatchEvent(new CustomEvent('soundActivated', {
        detail: { soundId: sound.id }
      }));
      
      // 尝试播放
      try {
        console.log("尝试播放音频");
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("播放成功");
            isPlaying = true;
            playIcon.className = 'fas fa-pause';
            
            // 确保logo更新
            document.dispatchEvent(new CustomEvent('soundActivated', {
              detail: { soundId: sound.id }
            }));
          }).catch(error => {
            console.error('播放失败:', error);
            
            // 尝试使用备用URL
            const backupUrl = getBackupSoundUrl(sound.id);
            console.log("尝试备用URL:", backupUrl);
            
            audio.src = backupUrl;
            audio.play().then(() => {
              console.log("备用播放成功");
              isPlaying = true;
              playIcon.className = 'fas fa-pause';
              
              // 确保logo更新
              document.dispatchEvent(new CustomEvent('soundActivated', {
                detail: { soundId: sound.id }
              }));
            }).catch(e => {
              console.error("备用播放失败:", e);
              // 显示交互提示
              showAudioInteractionPrompt();
            });
          });
        }
      } catch (error) {
        console.error("播放时出错:", error);
        showAudioInteractionPrompt();
      }
    }
  }
  
  // 暴露toggleSound函数到window对象
  window.toggleSound = toggleSound;
  
  // 显示音频交互提示
  function showAudioInteractionPrompt() {
    // 检查是否已有提示
    if (document.querySelector('.audio-prompt')) return;
    
    const prompt = document.createElement('div');
    prompt.className = 'audio-prompt';
    prompt.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(40, 40, 60, 0.9);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      text-align: center;
      max-width: 80%;
    `;
    
    prompt.innerHTML = `
      <h3 style="margin-bottom: 15px; color: white;">点击启动音频</h3>
      <p style="margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">
        由于浏览器限制，播放音频需要用户交互。请点击下方按钮开始播放。
      </p>
      <button style="
        background-color: #7F5CFF;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: pointer;
      ">开始播放</button>
    `;
    
    document.body.appendChild(prompt);
    
    const button = prompt.querySelector('button');
    button.addEventListener('click', () => {
      // 尝试播放所有活动声音
      activeSounds.forEach(sound => {
        if (sound.audio) {
          sound.audio.play()
            .then(() => {
              console.log("用户交互后播放成功");
              isPlaying = true;
              playIcon.className = 'fas fa-pause';
            })
            .catch(e => console.error("用户交互后播放失败:", e));
        }
      });
      
      // 移除提示
      prompt.remove();
    });
  }
  
  // 更新声音卡片状态
  function updateSoundCardState(soundId, isActive) {
    console.log("更新声音卡片状态:", soundId, isActive);
    const soundCard = document.querySelector(`.sound-card[data-sound-id="${soundId}"]`);
    if (soundCard) {
      if (isActive) {
        soundCard.classList.add('active');
        const playIcon = soundCard.querySelector('.sound-play-btn i');
        if (playIcon) {
          playIcon.className = 'fas fa-pause';
        }
      } else {
        soundCard.classList.remove('active');
        const playIcon = soundCard.querySelector('.sound-play-btn i');
        if (playIcon) {
          playIcon.className = 'fas fa-play';
        }
      }
    } else {
      console.warn("找不到声音卡片:", soundId);
    }
  }
  
  // 更新播放器信息
  function updatePlayerInfo(sound) {
    console.log("更新播放器信息:", sound);
    if (!sound) {
      console.warn("没有声音信息可更新");
      return;
    }
    
    playerThumbnail.src = sound.image || '';
    playerTitle.textContent = sound.title || '未知声音';
    playerSubtitle.textContent = sound.artist || '';
    
    // 确保播放器可见
    if (!playerContainer.classList.contains('active')) {
      playerContainer.classList.add('active');
    }
  }
  
  // 更新混音器通道
  function updateMixerChannels() {
    mixerChannels.innerHTML = '';
    
    activeSounds.forEach(sound => {
      const channel = document.createElement('div');
      channel.className = 'mixer-channel';
      
      channel.innerHTML = `
        <div class="channel-info">${sound.title}</div>
        <div class="channel-controls">
          <input type="range" class="channel-volume" min="0" max="100" value="${sound.audio ? sound.audio.volume * 100 : masterVolume * 100}" data-sound-id="${sound.id}">
          <div class="channel-value">${Math.round((sound.audio ? sound.audio.volume : masterVolume) * 100)}%</div>
          <!-- 添加播放速度控制 -->
          <select class="channel-speed" data-sound-id="${sound.id}">
            <option value="0.5" ${sound.audio && sound.audio.playbackRate === 0.5 ? 'selected' : ''}>0.5x</option>
            <option value="0.75" ${sound.audio && sound.audio.playbackRate === 0.75 ? 'selected' : ''}>0.75x</option>
            <option value="1" ${!sound.audio || sound.audio.playbackRate === 1 ? 'selected' : ''}>1x</option>
            <option value="1.25" ${sound.audio && sound.audio.playbackRate === 1.25 ? 'selected' : ''}>1.25x</option>
            <option value="1.5" ${sound.audio && sound.audio.playbackRate === 1.5 ? 'selected' : ''}>1.5x</option>
          </select>
          <button class="channel-remove" data-sound-id="${sound.id}"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // 添加音量变更事件
      const volumeSlider = channel.querySelector('.channel-volume');
      const volumeValue = channel.querySelector('.channel-value');
      
      volumeSlider.addEventListener('input', function() {
        const value = parseFloat(this.value) / 100;
        const soundId = this.dataset.soundId;
        const soundIndex = activeSounds.findIndex(s => s.id === soundId);
        
        if (soundIndex >= 0 && activeSounds[soundIndex].audio) {
          activeSounds[soundIndex].audio.volume = value;
          volumeValue.textContent = `${Math.round(value * 100)}%`;
        }
      });
      
      // 添加播放速度变更事件
      const speedSelector = channel.querySelector('.channel-speed');
      speedSelector.addEventListener('change', function() {
        const speed = parseFloat(this.value);
        const soundId = this.dataset.soundId;
        const soundIndex = activeSounds.findIndex(s => s.id === soundId);
        
        if (soundIndex >= 0 && activeSounds[soundIndex].audio) {
          activeSounds[soundIndex].audio.playbackRate = speed;
        }
      });
      
      // 添加删除事件
      const removeButton = channel.querySelector('.channel-remove');
      removeButton.addEventListener('click', function() {
        const soundId = this.dataset.soundId;
        toggleSound(soundData[currentCategory].find(s => s.id === soundId));
      });
      
      mixerChannels.appendChild(channel);
    });
  }
  
  // 样式添加
  function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .channel-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .channel-speed {
        background-color: rgba(40, 40, 60, 0.8);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        padding: 4px;
        font-size: 12px;
      }
      
      .mixer-channel {
        margin-bottom: 12px;
        padding: 8px 12px;
        background-color: rgba(30, 30, 40, 0.6);
        border-radius: 8px;
      }
    `;
    document.head.appendChild(styleElement);
  }
  
  // 初始化时添加样式
  addStyles();
  
  // 播放/暂停所有声音
  function togglePlayAll() {
    if (activeSounds.length === 0) return;
    
    if (isPlaying) {
      // 暂停所有声音
      activeSounds.forEach(sound => {
        if (sound.audio) {
          sound.audio.pause();
        }
      });
      
      isPlaying = false;
      playIcon.className = 'fas fa-play';
    } else {
      // 播放所有声音
      const playPromises = activeSounds.map(sound => {
        if (sound.audio) {
          return sound.audio.play();
        }
        return Promise.resolve();
      });
      
      Promise.all(playPromises)
        .then(() => {
          isPlaying = true;
          playIcon.className = 'fas fa-pause';
        })
        .catch(error => {
          console.error('播放失败:', error);
          
          // 显示错误通知
          showNotification('播放失败', '请点击屏幕以允许音频播放', 'error');
          
          // 添加一次性点击事件以启动播放
          document.body.addEventListener('click', function playOnClick() {
            const newPlayPromises = activeSounds.map(sound => {
              if (sound.audio) {
                return sound.audio.play();
              }
              return Promise.resolve();
            });
            
            Promise.all(newPlayPromises)
              .then(() => {
                isPlaying = true;
                playIcon.className = 'fas fa-pause';
              });
            
            document.body.removeEventListener('click', playOnClick);
          }, { once: true });
        });
    }
  }
  
  // 清空所有声音
  function clearAllSounds() {
    activeSounds.forEach(sound => {
      if (sound.audio) {
        sound.audio.pause();
      }
      updateSoundCardState(sound.id, false);
    });
    
    activeSounds = [];
    isPlaying = false;
    
    playerContainer.classList.remove('active');
    mixerContainer.style.display = 'none';
    
    showNotification('已清空', '所有声音已停止播放');
  }
  
  // 保存混音
  function saveMix() {
    // 在实际应用中，这里会保存到服务器或本地存储
    const mixData = activeSounds.map(sound => ({
      id: sound.id,
      volume: sound.audio ? sound.audio.volume : masterVolume
    }));
    
    // 保存到本地存储
    try {
      const savedMixes = JSON.parse(localStorage.getItem('natureSleepMixes') || '[]');
      const newMix = {
        id: 'mix-' + Date.now(),
        title: '我的混音 ' + (savedMixes.length + 1),
        date: new Date().toISOString(),
        sounds: mixData
      };
      
      savedMixes.push(newMix);
      localStorage.setItem('natureSleepMixes', JSON.stringify(savedMixes));
      
      showNotification('已保存', '您的混音已成功保存');
    } catch (error) {
      console.error('保存失败:', error);
      showNotification('保存失败', '无法保存到本地存储', 'error');
    }
  }
  
  // 显示通知
  function showNotification(title, message, type = 'success') {
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationTitle = notification.querySelector('.notification-title');
    const notificationMessage = notification.querySelector('.notification-message');
    
    if (type === 'success') {
      notificationIcon.className = 'fas fa-check-circle notification-icon';
      notificationIcon.style.color = '#4CAF50';
    } else if (type === 'error') {
      notificationIcon.className = 'fas fa-exclamation-circle notification-icon';
      notificationIcon.style.color = '#F44336';
    } else if (type === 'info') {
      notificationIcon.className = 'fas fa-info-circle notification-icon';
      notificationIcon.style.color = '#2196F3';
    }
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    notification.classList.add('show');
    
    // 3秒后隐藏通知
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // 添加AI消息
  function addAiMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message message-user' : 'message message-ai';
    
    // 获取当前时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-time">${hours}:${minutes}</div>
    `;
    
    aiMessages.appendChild(messageDiv);
    
    // 滚动到底部
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }
  
  // 处理AI消息
  function handleAiMessage(message) {
    addAiMessage(message, true);
    aiInputField.value = '';
    
    // 模拟AI思考
    setTimeout(() => {
      const response = processAiRequest(message);
      addAiMessage(response);
    }, 1000);
  }
  
  // 处理AI请求
  function processAiRequest(message) {
    const lowerMessage = message.toLowerCase();
    
    // 匹配播放声音的请求
    if (lowerMessage.includes('播放')) {
      let soundToPlay = null;
      
      if (lowerMessage.includes('雨') || lowerMessage.includes('雨声')) {
        soundToPlay = soundData.nature.find(s => s.id === 'rain');
      } else if (lowerMessage.includes('海') || lowerMessage.includes('海浪') || lowerMessage.includes('海洋')) {
        soundToPlay = soundData.nature.find(s => s.id === 'ocean');
      } else if (lowerMessage.includes('森林')) {
        soundToPlay = soundData.nature.find(s => s.id === 'forest');
      } else if (lowerMessage.includes('河') || lowerMessage.includes('溪流')) {
        soundToPlay = soundData.nature.find(s => s.id === 'river');
      } else if (lowerMessage.includes('白噪音')) {
        soundToPlay = soundData.whitenoise.find(s => s.id === 'white-noise');
      } else if (lowerMessage.includes('冥想') || lowerMessage.includes('禅')) {
        soundToPlay = soundData.meditation.find(s => s.id === 'tibetan-bowl');
      } else if (lowerMessage.includes('钢琴') || lowerMessage.includes('音乐')) {
        soundToPlay = soundData.music.find(s => s.id === 'piano-sleep');
      }
      
      if (soundToPlay) {
        // 切换到对应分类
        const category = Object.keys(soundData).find(key => 
          soundData[key].some(s => s.id === soundToPlay.id)
        );
        
        if (category) {
          currentCategory = category;
          updateCategorySelection();
          initSoundGrid();
          
          // 播放声音
          setTimeout(() => {
            toggleSound(soundToPlay);
          }, 500);
          
          return `好的，正在为您播放「${soundToPlay.title}」。您还可以添加其他声音进行混合，例如"添加雨声"、"添加鸟鸣声"等。`;
        }
      }
      
      return '抱歉，我没有找到您想要播放的声音。您可以尝试"播放雨声"、"播放海浪声"等。';
    }
    
    // 匹配添加声音的请求
    if (lowerMessage.includes('添加') || lowerMessage.includes('加入') || lowerMessage.includes('混合')) {
      let soundToAdd = null;
      
      if (lowerMessage.includes('雨') || lowerMessage.includes('雨声')) {
        soundToAdd = soundData.nature.find(s => s.id === 'rain');
      } else if (lowerMessage.includes('海') || lowerMessage.includes('海浪') || lowerMessage.includes('海洋')) {
        soundToAdd = soundData.nature.find(s => s.id === 'ocean');
      } else if (lowerMessage.includes('森林')) {
        soundToAdd = soundData.nature.find(s => s.id === 'forest');
      } else if (lowerMessage.includes('河') || lowerMessage.includes('溪流')) {
        soundToAdd = soundData.nature.find(s => s.id === 'river');
      } else if (lowerMessage.includes('白噪音')) {
        soundToAdd = soundData.whitenoise.find(s => s.id === 'white-noise');
      } else if (lowerMessage.includes('冥想') || lowerMessage.includes('禅')) {
        soundToAdd = soundData.meditation.find(s => s.id === 'tibetan-bowl');
      } else if (lowerMessage.includes('钢琴') || lowerMessage.includes('音乐')) {
        soundToAdd = soundData.music.find(s => s.id === 'piano-sleep');
      }
      
      if (soundToAdd && !activeSounds.some(s => s.id === soundToAdd.id)) {
        // 切换到对应分类
        const category = Object.keys(soundData).find(key => 
          soundData[key].some(s => s.id === soundToAdd.id)
        );
        
        if (category) {
          currentCategory = category;
          updateCategorySelection();
          initSoundGrid();
          
          // 添加声音
          setTimeout(() => {
            toggleSound(soundToAdd);
          }, 500);
          
          return `好的，已为您添加「${soundToAdd.title}」。您可以继续添加其他声音，或调整音量。`;
        }
      } else if (soundToAdd) {
        return `「${soundToAdd.title}」已经在您的混音中了。您可以尝试添加其他声音。`;
      }
      
      return '抱歉，我没有找到您想要添加的声音。您可以尝试"添加雨声"、"添加海浪声"等。';
    }
    
    // 匹配停止播放的请求
    if (lowerMessage.includes('停止') || lowerMessage.includes('暂停') || lowerMessage.includes('关闭')) {
      clearAllSounds();
      return '已停止所有声音播放。';
    }
    
    // 匹配睡眠问题
    if (lowerMessage.includes('失眠') || lowerMessage.includes('睡不着') || lowerMessage.includes('难以入睡')) {
      return '对于失眠问题，我推荐您尝试以下方法：\n1. 尝试播放轻柔的雨声或白噪音\n2. 保持规律的作息时间\n3. 睡前一小时避免使用电子设备\n4. 尝试深呼吸放松练习\n\n您想要我播放什么声音来帮助您入睡吗？';
    }
    
    // 默认回复
    return '您可以告诉我您想听的声音，例如"播放雨声"、"播放海浪声"，或者询问我睡眠相关的建议。您也可以说"添加森林声音"来混合多种声音。';
  }
  
  // 更新分类选择
  function updateCategorySelection() {
    categoryItems.forEach(item => {
      if (item.dataset.category === currentCategory) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  // 事件监听器
  
  // 播放/暂停按钮
  playerPlayBtn.addEventListener('click', togglePlayAll);
  
  // 底部导航
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const tabId = this.dataset.tab;
      
      // 更新导航项状态
      navItems.forEach(navItem => navItem.classList.remove('active'));
      this.classList.add('active');
      
      // 更新标签内容
      tabContents.forEach(content => {
        if (content.id === tabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
  
  // 分类选择
  categoryItems.forEach(item => {
    item.addEventListener('click', function() {
      currentCategory = this.dataset.category;
      
      // 更新分类状态
      categoryItems.forEach(catItem => catItem.classList.remove('active'));
      this.classList.add('active');
      
      // 更新声音网格
      initSoundGrid();
    });
  });
  
  // 清空混音按钮
  clearMixBtn.addEventListener('click', clearAllSounds);
  
  // 保存混音按钮
  saveMixBtn.addEventListener('click', saveMix);
  
  // AI发送按钮
  aiSendBtn.addEventListener('click', () => {
    const message = aiInputField.value.trim();
    if (message) {
      handleAiMessage(message);
    }
  });
  
  // AI输入框回车
  aiInputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const message = this.value.trim();
      if (message) {
        handleAiMessage(message);
      }
    }
  });
  
  // AI语音按钮
  aiVoiceBtn.addEventListener('click', function() {
    // 模拟语音识别
    this.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    this.disabled = true;
    
    // 随机从这些短语中选择一个
    const phrases = [
      '播放雨声帮助我入睡',
      '我想听海浪声',
      '添加森林声音',
      '我可以混合哪些声音',
      '我失眠了，有什么建议'
    ];
    
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // 延迟2秒模拟语音识别
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-microphone"></i>';
      this.disabled = false;
      
      aiInputField.value = randomPhrase;
      handleAiMessage(randomPhrase);
    }, 2000);
  });
  
  // 初始化
  initSoundGrid();
  
  // 定时器，模拟进度条更新
  setInterval(() => {
    if (isPlaying && activeSounds.length > 0) {
      // 模拟进度条随机移动
      const currentWidth = parseInt(playerProgressBar.style.width || '0');
      const newWidth = (currentWidth + 0.2) % 100;
      playerProgressBar.style.width = newWidth + '%';
    }
  }, 1000);
}); 