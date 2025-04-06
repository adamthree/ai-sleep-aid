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

  // 播放声音功能 - 使用稳定的音频源
  function playSound(sound) {
    console.log("播放声音:", sound.title);
    
    // 停止所有当前音轨
    stopAllSounds();
    
    try {
      // 立即显示播放界面和通知
      updatePlayerUI(sound);
      showNotification('开始播放', `${sound.title} 正在加载...`);
      
      // 使用稳定且免费的音频API
      const audioSources = {
        rain: 'https://orangefreesounds.com/wp-content/uploads/2021/07/Rain-sounds-looped.mp3',
        ocean: 'https://soundbible.com/mp3/Ocean_Waves-Mike_Koenig-980635527.mp3',
        forest: 'https://soundbible.com/mp3/forest_ambience-6941.mp3',
        fire: 'https://soundbible.com/mp3/fire_crackling-Mike_Koenig-1921201712.mp3',
        birds: 'https://soundbible.com/mp3/birds-singing-01.mp3',
        wind: 'https://soundbible.com/mp3/wind-1-juan_merie_venter-978564486.mp3',
        thunder: 'https://soundbible.com/mp3/Thunder-Mike_Koenig-1661717865.mp3',
        whitenoise: 'https://soundbible.com/mp3/Elevator_Ding-KevanGC-1377446482.mp3',
        meditation: 'https://orangefreesounds.com/wp-content/uploads/2016/12/Meditation-music-no-bells-1-hour.mp3',
        piano: 'https://orangefreesounds.com/wp-content/uploads/2020/09/Peaceful-relaxing-piano-music.mp3',
        default: 'https://orangefreesounds.com/wp-content/uploads/2021/07/Rain-sounds-looped.mp3'
      };
      
      // 本地备用音频 - 当在线音频加载失败时使用
      const localAudioSources = {
        rain: 'assets/sounds/rain.mp3',
        ocean: 'assets/sounds/ocean.mp3',
        forest: 'assets/sounds/forest.mp3',
        fire: 'assets/sounds/fire.mp3',
        birds: 'assets/sounds/birds.mp3',
        wind: 'assets/sounds/wind.mp3',
        thunder: 'assets/sounds/thunder.mp3',
        whitenoise: 'assets/sounds/whitenoise.mp3',
        meditation: 'assets/sounds/meditation.mp3',
        piano: 'assets/sounds/piano.mp3',
        default: 'assets/sounds/rain.mp3'
      };
      
      // 根据声音ID或名称选择适合的音频源
      let audioSrc = audioSources.default;
      let localFallbackSrc = localAudioSources.default;
      const soundId = (sound.id || '').toLowerCase();
      const soundTitle = (sound.title || '').toLowerCase();
      
      // 检查特定类型
      if (soundId.includes('rain') || soundTitle.includes('雨')) {
        audioSrc = audioSources.rain;
        localFallbackSrc = localAudioSources.rain;
      } else if (soundId.includes('ocean') || soundId.includes('sea') || soundTitle.includes('海')) {
        audioSrc = audioSources.ocean;
        localFallbackSrc = localAudioSources.ocean;
      } else if (soundId.includes('forest') || soundTitle.includes('森林')) {
        audioSrc = audioSources.forest;
        localFallbackSrc = localAudioSources.forest;
      } else if (soundId.includes('fire') || soundTitle.includes('火') || soundTitle.includes('篝火')) {
        audioSrc = audioSources.fire;
        localFallbackSrc = localAudioSources.fire;
      } else if (soundId.includes('bird') || soundTitle.includes('鸟')) {
        audioSrc = audioSources.birds;
        localFallbackSrc = localAudioSources.birds;
      } else if (soundId.includes('meditation') || soundTitle.includes('冥想')) {
        audioSrc = audioSources.meditation;
        localFallbackSrc = localAudioSources.meditation;
      } else if (soundId.includes('wind') || soundTitle.includes('风')) {
        audioSrc = audioSources.wind;
        localFallbackSrc = localAudioSources.wind;
      } else if (soundId.includes('piano') || soundTitle.includes('钢琴')) {
        audioSrc = audioSources.piano;
        localFallbackSrc = localAudioSources.piano;
      } else if (soundId.includes('thunder') || soundTitle.includes('雷')) {
        audioSrc = audioSources.thunder;
        localFallbackSrc = localAudioSources.thunder;
      } else if (soundId.includes('white') || soundTitle.includes('白噪')) {
        audioSrc = audioSources.whitenoise;
        localFallbackSrc = localAudioSources.whitenoise;
      }
      
      console.log("尝试使用音频源:", audioSrc);
      
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
          showNotification('需要交互', '请点击播放按钮启动播放');
          
          // 添加一次性点击事件到播放按钮
          const playerPlayBtn = document.querySelector('.player-play');
          if (playerPlayBtn) {
            const startPlayOnce = function() {
              audio.play().catch(e => console.error("播放失败:", e));
              playerPlayBtn.removeEventListener('click', startPlayOnce);
            };
            playerPlayBtn.addEventListener('click', startPlayOnce);
          }
        });
      };
      
      // 错误处理 - 尝试使用本地备用音频
      audio.onerror = function(e) {
        console.error("在线音频加载错误, 尝试本地备用:", e);
        showNotification('正在切换音源', '在线音频加载失败，尝试使用本地音频...');
        
        // 尝试使用本地备用音频
        audio.src = localFallbackSrc;
        audio.load();
        
        // 为本地备用音频添加错误处理
        audio.onerror = function(e2) {
          console.error("本地音频也加载失败:", e2);
          showNotification('加载错误', '无法加载音频，请尝试其他音频或刷新页面');
          
          // 尝试创建一个简单的音调作为最后手段
          try {
            console.log("尝试生成基本音调作为替代");
            createBasicTone();
          } catch (toneError) {
            console.error("无法创建基本音调:", toneError);
          }
        };
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

  // 创建基本音调作为最后手段
  function createBasicTone() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
      // 创建音频上下文
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioCtx();
      
      // 创建振荡器
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine'; // 正弦波
      oscillator.frequency.setValueAtTime(432, audioContext.currentTime); // 设置频率
      
      // 创建增益节点用于控制音量
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // 设置音量较低
      
      // 连接节点
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 开始播放
      oscillator.start();
      
      // 存储到活动音轨列表
      const basicToneTrack = {
        sound: { title: "基本音调", artist: "系统生成" },
        oscillator: oscillator,
        audioContext: audioContext,
        gainNode: gainNode,
        volume: 0.1,
        // 模拟音频对象的方法
        audio: {
          paused: false,
          pause: function() {
            try {
              oscillator.stop();
              this.paused = true;
            } catch (e) {
              console.error("停止音调失败:", e);
            }
          }
        }
      };
      
      activeSoundTracks.push(basicToneTrack);
      isPlaying = true;
      
      // 更新播放按钮
      const playBtn = document.querySelector('.player-play i');
      if (playBtn) playBtn.className = 'fas fa-pause';
      
      showNotification('基本音调', '使用基本音调作为替代，您可以尝试其他声音');
    } else {
      throw new Error("浏览器不支持AudioContext");
    }
  }

  // 更新进度条函数
  function updateProgress(audio) {
    if (!audio) return;
    
    // 清除之前的计时器
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
    }
    
    // 创建新的计时器
    window.progressInterval = setInterval(() => {
      if (isPlaying && audio.duration) {
        try {
          const progress = (audio.currentTime / audio.duration) * 100;
          const progressBar = document.querySelector('.player-progress-current');
          if (progressBar) {
            progressBar.style.width = progress + '%';
          }
        } catch (error) {
          console.log('更新进度条失败:', error);
        }
      }
    }, 1000);
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