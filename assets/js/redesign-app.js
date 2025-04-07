/**
 * Nature Sleep 2.0 Redesign
 * 核心功能实现
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM元素
  const soundsGrid = document.getElementById('sounds-grid');
  const playerContainer = document.getElementById('player-container');
  const playerThumbnail = document.getElementById('player-thumbnail');
  const playerTitle = document.getElementById('player-title');
  const playerSubtitle = document.getElementById('player-subtitle');
  const playerProgressBar = document.getElementById('player-progress-bar');
  const playerPlayBtn = document.getElementById('player-play-btn');
  const playIcon = document.getElementById('play-icon');
  const playerMixerBtn = document.getElementById('player-mixer-btn');
  const playerCloseBtn = document.getElementById('player-close-btn');
  const mixerContainer = document.getElementById('mixer-container');
  const mixerChannels = document.getElementById('mixer-channels');
  const clearMixBtn = document.getElementById('clear-mix-btn');
  const saveMixBtn = document.getElementById('save-mix-btn');
  const welcomeOverlay = document.getElementById('welcome-overlay');
  const welcomeCloseBtn = document.getElementById('welcome-close');
  const categoryItems = document.querySelectorAll('.category-item');
  const notification = document.getElementById('notification');
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');
  
  // 状态变量
  let isPlaying = false;
  let currentCategory = 'nature';
  let activeSounds = [];
  let masterVolume = 0.7;
  let progressInterval = null;
  let audioContext = null;
  
  // 音频上下文初始化 - 解决浏览器自动播放限制
  function initAudioContext() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // 创建一个静音的音频节点，触发用户交互
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0;  // 静音
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(0.001);
      console.log("音频上下文初始化成功");
    } catch (error) {
      console.error("音频上下文初始化失败:", error);
    }
  }
  
  // 获取声音URL
  function getSoundUrl(soundId) {
    // 使用高质量的CDN音频源
    const soundUrls = {
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
    
    // 如果没有找到URL，返回默认音频
    return soundUrls[soundId] || 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1519592a5.mp3';
  }
  
  // 初始化声音网格
  function initSoundGrid() {
    if (!soundsGrid) return;
    
    soundsGrid.innerHTML = '';
    
    // 获取当前分类的声音
    const sounds = window.soundData?.[currentCategory] || [];
    if (!sounds.length) {
      console.error("没有声音数据或分类:", currentCategory);
      return;
    }
    
    // 创建声音卡片
    sounds.forEach(sound => {
      // 检查声音是否有效
      if (!sound || !sound.id || !sound.title) {
        console.warn("跳过无效声音数据:", sound);
        return;
      }
      
      const soundCard = document.createElement('div');
      soundCard.className = 'sound-card';
      soundCard.dataset.soundId = sound.id;
      
      // 检查是否是活动声音
      if (activeSounds.some(s => s.id === sound.id)) {
        soundCard.classList.add('active');
      }
      
      // 创建卡片内容
      soundCard.innerHTML = `
        <img src="${sound.image}" alt="${sound.title}" class="sound-img">
        <div class="sound-info">
          <div class="sound-title">${sound.title}</div>
          <div class="sound-artist">${sound.artist || 'Nature Sleep'}</div>
        </div>
        <div class="play-indicator">
          <i class="fas ${activeSounds.some(s => s.id === sound.id) ? 'fa-pause' : 'fa-play'}"></i>
        </div>
      `;
      
      // 点击事件
      soundCard.addEventListener('click', () => {
        console.log("点击声音卡片:", sound.id);
        toggleSound(sound);
      });
      
      soundsGrid.appendChild(soundCard);
    });
  }
  
  // 切换声音播放状态
  function toggleSound(sound) {
    if (!sound) return;
    
    // 初始化音频上下文（如果尚未初始化）
    if (!audioContext) {
      initAudioContext();
    }
    
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
        clearInterval(progressInterval);
      } else {
        // 更新播放器为另一个活动声音
        updatePlayerInfo(activeSounds[0]);
        updateMixerChannels();
      }
    } else {
      // 创建音频对象
      const audio = new Audio();
      audio.preload = 'auto';
      
      // 获取声音URL
      const soundUrl = getSoundUrl(sound.id);
      
      // 设置音频参数
      audio.src = soundUrl;
      audio.loop = true;
      audio.volume = masterVolume;
      
      // 音频加载错误处理
      audio.onerror = function(e) {
        console.error("音频加载错误:", e);
        showNotification('加载失败', '音频资源无法加载，请稍后再试', 'error');
      };
      
      // 添加到活动声音列表
      activeSounds.push({
        id: sound.id,
        title: sound.title,
        image: sound.image,
        audio: audio,
        artist: sound.artist || 'Nature Sleep'
      });
      
      // 更新UI
      updateSoundCardState(sound.id, true);
      updatePlayerInfo(sound);
      
      // 显示播放器
      playerContainer.classList.add('active');
      
      // 显示混音器（如果有多个声音）
      if (activeSounds.length > 1) {
        mixerContainer.style.display = 'block';
      }
      
      // 更新混音器
      updateMixerChannels();
      
      // 尝试播放
      try {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            isPlaying = true;
            playIcon.className = 'fas fa-pause';
            
            // 开始更新进度条
            startProgressUpdate();
          }).catch(error => {
            console.warn('播放被浏览器策略阻止，需要用户交互:', error);
            
            // 显示通知引导用户点击
            showNotification('需要您的授权', '点击"开始播放"按钮启动音频', 'info');
            
            // 创建用户交互提示
            createAudioPrompt();
          });
        }
      } catch (error) {
        console.error("播放时出错:", error);
        showNotification('播放失败', '无法播放音频，请稍后再试', 'error');
      }
    }
  }
  
  // 创建音频授权提示
  function createAudioPrompt() {
    // 检查是否已存在提示
    if (document.querySelector('.audio-prompt')) return;
    
    const prompt = document.createElement('div');
    prompt.className = 'audio-prompt';
    prompt.innerHTML = `
      <h3>点击启动音频</h3>
      <p>由于浏览器安全策略，播放音频需要您的授权。<br>点击下方按钮开始播放。</p>
      <button id="start-audio-btn">开始播放</button>
    `;
    
    document.body.appendChild(prompt);
    
    // 添加点击事件
    document.getElementById('start-audio-btn').addEventListener('click', () => {
      // 播放所有活动声音
      playAllSounds()
        .then(() => {
          prompt.remove();
          showNotification('播放成功', '音频已开始播放', 'success');
        })
        .catch(err => {
          console.error("用户交互后仍无法播放:", err);
          showNotification('播放失败', '请刷新页面后再试', 'error');
        });
    });
    
    // 添加文档点击事件（额外的解锁尝试）
    document.addEventListener('click', unlockAudioOnce);
  }
  
  // 一次性点击解锁音频
  function unlockAudioOnce() {
    if (!audioContext) {
      initAudioContext();
    }
    
    playAllSounds()
      .then(() => {
        console.log("通过文档点击解锁音频成功");
        document.removeEventListener('click', unlockAudioOnce);
        
        // 移除提示（如果存在）
        const prompt = document.querySelector('.audio-prompt');
        if (prompt) {
          prompt.remove();
        }
      })
      .catch(err => {
        console.warn("通过文档点击解锁音频失败:", err);
      });
  }
  
  // 播放所有声音
  async function playAllSounds() {
    if (activeSounds.length === 0) {
      return Promise.resolve();
    }
    
    isPlaying = true;
    playIcon.className = 'fas fa-pause';
    
    // 开始更新进度条
    startProgressUpdate();
    
    // 尝试播放所有活动声音
    const playPromises = activeSounds.map(sound => {
      if (sound.audio) {
        const playPromise = sound.audio.play();
        return playPromise || Promise.resolve();
      }
      return Promise.resolve();
    });
    
    return Promise.all(playPromises);
  }
  
  // 暂停所有声音
  function pauseAllSounds() {
    activeSounds.forEach(sound => {
      if (sound.audio) {
        sound.audio.pause();
      }
    });
    
    isPlaying = false;
    playIcon.className = 'fas fa-play';
    
    // 停止更新进度条
    clearInterval(progressInterval);
  }
  
  // 切换播放/暂停
  function togglePlayAll() {
    if (activeSounds.length === 0) return;
    
    if (isPlaying) {
      pauseAllSounds();
    } else {
      playAllSounds()
        .catch(error => {
          console.error('播放失败:', error);
          showNotification('播放失败', '请点击页面并再次尝试', 'error');
          createAudioPrompt();
        });
    }
  }
  
  // 开始更新进度条
  function startProgressUpdate() {
    // 清除现有定时器
    clearInterval(progressInterval);
    
    // 创建新定时器
    progressInterval = setInterval(() => {
      if (activeSounds.length > 0 && activeSounds[0].audio) {
        const audio = activeSounds[0].audio;
        if (!audio.duration || isNaN(audio.duration)) {
          return; // 跳过无效持续时间
        }
        
        const progress = (audio.currentTime % 60) / 60 * 100;
        playerProgressBar.style.width = `${progress}%`;
      }
    }, 100);
  }
  
  // 更新声音卡片状态
  function updateSoundCardState(soundId, isActive) {
    const soundCard = document.querySelector(`.sound-card[data-sound-id="${soundId}"]`);
    if (!soundCard) return;
    
    if (isActive) {
      soundCard.classList.add('active');
      const playIndicator = soundCard.querySelector('.play-indicator i');
      if (playIndicator) {
        playIndicator.className = 'fas fa-pause';
      }
    } else {
      soundCard.classList.remove('active');
      const playIndicator = soundCard.querySelector('.play-indicator i');
      if (playIndicator) {
        playIndicator.className = 'fas fa-play';
      }
    }
  }
  
  // 更新播放器信息
  function updatePlayerInfo(sound) {
    if (!sound) return;
    
    playerThumbnail.src = sound.image || '';
    playerTitle.textContent = sound.title || '未知声音';
    playerSubtitle.textContent = sound.artist || 'Nature Sleep';
  }
  
  // 更新混音器通道
  function updateMixerChannels() {
    if (!mixerChannels) return;
    
    mixerChannels.innerHTML = '';
    
    activeSounds.forEach(sound => {
      const channel = document.createElement('div');
      channel.className = 'mixer-channel';
      
      channel.innerHTML = `
        <div class="channel-info">
          <div>${sound.title || '未知声音'}</div>
          <div class="channel-value" id="channel-value-${sound.id}">${Math.round((sound.audio ? sound.audio.volume : masterVolume) * 100)}%</div>
        </div>
        <div class="channel-controls">
          <input type="range" class="channel-volume" min="0" max="100" value="${sound.audio ? sound.audio.volume * 100 : masterVolume * 100}" data-sound-id="${sound.id}">
          <select class="channel-speed" data-sound-id="${sound.id}">
            <option value="0.5" ${sound.audio && sound.audio.playbackRate === 0.5 ? 'selected' : ''}>0.5x</option>
            <option value="0.75" ${sound.audio && sound.audio.playbackRate === 0.75 ? 'selected' : ''}>0.75x</option>
            <option value="1" ${!sound.audio || sound.audio.playbackRate === 1 ? 'selected' : ''}>1x</option>
            <option value="1.25" ${sound.audio && sound.audio.playbackRate === 1.25 ? 'selected' : ''}>1.25x</option>
            <option value="1.5" ${sound.audio && sound.audio.playbackRate === 1.5 ? 'selected' : ''}>1.5x</option>
          </select>
          <button class="channel-remove" data-sound-id="${sound.id}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      // 添加音量变更事件
      const volumeSlider = channel.querySelector('.channel-volume');
      const volumeValue = channel.querySelector(`#channel-value-${sound.id}`);
      
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
        const sound = window.soundData[currentCategory].find(s => s.id === soundId);
        if (sound) {
          toggleSound(sound);
        }
      });
      
      mixerChannels.appendChild(channel);
    });
  }
  
  // 清空所有声音
  function clearAllSounds() {
    // 复制数组，因为在循环中会修改原数组
    const soundsToRemove = [...activeSounds];
    
    soundsToRemove.forEach(sound => {
      const originalSound = window.soundData[currentCategory].find(s => s.id === sound.id);
      if (originalSound) {
        toggleSound(originalSound);
      }
    });
    
    showNotification('已清空', '所有声音已停止播放');
  }
  
  // 保存混音
  function saveMix() {
    if (activeSounds.length === 0) {
      showNotification('保存失败', '请先添加声音再保存混音', 'error');
      return;
    }
    
    // 创建混音数据
    const mixData = activeSounds.map(sound => ({
      id: sound.id,
      volume: sound.audio ? sound.audio.volume : masterVolume,
      speed: sound.audio ? sound.audio.playbackRate : 1
    }));
    
    // 保存到本地存储
    try {
      const savedMixes = JSON.parse(localStorage.getItem('natureSleepMixes') || '[]');
      const newMix = {
        id: 'mix-' + Date.now(),
        title: '混音 ' + (savedMixes.length + 1),
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
    if (!notification || !notificationTitle || !notificationMessage) return;
    
    const notificationIcon = notification.querySelector('.notification-icon');
    
    if (notificationIcon) {
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
    }
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    notification.classList.add('show');
    
    // 3秒后隐藏通知
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // 绑定事件
  function bindEvents() {
    // 播放/暂停按钮
    if (playerPlayBtn) {
      playerPlayBtn.addEventListener('click', togglePlayAll);
    }
    
    // 混音器切换按钮
    if (playerMixerBtn) {
      playerMixerBtn.addEventListener('click', () => {
        if (mixerContainer.style.display === 'none' || !mixerContainer.style.display) {
          mixerContainer.style.display = 'block';
        } else {
          mixerContainer.style.display = 'none';
        }
      });
    }
    
    // 关闭播放器按钮
    if (playerCloseBtn) {
      playerCloseBtn.addEventListener('click', clearAllSounds);
    }
    
    // 清空混音按钮
    if (clearMixBtn) {
      clearMixBtn.addEventListener('click', clearAllSounds);
    }
    
    // 保存混音按钮
    if (saveMixBtn) {
      saveMixBtn.addEventListener('click', saveMix);
    }
    
    // 欢迎窗口关闭按钮
    if (welcomeCloseBtn) {
      welcomeCloseBtn.addEventListener('click', () => {
        welcomeOverlay.style.display = 'none';
        localStorage.setItem('natureSleepWelcomed', 'true');
        
        // 初始化音频上下文
        initAudioContext();
      });
    }
    
    // 如果用户之前已经看过欢迎信息，不再显示
    if (localStorage.getItem('natureSleepWelcomed') === 'true') {
      welcomeOverlay.style.display = 'none';
    }
    
    // 分类切换
    categoryItems.forEach(item => {
      item.addEventListener('click', () => {
        // 移除之前的活动类
        categoryItems.forEach(cat => cat.classList.remove('active'));
        
        // 添加新的活动类
        item.classList.add('active');
        
        // 更新当前分类并重新加载声音
        const newCategory = item.textContent.trim().toLowerCase();
        
        // 如果分类没有变化，不做任何事
        if (currentCategory === newCategory) {
          return;
        }
        
        // 转换中文分类名为英文
        const categoryMap = {
          '大自然': 'nature',
          '冥想': 'meditation',
          '白噪音': 'whitenoise',
          '音乐': 'music',
          '故事': 'stories'
        };
        
        currentCategory = categoryMap[item.textContent.trim()] || newCategory;
        initSoundGrid();
      });
    });
    
    // 给文档添加点击事件以初始化音频上下文
    document.addEventListener('click', function initOnClick() {
      initAudioContext();
      document.removeEventListener('click', initOnClick);
    }, { once: true });
  }
  
  // 初始化应用
  function initApp() {
    console.log("初始化应用...");
    
    // 检查声音数据是否存在
    if (!window.soundData) {
      console.error("声音数据未找到，使用默认数据");
      window.soundData = {
        nature: [
          {
            id: 'rain',
            title: '雨声',
            image: 'assets/images/sound-rain.jpg',
            artist: 'Nature Sleep'
          },
          {
            id: 'forest',
            title: '森林',
            image: 'assets/images/sound-forest.jpg',
            artist: 'Nature Sleep'
          },
          {
            id: 'ocean',
            title: '海浪',
            image: 'assets/images/sound-ocean.jpg',
            artist: 'Nature Sleep'
          },
          {
            id: 'river',
            title: '河流',
            image: 'assets/images/sound-river.jpg',
            artist: 'Nature Sleep'
          }
        ],
        meditation: [
          {
            id: 'tibetan-bowl',
            title: '藏音碗',
            image: 'assets/images/sound-tibetan-bowl.jpg',
            artist: 'Nature Sleep'
          },
          {
            id: 'om-chanting',
            title: 'OM吟唱',
            image: 'assets/images/sound-om.jpg',
            artist: 'Nature Sleep'
          }
        ],
        whitenoise: [
          {
            id: 'white-noise',
            title: '白噪音',
            image: 'assets/images/sound-white-noise.jpg',
            artist: 'Nature Sleep'
          },
          {
            id: 'pink-noise',
            title: '粉噪音',
            image: 'assets/images/sound-pink-noise.jpg',
            artist: 'Nature Sleep'
          }
        ],
        music: [
          {
            id: 'piano-sleep',
            title: '钢琴曲',
            image: 'assets/images/sound-piano.jpg',
            artist: 'Nature Sleep'
          },
          {
            id: 'ambient-sleep',
            title: '环境音乐',
            image: 'assets/images/sound-ambient.jpg',
            artist: 'Nature Sleep'
          }
        ]
      };
    }
    
    // 初始化声音网格
    initSoundGrid();
    
    // 绑定事件
    bindEvents();
    
    console.log("应用初始化完成");
  }
  
  // 启动应用
  initApp();
  
  // 暴露公共方法 - 允许从HTML直接调用或调试
  window.natureApp = {
    toggleSound,
    togglePlayAll,
    clearAllSounds,
    saveMix,
    showNotification,
    initAudioContext
  };
}); 