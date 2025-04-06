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

  // 根据分类渲染声音列表
  function renderSoundsByCategory(category) {
    if (!soundList) return;
    
    soundList.innerHTML = '';
    
    // 获取对应分类的声音
    const sounds = soundData[category] || [];
    
    sounds.forEach(sound => {
      // 确保声音有有效的ID
      sound.id = sound.id || `sound-${category}-${Math.random().toString(36).substring(2, 9)}`;
      
      // 设定分类
      sound.category = category;
      
      // 创建声音项UI
      const soundItem = document.createElement('div');
      soundItem.className = 'sound-item';
      soundItem.setAttribute('data-sound-id', sound.id);
      
      // 确保图片路径正确
      const imagePath = sound.image || `assets/images/sounds/${category}.svg`;
      
      soundItem.innerHTML = `
        <img src="${imagePath}" alt="${sound.title}" class="sound-item-image">
        <div class="sound-item-overlay">
          <div class="sound-item-title">${sound.title}</div>
          <div class="sound-item-artist">${sound.artist || getCategoryDisplayName(category)}</div>
        </div>
        <div class="sound-item-play">
          <i class="fas fa-play"></i>
        </div>
      `;
      
      // 添加点击播放事件
      soundItem.addEventListener('click', function() {
        playSound(sound);
      });
      
      soundList.appendChild(soundItem);
    });
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

  // 播放声音功能 - 使用真正的大自然声音
  function playSound(sound) {
    console.log("播放声音:", sound.title);
    
    // 停止所有当前音轨
    stopAllSounds();
    
    try {
      // 立即显示播放界面和通知
      updatePlayerUI(sound);
      showNotification('开始播放', `${sound.title} 正在加载...`);
      
      // 优先使用自然音效API
      const audioSources = {
        rain: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3', 
        ocean: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3', 
        forest: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3', 
        fire: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3',
        birds: 'https://assets.mixkit.co/sfx/preview/mixkit-morning-birds-singing-2457.mp3', 
        wind: 'https://assets.mixkit.co/sfx/preview/mixkit-strong-wind-2124.mp3',
        thunder: 'https://assets.mixkit.co/sfx/preview/mixkit-distant-thunder-rumble-1288.mp3', 
        whitenoise: 'https://assets.mixkit.co/sfx/preview/mixkit-hotel-lobby-conversation-loop-0.mp3',
        meditation: 'https://assets.mixkit.co/sfx/preview/mixkit-peaceful-morning-birds-singing-2431.mp3',
        piano: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-3.mp3', 
        default: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3'
      };
      
      // 根据声音ID或名称选择适合的音频源
      let audioSrc = audioSources.default;
      const soundId = (sound.id || '').toLowerCase();
      const soundTitle = (sound.title || '').toLowerCase();
      
      // 检查特定类型
      if (soundId.includes('rain') || soundTitle.includes('雨')) {
        audioSrc = audioSources.rain;
      } else if (soundId.includes('ocean') || soundId.includes('sea') || soundTitle.includes('海')) {
        audioSrc = audioSources.ocean;
      } else if (soundId.includes('forest') || soundTitle.includes('森林')) {
        audioSrc = audioSources.forest;
      } else if (soundId.includes('fire') || soundTitle.includes('火') || soundTitle.includes('篝火')) {
        audioSrc = audioSources.fire;
      } else if (soundId.includes('bird') || soundTitle.includes('鸟')) {
        audioSrc = audioSources.birds;
      } else if (soundId.includes('meditation') || soundTitle.includes('冥想')) {
        audioSrc = audioSources.meditation;
      } else if (soundId.includes('wind') || soundTitle.includes('风')) {
        audioSrc = audioSources.wind;
      } else if (soundId.includes('piano') || soundTitle.includes('钢琴')) {
        audioSrc = audioSources.piano;
      } else if (soundId.includes('thunder') || soundTitle.includes('雷')) {
        audioSrc = audioSources.thunder;
      } else if (soundId.includes('white') || soundTitle.includes('白噪')) {
        audioSrc = audioSources.whitenoise;
      }
      
      console.log("使用音频源:", audioSrc);
      
      // 创建新的Audio元素
      const audio = new Audio();
      
      // 添加事件处理
      audio.oncanplaythrough = function() {
        console.log("音频加载完成，开始播放");
        
        // 开始播放
        audio.play().then(() => {
          console.log("音频播放成功");
          showNotification('播放中', `${sound.title} 正在播放`);
          
          // 更新播放按钮
          const playBtn = document.querySelector('.player-play i');
          if (playBtn) playBtn.className = 'fas fa-pause';
          
          // 更新播放状态
          isPlaying = true;
        }).catch(err => {
          console.error("自动播放失败:", err);
          showNotification('需要交互', '请点击页面任意位置允许播放');
          
          // 添加一次性点击事件
          const startPlayOnce = function() {
            audio.play().catch(e => console.error("播放失败:", e));
            document.body.removeEventListener('click', startPlayOnce);
          };
          document.body.addEventListener('click', startPlayOnce);
        });
      };
      
      // 错误处理
      audio.onerror = function(e) {
        console.error("音频加载错误:", e);
        showNotification('加载错误', '无法加载音频，请尝试其他音频');
      };
      
      // 设置音频属性
      audio.src = audioSrc;
      audio.loop = true;
      audio.volume = 0.7;
      audio.preload = "auto";
      
      // 开始加载
      audio.load();
      
      // 存储到活动音轨列表
      activeSoundTracks.push({
        sound: sound,
        audio: audio,
        volume: 0.7
      });
      
      // 显示播放器
      if (audioPlayer) {
        audioPlayer.style.display = 'flex';
        audioPlayer.classList.add('active');
      }
      
      // 定期更新进度条
      updateProgress(audio);
      
    } catch (e) {
      console.error("音频播放错误:", e);
      showNotification('播放错误', '无法播放音频，请刷新页面重试');
    }
  }

  // 更新播放器UI
  function updatePlayerUI(sound) {
    if (!audioPlayer) return;
    
    const playerTitle = audioPlayer.querySelector('.player-title');
    const playerArtist = audioPlayer.querySelector('.player-artist');
    
    // 更新播放器UI
    if (playerTitle) playerTitle.textContent = sound.title || '未知声音';
    
    // 修复: 使用更通用的标签来代替重复的标签
    const artistName = sound.artist || getCategoryDisplayName(sound.category || 'nature');
    if (playerArtist) playerArtist.textContent = artistName;
    
    // 更新图片
    if (playerImage) {
      if (sound.image) {
        playerImage.src = sound.image;
      } else {
        // 根据声音分类选择默认图像
        const category = sound.category || 'nature';
        playerImage.src = `assets/images/sounds/${category}.svg`;
      }
    }
    
    // 显示播放器
    audioPlayer.classList.add('active');
    audioPlayer.style.display = 'flex';
  }

  // 停止所有声音
  function stopAllSounds() {
    // 停止所有音轨
    activeSoundTracks.forEach(track => {
      if (track.audio) {
        track.audio.pause();
        if (typeof track.audio.currentTime !== 'undefined') {
          track.audio.currentTime = 0;
        }
      }
    });
    
    // 清空音轨列表
    activeSoundTracks.length = 0;
    
    // 重置播放状态
    isPlaying = false;
    const playBtn = document.querySelector('.player-play i');
    if (playBtn) playBtn.className = 'fas fa-play';
    
    // 隐藏播放器
    if (audioPlayer) {
      audioPlayer.classList.remove('active');
    }
  }

  // 添加播放器关闭按钮事件
  if (playerClose) {
    playerClose.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      stopAllSounds();
      audioPlayer.style.display = 'none';
    });
  }

  // 添加播放器点击事件
  if (audioPlayer) {
    audioPlayer.addEventListener('click', function(e) {
      // 阻止点击关闭按钮时触发
      if (e.target.closest('.player-close') || e.target.closest('.player-btn')) {
        return;
      }
      
      // 播放/暂停当前音轨
      if (activeSoundTracks.length > 0 && activeSoundTracks[0].audio) {
        const audio = activeSoundTracks[0].audio;
        const playBtn = document.querySelector('.player-play i');
        
        if (audio.paused) {
          audio.play();
          isPlaying = true;
          if (playBtn) playBtn.className = 'fas fa-pause';
        } else {
          audio.pause();
          isPlaying = false;
          if (playBtn) playBtn.className = 'fas fa-play';
        }
      }
    });
  }

  // 播放按钮点击事件
  const playBtn = document.querySelector('.player-play');
  if (playBtn) {
    playBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      
      if (activeSoundTracks.length > 0 && activeSoundTracks[0].audio) {
        const audio = activeSoundTracks[0].audio;
        const icon = this.querySelector('i');
        
        if (audio.paused) {
          audio.play();
          isPlaying = true;
          if (icon) icon.className = 'fas fa-pause';
        } else {
          audio.pause();
          isPlaying = false;
          if (icon) icon.className = 'fas fa-play';
        }
      }
    });
  }

  // 显示通知
  function showNotification(title, message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    notification.innerHTML = `
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 淡入动画
    setTimeout(() => {
      notification.classList.add('active');
    }, 10);
    
    // 自动移除
    setTimeout(() => {
      notification.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // 分类点击事件
  soundCategories.forEach(categoryItem => {
    categoryItem.addEventListener('click', function() {
      // 更新分类样式
      soundCategories.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // 获取分类值
      currentCategory = this.getAttribute('data-category');
      
      // 渲染对应分类的声音列表
      renderSoundsByCategory(currentCategory);
    });
  });

  // 在DOMContentLoaded时自动播放第一个声音
  setTimeout(() => {
    if (soundData && soundData.nature && soundData.nature.length > 0) {
      console.log("自动播放第一个声音");
      playSound(soundData.nature[0]);
      
      // 显示播放提示
      showNotification('自动播放', '正在播放自然声音，为您创造宁静环境');
    }
  }, 1000);

  // 初始渲染声音列表
  renderSoundsByCategory(currentCategory);
  
  // 添加标签切换功能
  tabItems.forEach(item => {
    item.addEventListener('click', function() {
      // 更新标签样式
      tabItems.forEach(tab => tab.classList.remove('active'));
      this.classList.add('active');
      
      // 获取对应内容ID
      const tabId = this.getAttribute('data-tab');
      
      // 显示对应内容
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    });
  });

  // 初始化页面其他功能
  // ... existing code ...
}); 