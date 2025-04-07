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
    // 使用FreeSound.org和其他开源音频资源
    const soundUrls = {
      'rain': 'https://cdn.freesound.org/previews/346/346642_5121236-lq.mp3',
      'forest': 'https://cdn.freesound.org/previews/617/617730_1648170-lq.mp3',
      'ocean': 'https://cdn.freesound.org/previews/531/531947_77006-lq.mp3',
      'river': 'https://cdn.freesound.org/previews/412/412017_7867797-lq.mp3',
      'tibetan-bowl': 'https://cdn.freesound.org/previews/122/122647_2022494-lq.mp3',
      'om-chanting': 'https://cdn.freesound.org/previews/207/207206_5686-lq.mp3',
      'white-noise': 'https://cdn.freesound.org/previews/205/205966_230132-lq.mp3',
      'pink-noise': 'https://cdn.freesound.org/previews/212/212039_5688-lq.mp3',
      'piano-sleep': 'https://cdn.freesound.org/previews/376/376532_7037-lq.mp3',
      'ambient-sleep': 'https://cdn.freesound.org/previews/397/397311_4921277-lq.mp3'
    };
    
    return soundUrls[soundId] || null;
  }
  
  // 初始化声音列表
  function initSoundGrid() {
    soundGrid.innerHTML = '';
    
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
        <img src="${sound.image}" alt="${sound.title}" class="sound-thumbnail">
        <div class="sound-overlay">
          <div class="sound-title">${sound.title}</div>
          <div class="sound-artist">${sound.artist}</div>
        </div>
        <div class="sound-play-btn">
          <i class="fas ${activeSounds.some(s => s.id === sound.id) ? 'fa-pause' : 'fa-play'}"></i>
        </div>
      `;
      
      // 点击事件
      soundCard.addEventListener('click', () => {
        toggleSound(sound);
      });
      
      soundGrid.appendChild(soundCard);
    });
  }
  
  // 切换声音播放状态
  function toggleSound(sound) {
    // 检查声音是否已经在活动列表中
    const existingIndex = activeSounds.findIndex(s => s.id === sound.id);
    
    if (existingIndex >= 0) {
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
    } else {
      // 添加新声音
      const soundUrl = getSoundUrl(sound.id);
      if (!soundUrl) {
        showNotification('加载失败', '无法找到音频资源', 'error');
        return;
      }
      
      const audio = new Audio(soundUrl);
      audio.loop = true;
      audio.volume = masterVolume;
      
      // 预加载音频
      audio.load();
      
      // 播放准备就绪时的处理函数
      audio.oncanplaythrough = function() {
        startPlayingSound(audio, sound);
        audio.oncanplaythrough = null; // 清除事件处理函数
      };
      
      // 错误处理
      audio.onerror = function() {
        console.error('音频加载失败:', sound.id);
        showNotification('播放失败', '无法加载音频资源，请稍后再试', 'error');
      };
      
      // 设置超时，避免长时间等待
      setTimeout(function() {
        if (audio.readyState < 3) { // HAVE_FUTURE_DATA
          audio.oncanplaythrough = null;
          tryAlternativeSource(sound);
        }
      }, 5000);
    }
  }
  
  // 尝试使用替代音源
  function tryAlternativeSource(sound) {
    // 替代音源URL（可以添加更多备用URL）
    const alternativeSources = {
      'rain': 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
      'forest': 'https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg',
      'ocean': 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
      'river': 'https://actions.google.com/sounds/v1/water/stream_running_in_forest.ogg',
      'white-noise': 'https://actions.google.com/sounds/v1/ambiences/keyboard_typing.ogg',
      'piano-sleep': 'https://actions.google.com/sounds/v1/musical_instruments/piano_music.ogg'
    };
    
    const altUrl = alternativeSources[sound.id];
    if (!altUrl) {
      showNotification('播放失败', '无法找到可用的音频资源', 'error');
      return;
    }
    
    const audio = new Audio(altUrl);
    audio.loop = true;
    audio.volume = masterVolume;
    
    // 预加载
    audio.load();
    
    audio.oncanplaythrough = function() {
      startPlayingSound(audio, sound);
      audio.oncanplaythrough = null;
      showNotification('使用备用音源', '已切换到备用音频源播放', 'info');
    };
    
    audio.onerror = function() {
      showNotification('播放失败', '所有音频资源加载失败，请检查网络连接', 'error');
    };
  }
  
  // 开始播放声音
  function startPlayingSound(audio, sound) {
    // 尝试播放
    audio.play().then(() => {
      // 播放成功
      isPlaying = true;
      playIcon.className = 'fas fa-pause';
      
      // 添加到活动声音列表
      activeSounds.push({
        id: sound.id,
        title: sound.title,
        artist: sound.artist,
        image: sound.image,
        audio: audio
      });
      
      // 更新UI
      updateSoundCardState(sound.id, true);
      updatePlayerInfo(sound);
      playerContainer.classList.add('active');
      
      // 显示混音器（如果有多个声音）
      if (activeSounds.length > 1) {
        mixerContainer.style.display = 'block';
      }
      
      // 更新混音器
      updateMixerChannels();
      
      // 显示通知
      showNotification('声音已添加', `${sound.title} 已添加到您的混音中`);
    }).catch(error => {
      console.error('播放失败:', error);
      
      // 显示错误通知
      showNotification('播放失败', '请点击屏幕以允许音频播放', 'error');
      
      // 添加一次性点击事件以启动播放
      document.body.addEventListener('click', function playOnClick() {
        audio.play().then(() => {
          isPlaying = true;
          playIcon.className = 'fas fa-pause';
          
          // 添加到活动声音列表
          activeSounds.push({
            id: sound.id,
            title: sound.title,
            artist: sound.artist,
            image: sound.image,
            audio: audio
          });
          
          // 更新UI
          updateSoundCardState(sound.id, true);
          updatePlayerInfo(sound);
          playerContainer.classList.add('active');
          
          // 显示混音器（如果有多个声音）
          if (activeSounds.length > 1) {
            mixerContainer.style.display = 'block';
          }
          
          // 更新混音器
          updateMixerChannels();
          
          // 显示通知
          showNotification('声音已添加', `${sound.title} 已添加到您的混音中`);
        }).catch(e => {
          console.error('用户交互后仍播放失败:', e);
          showNotification('播放失败', '尝试使用其他浏览器或设备', 'error');
        });
        
        document.body.removeEventListener('click', playOnClick);
      }, { once: true });
    });
  }
  
  // 更新声音卡片状态
  function updateSoundCardState(soundId, isActive) {
    const soundCard = document.querySelector(`.sound-card[data-sound-id="${soundId}"]`);
    if (soundCard) {
      if (isActive) {
        soundCard.classList.add('active');
        soundCard.querySelector('.sound-play-btn i').className = 'fas fa-pause';
      } else {
        soundCard.classList.remove('active');
        soundCard.querySelector('.sound-play-btn i').className = 'fas fa-play';
      }
    }
  }
  
  // 更新播放器信息
  function updatePlayerInfo(sound) {
    playerThumbnail.src = sound.image;
    playerTitle.textContent = sound.title;
    playerSubtitle.textContent = sound.artist;
  }
  
  // 更新混音器通道
  function updateMixerChannels() {
    mixerChannels.innerHTML = '';
    
    activeSounds.forEach(sound => {
      const channel = document.createElement('div');
      channel.className = 'mixer-channel';
      
      channel.innerHTML = `
        <div class="channel-info">${sound.title}</div>
        <input type="range" class="channel-volume" min="0" max="100" value="${sound.audio ? sound.audio.volume * 100 : masterVolume * 100}" data-sound-id="${sound.id}">
        <div class="channel-value">${Math.round((sound.audio ? sound.audio.volume : masterVolume) * 100)}%</div>
        <button class="channel-remove" data-sound-id="${sound.id}"><i class="fas fa-times"></i></button>
      `;
      
      // 音量调节事件
      const volumeSlider = channel.querySelector('.channel-volume');
      volumeSlider.addEventListener('input', function() {
        const value = parseInt(this.value) / 100;
        const soundId = this.dataset.soundId;
        const sound = activeSounds.find(s => s.id === soundId);
        
        if (sound && sound.audio) {
          sound.audio.volume = value;
          channel.querySelector('.channel-value').textContent = Math.round(value * 100) + '%';
        }
      });
      
      // 移除按钮事件
      const removeBtn = channel.querySelector('.channel-remove');
      removeBtn.addEventListener('click', function() {
        const soundId = this.dataset.soundId;
        const sound = activeSounds.find(s => s.id === soundId);
        
        if (sound) {
          const index = activeSounds.indexOf(sound);
          if (index >= 0) {
            activeSounds.splice(index, 1);
            
            if (sound.audio) {
              sound.audio.pause();
            }
            
            updateSoundCardState(soundId, false);
            updateMixerChannels();
            
            // 如果没有活动声音，隐藏播放器和混音器
            if (activeSounds.length === 0) {
              playerContainer.classList.remove('active');
              mixerContainer.style.display = 'none';
              isPlaying = false;
            } else if (activeSounds.length === 1) {
              // 如果只剩一个声音，隐藏混音器
              mixerContainer.style.display = 'none';
              updatePlayerInfo(activeSounds[0]);
            } else {
              updatePlayerInfo(activeSounds[0]);
            }
          }
        }
      });
      
      mixerChannels.appendChild(channel);
    });
  }
  
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