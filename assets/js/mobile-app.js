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
    console.log("播放声音:", sound.title);
    
    // 停止所有当前音轨
    stopAllSounds();
    
    try {
      // 立即显示播放界面和通知
      updatePlayerUI(sound);
      showNotification('开始播放', `${sound.title} 正在加载...`);
      
      // 使用第二套备用音频源 - 使用公共域名直链音频
      const audioSources = {
        rain: 'https://audio.jukehost.co.uk/iuKb7XwhqyMyEMVL03tF1nt8fvaMKEPB', // 雨声
        ocean: 'https://audio.jukehost.co.uk/YG7LELvBEvQgWJINvfnvUWUurGy27jPm', // 海浪声
        forest: 'https://audio.jukehost.co.uk/IzGC1EInEmktYZCw82VxJHoqxZXhYIoK', // 森林声
        fire: 'https://audio.jukehost.co.uk/TpfCPWl2JWcJOmtKVKXIH6DnDI31FLUw', // 篝火
        birds: 'https://audio.jukehost.co.uk/m5wELbRFwCTYUTXsntEZzm9M5i6WOaKs', // 鸟鸣
        wind: 'https://audio.jukehost.co.uk/1f4fyvdG4f9tnDkAGIeGl7vaBYJ18tqJ', // 风声
        thunder: 'https://audio.jukehost.co.uk/Cs4Hfl03bYY93eM6gKMDQvqG7QZsBCmt', // 雷声
        whitenoise: 'https://audio.jukehost.co.uk/pfj0B2owdkDx85qULJZ9ta9KP0Y6SqeM', // 白噪音
        meditation: 'https://audio.jukehost.co.uk/WDmuXQBj1dLcqP6vRkiZIBQRd24bWb7s', // 冥想
        piano: 'https://audio.jukehost.co.uk/vKKhBVMrlGIYY9tFRWMEZW4QYecJM9r2', // 钢琴
        default: 'https://audio.jukehost.co.uk/n4sHDDcm28zZrLGOlrRFu669P6PyrFai' // 默认
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
      
      // 强制直接使用HTML5音频元素并添加到页面
      let audioElement = document.createElement('audio');
      audioElement.src = audioSrc;
      audioElement.autoplay = true;
      audioElement.loop = true;
      audioElement.volume = 0.7;
      document.body.appendChild(audioElement);
      
      // 开始播放
      let playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("成功播放音频");
          showNotification('播放中', `${sound.title} 正在播放中`);
          
          // 存储到活动音轨列表
          activeSoundTracks.push({
            sound: sound,
            audio: audioElement,
            volume: 0.7
          });
          
          // 显示播放器
          const audioPlayer = document.getElementById('audio-player');
          if (audioPlayer) {
            audioPlayer.style.display = 'flex';
          }
          
        }).catch(err => {
          console.error("自动播放失败:", err);
          showNotification('需要交互', '请点击页面任意位置允许播放');
          
          // 添加一次性点击事件
          const startPlayOnce = function() {
            audioElement.play().catch(e => console.error("播放失败:", e));
            document.body.removeEventListener('click', startPlayOnce);
          };
          document.body.addEventListener('click', startPlayOnce);
        });
      }
      
    } catch (e) {
      console.error("音频播放错误:", e);
      showNotification('播放错误', '无法播放音频，请刷新页面重试');
    }
  }
  
  // 模拟进度条更新
  function updateProgressSimulated() {
    let currentTime = 0;
    const duration = 300; // 模拟5分钟音频
    
    // 清除之前的计时器
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
    }
    
    // 创建新的计时器来模拟进度
    window.progressInterval = setInterval(() => {
      if (isPlaying) {
        currentTime += 1;
        if (currentTime > duration) {
          currentTime = 0;
        }
        
        try {
          const progress = (currentTime / duration) * 100;
          const progressBar = document.querySelector('.player-progress-current');
          if (progressBar) {
            progressBar.style.width = progress + '%';
          }
        } catch (error) {
          console.log('更新进度条失败:', error);
        }
      }
    }, 1000);
    
    // 添加通知
    showNotification('音频播放中', '当前使用模拟播放模式');
  }
  
  // 显示通知
  function showNotification(title, message) {
    // 检查是否已存在通知元素
    let notification = document.querySelector('.audio-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'audio-notification';
      
      // 添加样式
      notification.style.position = 'fixed';
      notification.style.bottom = '80px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.background = 'rgba(20, 21, 46, 0.9)';
      notification.style.color = 'white';
      notification.style.padding = '10px 15px';
      notification.style.borderRadius = '8px';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      notification.style.zIndex = '1000';
      notification.style.maxWidth = '80%';
      notification.style.textAlign = 'center';
      notification.style.transition = 'opacity 0.3s ease';
      
      document.body.appendChild(notification);
    }
    
    // 设置内容
    notification.innerHTML = `
      <div style="font-weight:bold;margin-bottom:5px;">${title}</div>
      <div style="font-size:12px;opacity:0.8;">${message}</div>
    `;
    
    // 显示通知
    notification.style.opacity = '1';
    
    // 3秒后淡出
    setTimeout(() => {
      notification.style.opacity = '0';
      
      // 完全隐藏
      setTimeout(() => {
        notification.style.display = 'none';
      }, 300);
    }, 3000);
  }
  
  // 更新进度条
  function updateProgress(audio) {
    if (!audio || !audio.duration) {
      updateProgressSimulated();
      return;
    }
    
    // 清除之前的计时器
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
    }
    
    // 创建新的计时器
    window.progressInterval = setInterval(() => {
      if (isPlaying && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        document.querySelector('.player-progress-current').style.width = progress + '%';
      }
    }, 1000);
  }
  
  // 播放/暂停切换
  document.querySelector('.player-play').addEventListener('click', function() {
    if (activeSoundTracks.length === 0) return;
    
    if (isPlaying) {
      // 暂停所有音轨
      activeSoundTracks.forEach(track => {
        if (track.audio) {
          track.audio.pause();
        }
      });
      this.querySelector('i').className = 'fas fa-play';
    } else {
      // 播放所有音轨
      activeSoundTracks.forEach(track => {
        if (track.audio) {
          track.audio.play();
        }
      });
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
    
    // 显示加载状态
    showAiTypingIndicator();
    
    // 分析用户消息并执行相应操作
    processUserVoiceCommand(message);
  }
  
  // 显示AI正在输入的指示器
  function showAiTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message message-ai typing';
    typingIndicator.innerHTML = `
      <div class="message-content">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    aiChatMessages.appendChild(typingIndicator);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    
    return typingIndicator;
  }
  
  // 隐藏AI输入指示器
  function hideAiTypingIndicator() {
    const typingIndicator = aiChatMessages.querySelector('.typing');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  // 处理用户语音指令
  function processUserVoiceCommand(message) {
    // 转换为小写进行分析
    const lowerMessage = message.toLowerCase();
    
    // 创建AI回复
    let aiResponse = '';
    let responseDelay = 1000; // 默认延迟
    
    // 检查是否是场景请求
    if (lowerMessage.includes('热带雨林') || lowerMessage.includes('森林') || lowerMessage.includes('丛林')) {
      // 播放森林相关的音频
      const forestSound = findSoundByKeyword('forest');
      if (forestSound) {
        playSound(forestSound);
        aiResponse = `已为您播放"${forestSound.title}"，欢迎来到热带雨林。您可以继续要求添加其他声音，如昆虫声、鸟鸣等。`;
      } else {
        aiResponse = '抱歉，我没有找到热带雨林的音频。您可以尝试其他场景，如"海洋"、"雨声"等。';
      }
    } 
    else if (lowerMessage.includes('海洋') || lowerMessage.includes('海边') || lowerMessage.includes('海浪')) {
      // 播放海洋相关的音频
      const oceanSound = findSoundByKeyword('ocean');
      if (oceanSound) {
        playSound(oceanSound);
        aiResponse = `已为您播放"${oceanSound.title}"，感受海浪声环绕。您可以继续要求添加其他声音。`;
      } else {
        aiResponse = '抱歉，我没有找到海洋的音频。您可以尝试其他场景，如"森林"、"雨声"等。';
      }
    }
    else if (lowerMessage.includes('雨') || lowerMessage.includes('雨声') || lowerMessage.includes('下雨')) {
      // 播放雨声相关的音频
      const rainSound = findSoundByKeyword('rain');
      if (rainSound) {
        playSound(rainSound);
        aiResponse = `已为您播放"${rainSound.title}"，聆听雨滴的声音。您可以继续要求添加其他声音。`;
      } else {
        aiResponse = '抱歉，我没有找到雨声的音频。您可以尝试其他场景，如"森林"、"海洋"等。';
      }
    }
    // 检查是否是要添加额外音轨
    else if (lowerMessage.includes('添加') || lowerMessage.includes('加入') || lowerMessage.includes('来点')) {
      // 解析用户想要添加的声音
      let soundKeyword = '';
      
      if (lowerMessage.includes('昆虫') || lowerMessage.includes('虫鸣')) {
        soundKeyword = 'insect';
      } else if (lowerMessage.includes('鸟') || lowerMessage.includes('鸟鸣')) {
        soundKeyword = 'bird';
      } else if (lowerMessage.includes('篝火') || lowerMessage.includes('火堆') || lowerMessage.includes('火炉')) {
        soundKeyword = 'fire';
      } else if (lowerMessage.includes('风')) {
        soundKeyword = 'wind';
      } else if (lowerMessage.includes('钢琴') || lowerMessage.includes('音乐')) {
        soundKeyword = 'piano';
      }
      
      if (soundKeyword) {
        // 尝试添加音轨
        const additionalSound = findSoundByKeyword(soundKeyword);
        if (additionalSound) {
          addSoundTrack(additionalSound);
          aiResponse = `已为您添加"${additionalSound.title}"音轨。您还需要其他声音吗？`;
        } else {
          aiResponse = `抱歉，我没有找到与"${soundKeyword}"相关的音频。您可以尝试其他声音，如"雨声"、"风声"等。`;
        }
      } else {
        aiResponse = '请告诉我您想添加什么声音，例如"添加鸟鸣声"、"来点篝火声"等。';
      }
    }
    // 混合多声音指令
    else if (lowerMessage.includes('混合') || lowerMessage.includes('混音') || lowerMessage.includes('组合')) {
      responseDelay = 2000; // 稍长的延迟
      aiResponse = '正在为您创建声音组合...';
      
      // 分析请求中的声音关键词
      const keywords = [];
      const possibleSounds = ['雨', '雨声', '海', '海浪', '海洋', '森林', '鸟', '鸟鸣', '风', '风声', '篝火', '火堆'];
      
      possibleSounds.forEach(sound => {
        if (lowerMessage.includes(sound)) {
          keywords.push(sound);
        }
      });
      
      // 如果找到关键词，创建混合
      if (keywords.length > 0) {
        stopAllSounds();
        
        setTimeout(() => {
          let mainSoundAdded = false;
          keywords.forEach((keyword, index) => {
            let soundKeyword = '';
            
            if (keyword.includes('雨')) soundKeyword = 'rain';
            else if (keyword.includes('海')) soundKeyword = 'ocean';
            else if (keyword.includes('森林')) soundKeyword = 'forest';
            else if (keyword.includes('鸟')) soundKeyword = 'bird';
            else if (keyword.includes('风')) soundKeyword = 'wind';
            else if (keyword.includes('火')) soundKeyword = 'fire';
            
            const sound = findSoundByKeyword(soundKeyword);
            if (sound) {
              if (!mainSoundAdded) {
                playSound(sound);
                mainSoundAdded = true;
              } else {
                setTimeout(() => {
                  addSoundTrack(sound);
                }, 500 * index);
              }
            }
          });
          
          // 更新AI回复
          hideAiTypingIndicator();
          addChatMessage('已为您创建声音组合，正在播放中。您可以说"AI优化混音"来优化音量平衡。', 'ai');
        }, 2000);
      } else {
        aiResponse = '请告诉我您想混合哪些声音，例如"混合雨声和鸟鸣"或"组合海浪和风声"。';
      }
    }
    // AI优化音轨指令
    else if (lowerMessage.includes('优化') || lowerMessage.includes('平衡') || (lowerMessage.includes('ai') && lowerMessage.includes('混音'))) {
      if (activeSoundTracks.length < 2) {
        aiResponse = '需要至少两个声音才能优化混音。请先添加多个声音。';
      } else {
        responseDelay = 2000;
        aiResponse = '正在使用AI优化您的混音...';
        
        setTimeout(() => {
          optimizeMixWithAI();
          hideAiTypingIndicator();
          addChatMessage('已完成混音优化。各个声音轨道的音量已经过AI平衡处理，为您提供最佳的听觉体验。', 'ai');
        }, 2000);
      }
    }
    // 调整音量
    else if (lowerMessage.includes('音量') || lowerMessage.includes('声音') || lowerMessage.includes('大声') || lowerMessage.includes('小声')) {
      if (lowerMessage.includes('大') || lowerMessage.includes('增大') || lowerMessage.includes('提高')) {
        increaseVolume();
        aiResponse = '已为您增大音量。';
      } else if (lowerMessage.includes('小') || lowerMessage.includes('减小') || lowerMessage.includes('降低')) {
        decreaseVolume();
        aiResponse = '已为您减小音量。';
      } else {
        aiResponse = '请告诉我您想如何调整音量，例如"音量大一点"或"音量小一点"。';
      }
    }
    // 停止播放
    else if (lowerMessage.includes('停止') || lowerMessage.includes('暂停') || lowerMessage.includes('关闭音乐')) {
      stopAllSounds();
      aiResponse = '已为您停止所有声音播放。';
    }
    // 睡眠提示和建议
    else if (lowerMessage.includes('失眠') || lowerMessage.includes('睡不着') || lowerMessage.includes('睡眠问题')) {
      responseDelay = 1500;
      aiResponse = '对于失眠问题，我建议：\n1. 尝试规律的睡眠时间表\n2. 睡前30分钟避免电子设备\n3. 创建舒适的睡眠环境\n4. 使用我们的"深度睡眠"声音组合\n\n需要我为您播放深度睡眠组合吗？';
    }
    // 模拟播放模式提示
    else if (lowerMessage.includes('无法播放') || lowerMessage.includes('播放失败') || lowerMessage.includes('没有声音')) {
      aiResponse = '当前使用模拟播放模式，由于浏览器安全限制，需要用户主动点击才能播放声音。请尝试点击任意声音图标启动播放，或者确保您的设备没有静音。';
    }
    // 默认回复
    else {
      aiResponse = getAiResponse(message);
    }
    
    // 添加AI回复
    setTimeout(() => {
      hideAiTypingIndicator();
      addChatMessage(aiResponse, 'ai');
    }, responseDelay);
  }
  
  // 根据关键词查找音频
  function findSoundByKeyword(keyword) {
    // 合并所有类别的声音
    const allSounds = [
      ...soundData.nature, 
      ...soundData.meditation, 
      ...soundData.whitenoise, 
      ...soundData.music, 
      ...soundData.stories
    ];
    
    // 搜索匹配的音频
    for (const sound of allSounds) {
      // 检查ID、标题和描述是否包含关键词
      if (sound.id.includes(keyword) || 
          sound.title.toLowerCase().includes(keyword) || 
          (sound.description && sound.description.toLowerCase().includes(keyword))) {
        return sound;
      }
    }
    
    // 如果没有精确匹配，尝试以下备选项
    if (keyword === 'forest') {
      return soundData.nature.find(s => s.id === 'forest') || soundData.nature[0];
    } else if (keyword === 'ocean') {
      return soundData.nature.find(s => s.id === 'ocean') || soundData.nature[2];
    } else if (keyword === 'rain') {
      return soundData.nature.find(s => s.id === 'rain') || soundData.nature[0];
    } else if (keyword === 'fire') {
      // 模拟火声音频
      return {
        id: 'fire',
        title: '篝火声',
        artist: '大自然',
        image: 'assets/images/sounds/fire.svg',
        description: '温暖的篝火声，让人感觉舒适和安全。'
      };
    } else if (keyword === 'insect') {
      // 模拟昆虫声音频
      return {
        id: 'insects',
        title: '昆虫鸣叫',
        artist: '大自然',
        image: 'assets/images/sounds/forest.svg',
        description: '夜晚森林中的昆虫鸣叫声。'
      };
    } else if (keyword === 'bird') {
      // 模拟鸟鸣声音频
      return {
        id: 'birds',
        title: '鸟鸣声',
        artist: '大自然',
        image: 'assets/images/sounds/forest.svg',
        description: '清晨森林中的鸟儿歌唱。'
      };
    } else if (keyword === 'wind') {
      // 模拟风声音频
      return {
        id: 'wind',
        title: '风声',
        artist: '大自然',
        image: 'assets/images/sounds/wind.svg',
        description: '轻柔的风吹过树叶的声音。'
      };
    } else if (keyword === 'piano') {
      return soundData.music.find(s => s.id === 'piano-sleep') || soundData.music[0];
    }
    
    return null;
  }
  
  // 当前激活的音轨列表
  const activeSoundTracks = [];
  let masterVolume = 0.7; // 主音量控制 (0-1)
  
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
    
    // 使用完全模拟播放模式 - 不尝试加载可能不存在的音频文件
    const simulatedAudio = createSimulatedAudio();
    
    // 添加到活动音轨列表
    activeSoundTracks.push({
      sound: sound,
      audio: simulatedAudio,
      volume: masterVolume
    });
    
    // 更新音轨混合器UI
    updateMixerUI();
    
    // 更新进度条
    updateProgressSimulated();
    
    // 设置播放状态
    isPlaying = true;
  }
  
  // 创建模拟音频对象
  function createSimulatedAudio() {
    // 创建模拟音频对象
    const simulatedAudio = {
      volume: masterVolume,
      currentTime: 0,
      duration: 300,
      paused: false,
      loop: true,
      
      play: function() {
        this.paused = false;
        return Promise.resolve();
      },
      
      pause: function() {
        this.paused = true;
      }
    };
    
    return simulatedAudio;
  }
  
  // 更新播放器UI
  function updatePlayerUI(sound) {
    // 更新播放器UI
    document.querySelector('.player-title').textContent = sound.title;
    document.querySelector('.player-artist').textContent = sound.artist || '大自然';
    
    // 使用对应的图片
    const playerImage = document.querySelector('.player-image');
    const imgSrc = sound.image || `assets/images/sounds/${sound.category || 'nature'}.svg`;
    playerImage.src = imgSrc;
    playerImage.onerror = function() {
      // 如果图片加载失败，使用默认图片
      this.src = 'assets/images/app-icon.svg';
    };
    
    // 显示播放器
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.classList.add('active');
    audioPlayer.style.display = 'flex';
    audioPlayer.style.transform = 'translateY(0)';
    
    // 更新播放按钮状态
    document.querySelector('.player-play i').className = 'fas fa-pause';
    isPlaying = true;
  }
  
  // 更新混音器UI
  function updateMixerUI() {
    const mixerChannels = document.querySelector('.mixer-channels');
    if (!mixerChannels) return;
    
    // 清空现有内容
    mixerChannels.innerHTML = '';
    
    // 添加每个活动音轨
    activeSoundTracks.forEach(track => {
      const channelDiv = document.createElement('div');
      channelDiv.className = 'mixer-channel';
      
      channelDiv.innerHTML = `
        <div class="channel-label">${track.sound.title}</div>
        <input type="range" min="0" max="100" value="${track.volume * 100}" class="channel-volume" data-sound-id="${track.sound.id}">
        <div class="channel-value">${Math.round(track.volume * 100)}%</div>
      `;
      
      // 添加音量变化监听器
      const volumeInput = channelDiv.querySelector('.channel-volume');
      volumeInput.addEventListener('input', function() {
        const soundId = this.getAttribute('data-sound-id');
        const volume = parseInt(this.value) / 100;
        
        // 更新UI显示
        channelDiv.querySelector('.channel-value').textContent = `${Math.round(volume * 100)}%`;
        
        // 更新音轨音量
        const trackIndex = activeSoundTracks.findIndex(t => t.sound.id === soundId);
        if (trackIndex >= 0) {
          activeSoundTracks[trackIndex].volume = volume;
          if (activeSoundTracks[trackIndex].audio) {
            activeSoundTracks[trackIndex].audio.volume = volume;
          }
        }
      });
      
      mixerChannels.appendChild(channelDiv);
    });
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
    document.querySelector('.player-play i').className = 'fas fa-play';
    
    // 隐藏播放器
    audioPlayer.classList.remove('active');
    
    // 更新混音器UI
    updateMixerUI();
    
    // 清除进度条更新
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
      window.progressInterval = null;
    }
  }
  
  // 增大音量
  function increaseVolume() {
    masterVolume = Math.min(masterVolume + 0.1, 1.0);
    
    // 更新所有音轨音量
    activeSoundTracks.forEach(track => {
      track.volume = masterVolume;
      if (track.audio) {
        track.audio.volume = masterVolume;
      }
    });
    
    // 更新混音器UI
    updateMixerUI();
  }
  
  // 减小音量
  function decreaseVolume() {
    masterVolume = Math.max(masterVolume - 0.1, 0.0);
    
    // 更新所有音轨音量
    activeSoundTracks.forEach(track => {
      track.volume = masterVolume;
      if (track.audio) {
        track.audio.volume = masterVolume;
      }
    });
    
    // 更新混音器UI
    updateMixerUI();
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
  
  // 语音输入功能增强
  aiVoiceBtn.addEventListener('click', function() {
    // 显示语音识别正在进行的状态
    aiVoiceBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    aiVoiceBtn.disabled = true;
    
    // 添加通知告知用户
    showNotification('语音识别中', '请对着麦克风说话...');
    
    // 检查浏览器是否支持语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        // 创建语音识别对象
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // 设置参数
        recognition.lang = 'zh-CN'; // 使用中文识别
        recognition.interimResults = false; // 只返回最终结果
        recognition.maxAlternatives = 1; // 只返回最可能的结果
        
        // 开始录音
        recognition.start();
        
        // 结果处理
        recognition.onresult = function(event) {
          const transcript = event.results[0][0].transcript;
          aiInput.value = transcript;
          sendAiMessage();
        };
        
        // 错误处理
        recognition.onerror = function(event) {
          console.error('语音识别错误:', event.error);
          // 回退到模拟识别
          simulateVoiceRecognition();
        };
        
        // 结束处理
        recognition.onend = function() {
          aiVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
          aiVoiceBtn.disabled = false;
        };
      } catch (e) {
        console.error('语音识别初始化失败:', e);
        // 回退到模拟识别
        simulateVoiceRecognition();
      }
    } else {
      // 浏览器不支持，使用模拟识别
      simulateVoiceRecognition();
    }
  });
  
  // 模拟语音识别
  function simulateVoiceRecognition() {
    // 示例短语列表
    const examplePhrases = [
      "我希望今晚在热带雨林中入睡",
      "来点篝火声",
      "添加鸟鸣声",
      "我想听海浪声",
      "添加钢琴音乐",
      "音量小一点",
      "音量大一点",
      "停止播放"
    ];
    
    // 随机选择一个短语或使用特定场景
    let recognizedText = "";
    
    // 如果没有激活的音轨，优先选择场景
    if (activeSoundTracks.length === 0) {
      // 场景相关的短语
      const scenesPhrases = [
        "我希望今晚在热带雨林中入睡",
        "我想听海浪声",
        "我需要下雨的声音来帮助我入睡"
      ];
      recognizedText = scenesPhrases[Math.floor(Math.random() * scenesPhrases.length)];
    } else {
      // 已有场景，添加音轨或调整
      const additionalPhrases = [
        "来点篝火声",
        "添加鸟鸣声",
        "添加虫鸣声",
        "音量小一点"
      ];
      recognizedText = additionalPhrases[Math.floor(Math.random() * additionalPhrases.length)];
    }
    
    // 延迟模拟处理时间
    setTimeout(() => {
      aiVoiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      aiVoiceBtn.disabled = false;
      
      // 填充输入框
      aiInput.value = recognizedText;
      
      // 立即发送
      sendAiMessage();
    }, 2000);
  }
  
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
  
  // 修复底部导航
  function fixTabNavigation() {
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // 首先移除所有事件监听器（防止重复绑定）
    tabs.forEach(tab => {
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);
    });
    
    // 重新获取所有tab元素
    const newTabs = document.querySelectorAll('.tab-item');
    
    newTabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 添加更多的日志来帮助调试
        console.log('Tab clicked:', this.getAttribute('data-tab'));
        
        // 获取目标tab ID
        const tabId = this.getAttribute('data-tab');
        
        // 切换tab样式
        newTabs.forEach(t => {
          console.log('移除tab激活状态:', t.getAttribute('data-tab'));
          t.classList.remove('active');
        });
        
        this.classList.add('active');
        console.log('添加tab激活状态:', tabId);
        
        // 切换内容
        tabContents.forEach(content => {
          console.log('隐藏内容:', content.id);
          content.classList.remove('active');
          content.style.display = 'none';
        });
        
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
          console.log('显示内容:', tabId);
          targetContent.classList.add('active');
          targetContent.style.display = 'block';
        } else {
          console.error('Tab content not found:', tabId);
        }
      });
    });
    
    console.log('底部导航修复完成，绑定了', newTabs.length, '个tab事件');
  }
  
  // 渲染声音类别图标
  function renderSoundCategories() {
    const categories = document.querySelectorAll('.category-item');
    
    // 定义每个类别的SVG内容 - 使用更独特、美观的图标
    const categoryIcons = {
      nature: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C10.89,3 10,3.89 10,5C10,6.11 10.89,7 12,7C13.11,7 14,6.11 14,5C14,3.89 13.11,3 12,3M12,8C9.24,8 7,10.24 7,13C7,13.84 7.25,14.65 7.68,15.36L12,22L16.32,15.36C16.75,14.65 17,13.84 17,13C17,10.24 14.76,8 12,8Z" /></svg>`,
      
      meditation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" /></svg>`,
      
      stories: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 1L14 6V17L19 12.5V1M21 5V18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5M10 18.41C8.75 18.09 7.5 18 6.5 18C5.44 18 4.18 18.19 3 18.5V7.13C3.91 6.73 5.14 6.5 6.5 6.5C7.86 6.5 9.09 6.73 10 7.13V18.41Z" /></svg>`,
      
      music: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9,3V4.5H7V3H5V7H7V5.5H9V7H11V3H9M5,21V17H7V18.5H9V17H11V21H9V19.5H7V21H5M3,13V11H5V13H3M5,15V13H7V15H5M7,15H9V17H7V15M9,15V13H11V15H9M11,13H13V15H11V13M13,13V11H15V13H13M15,11H17V13H15V11M17,11V9H19V11H17M17,9H15V7H17V9M21,11V9H19V7H21V5H19V3H21V1H11V5H13V7H15V9H9V5H11V3H1V5H3V7H5V9H7V11H5V13H3V15H5V17H7V19H5V21H9V17H11V15H13V13H15V11H13V9H17V11H15V13H17V15H19V13H21V11H19V9H21V7H19V9H17V7H21V11M19,19V21H21V19H19M19,19H17V17H19V19M15,21V19H17V21H15M15,21H13V19H15V21M13,17H15V19H13V17M11,21H13V19H11V21Z" /></svg>`,
      
      whitenoise: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3,9H7L12,4V20L7,15H3V9M14.59,15.17L16.17,13.59L14.59,12L16.17,10.41L14.59,8.83L16.17,7.24L14.59,5.66L16.17,4.07L17.76,5.66L16.17,7.24L17.76,8.83L16.17,10.41L17.76,12L16.17,13.59L17.76,15.17L16.17,16.76L14.59,15.17Z" /></svg>`
    };
    
    categories.forEach(category => {
      const categoryType = category.getAttribute('data-category');
      const iconElement = category.querySelector('.category-icon');
      
      if (iconElement && categoryType) {
        // 检查该类别是否有专用SVG图标定义
        if (categoryIcons[categoryType]) {
          // 首先尝试从图片文件加载
          const iconPath = `assets/images/sounds/${categoryType}.svg`;
          
          const img = document.createElement('img');
          img.src = iconPath;
          img.alt = categoryType;
          
          // 如果图片加载失败，使用定义的SVG
          img.onerror = function() {
            console.log(`图标 ${iconPath} 加载失败，使用内置SVG`);
            iconElement.innerHTML = categoryIcons[categoryType];
          };
          
          // 清空现有内容并添加图片
          iconElement.innerHTML = '';
          iconElement.appendChild(img);
          
          // 添加自定义颜色
          if (category.classList.contains('active')) {
            iconElement.style.color = '#8093f1';
          } else {
            iconElement.style.color = '#ffffff';
          }
        } else {
          console.warn(`没有为类别 ${categoryType} 定义图标`);
        }
      }
    });
    
    // 添加类别项点击事件，确保图标颜色也随着激活状态变化
    categories.forEach(category => {
      category.addEventListener('click', function() {
        // 移除所有激活状态
        categories.forEach(item => {
          item.classList.remove('active');
          const icon = item.querySelector('.category-icon');
          if (icon) icon.style.color = '#ffffff';
        });
        
        // 添加当前激活状态
        this.classList.add('active');
        const activeIcon = this.querySelector('.category-icon');
        if (activeIcon) activeIcon.style.color = '#8093f1';
        
        // 触发声音列表更新
        const categoryType = this.getAttribute('data-category');
        if (categoryType) {
          renderSoundsByCategory(categoryType);
        }
      });
    });
    
    console.log('声音类别图标渲染完成');
  }
  
  // 初始化时渲染声音类别图标
  document.addEventListener('DOMContentLoaded', function() {
    // 其他初始化代码...
    
    // 添加对这两个重要功能的调用
    renderSoundCategories();
    fixTabNavigation();
    
    // 显示通知，告知用户操作方式
    setTimeout(() => {
      showNotification('使用提示', '点击底部导航切换不同功能，点击声音卡片播放音频');
    }, 2000);
  });
  
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
    // 调整内容区域高度，防止内容过长
    tabContents.forEach(content => {
      content.style.paddingBottom = '80px'; // 确保底部有足够的空间不被遮挡
    });
    
    // 添加CSS样式修复内容区域滚动问题
    const style = document.createElement('style');
    style.textContent = `
      .tab-content {
        max-height: calc(100vh - 120px);
        overflow-y: auto;
        padding-bottom: 80px !important;
      }
      .main-content {
        padding-bottom: 70px;
      }
    `;
    
    // 检查是否已添加该样式
    if (!document.querySelector('style[data-resize-fix]')) {
      style.setAttribute('data-resize-fix', 'true');
      document.head.appendChild(style);
    }
  }
  
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化调用
  
  // 初始化底部导航事件
  fixTabNavigation();
  
  // 地图功能实现
  function initializeWorldMap() {
    const interactiveMap = document.getElementById('interactive-map');
    if (!interactiveMap) {
      console.error('找不到地图容器元素');
      return;
    }
    
    // 检查是否加载了checkinData
    if (typeof checkinData === 'undefined' || !checkinData.locations) {
      console.error('找不到地图数据');
      showNotification('数据加载失败', '无法加载地图数据，请刷新页面重试');
      return;
    }
    
    console.log('开始初始化地图...');
    
    // 添加地图位置标记
    checkinData.locations.forEach(location => {
      console.log('添加位置标记:', location.name);
      const marker = document.createElement('div');
      marker.className = 'map-location-marker';
      marker.setAttribute('data-location', location.id);
      marker.style.left = location.coordinates[0] + 'px';
      marker.style.top = location.coordinates[1] + 'px';
      
      // 点击事件
      marker.addEventListener('click', function() {
        selectMapLocation(location.id);
      });
      
      interactiveMap.appendChild(marker);
    });
    
    // 初始状态 - 默认选中第一个位置
    if (checkinData.locations.length > 0) {
      selectMapLocation(checkinData.locations[0].id);
    }
    
    // 热门位置列表点击
    const locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach(item => {
      item.addEventListener('click', function() {
        const locationId = this.getAttribute('data-location');
        selectMapLocation(locationId);
      });
    });
    
    // 打卡分享按钮
    const shareCheckinBtns = document.querySelectorAll('.share-checkin-btn');
    shareCheckinBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const checkinItem = this.closest('.checkin-item');
        const locationName = checkinItem.querySelector('.checkin-location').textContent;
        
        // 显示分享弹窗
        if (shareModal) {
          // 设置分享内容
          const shareLink = document.querySelector('.share-link input');
          if (shareLink) {
            shareLink.value = `https://dreamguardian.app/checkin?location=${encodeURIComponent(locationName)}`;
          }
          
          // 显示弹窗
          shareModal.style.display = 'flex';
        } else {
          // 如果没有弹窗，使用浏览器原生分享
          if (navigator.share) {
            navigator.share({
              title: '我的睡眠打卡',
              text: `我在梦境守护者中完成了在${locationName}的助眠体验！`,
              url: `https://dreamguardian.app/checkin`
            });
          }
        }
      });
    });
    
    // 生成打卡按钮
    const createCheckinBtn = document.querySelector('.create-checkin-btn');
    if (createCheckinBtn) {
      createCheckinBtn.addEventListener('click', generateNewCheckin);
    }
    
    console.log('地图初始化完成');
    
    // 在页面加载10秒后，显示提示，引导用户使用地图功能
    setTimeout(() => {
      showNotification('探索世界声音', '点击底部"地图"选项卡，探索世界各地的自然声音');
    }, 10000);
  }
  
  // 选择地图位置
  function selectMapLocation(locationId) {
    // 清除所有激活状态
    document.querySelectorAll('.map-location-marker').forEach(marker => {
      marker.classList.remove('active');
    });
    document.querySelectorAll('.location-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // 设置新的激活状态
    const marker = document.querySelector(`.map-location-marker[data-location="${locationId}"]`);
    const locationItem = document.querySelector(`.location-item[data-location="${locationId}"]`);
    
    if (marker) marker.classList.add('active');
    if (locationItem) locationItem.classList.add('active');
    
    // 查找位置数据
    const location = checkinData.locations.find(loc => loc.id === locationId);
    if (!location) return;
    
    // 这里可以添加更多的交互，例如显示位置详情、播放相关音频等
    playLocationSounds(location);
  }
  
  // 播放位置相关的声音
  function playLocationSounds(location) {
    // 停止所有当前音轨
    stopAllSounds();
    
    // 找到主要声音
    if (location.sounds && location.sounds.length > 0) {
      // 添加主声音
      const mainSoundId = location.sounds[0];
      const mainSound = findSoundByKeyword(mainSoundId);
      if (mainSound) {
        playSound(mainSound);
        
        // 如果有多个声音，添加其他声音
        if (location.sounds.length > 1) {
          setTimeout(() => {
            for (let i = 1; i < Math.min(location.sounds.length, 3); i++) {
              const additionalSound = findSoundByKeyword(location.sounds[i]);
              if (additionalSound) {
                addSoundTrack(additionalSound);
              }
            }
          }, 1000);
        }
      }
    }
    
    // 显示位置相关信息
    showNotification(location.name, location.description || location.type);
  }
  
  // 生成新的睡眠打卡
  function generateNewCheckin() {
    const createCheckinBtn = document.querySelector('.create-checkin-btn');
    
    // 显示生成中状态
    if (createCheckinBtn) {
      const originalText = createCheckinBtn.innerHTML;
      createCheckinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';
      createCheckinBtn.disabled = true;
      
      // 模拟生成过程
      setTimeout(() => {
        // 查找最近的睡眠数据
        const lastNight = new Date();
        lastNight.setDate(lastNight.getDate() - 1);
        const month = (lastNight.getMonth() + 1).toString().padStart(2, '0');
        const day = lastNight.getDate().toString().padStart(2, '0');
        const dateStr = `${lastNight.getFullYear()}/${month}/${day}`;
        
        // 随机选择一个位置
        const randomIndex = Math.floor(Math.random() * checkinData.locations.length);
        const randomLocation = checkinData.locations[randomIndex];
        
        // 随机生成睡眠质量 (70-98)
        const sleepQuality = Math.floor(Math.random() * 28) + 70;
        
        // 创建新的打卡元素
        const newCheckin = document.createElement('div');
        newCheckin.className = 'checkin-item';
        newCheckin.innerHTML = `
          <img src="assets/images/checkins/${randomLocation.id}-checkin.jpg" alt="${randomLocation.name}睡眠打卡" class="checkin-image">
          <div class="checkin-info">
            <div class="checkin-location">${randomLocation.name}</div>
            <div class="checkin-date">${dateStr}</div>
            <div class="checkin-quality">睡眠质量: ${sleepQuality}%</div>
          </div>
          <button class="share-checkin-btn"><i class="fas fa-share-alt"></i></button>
        `;
        
        // 添加分享按钮事件
        const shareBtn = newCheckin.querySelector('.share-checkin-btn');
        shareBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const locationName = randomLocation.name;
          
          // 显示分享弹窗
          if (shareModal) {
            // 设置分享内容
            const shareLink = document.querySelector('.share-link input');
            if (shareLink) {
              shareLink.value = `https://dreamguardian.app/checkin?location=${encodeURIComponent(locationName)}`;
            }
            
            // 显示弹窗
            shareModal.style.display = 'flex';
          }
        });
        
        // 插入到打卡列表的顶部
        const checkinsList = document.querySelector('.sleep-checkins');
        if (checkinsList) {
          checkinsList.insertBefore(newCheckin, checkinsList.firstChild);
        }
        
        // 重置按钮状态
        createCheckinBtn.innerHTML = originalText;
        createCheckinBtn.disabled = false;
        
        // 显示成功通知
        showNotification('打卡生成成功', `您在${randomLocation.name}的睡眠打卡已生成`);
      }, 2000);
    }
  }
  
  // 初始化调用
  initializeWorldMap();
  
  // 增强混音功能实现
  function initEnhancedMixer() {
    // 获取相关元素
    const addSoundBtn = document.querySelector('.add-sound-btn');
    const aiOptimizeBtn = document.querySelector('.ai-optimize-btn');
    const saveMixBtn = document.querySelector('.save-mix-btn');
    const shareMixBtn = document.querySelector('.share-mix-btn');
    const emotionScanBtn = document.querySelector('.emotion-scan-btn');
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    
    // 声音选择器相关元素
    const soundSelectorModal = document.getElementById('sound-selector-modal');
    const soundSelectorClose = document.querySelector('.sound-selector-close');
    const soundSelectorCategories = document.querySelectorAll('.sound-selector-category');
    const selectableSounds = document.querySelector('.selectable-sounds');
    
    // 情绪检测相关元素
    const emotionDetectionModal = document.getElementById('emotion-detection-modal');
    const emotionResult = document.querySelector('.emotion-result');
    const emotionDetectionStatus = document.querySelector('.emotion-detection-status');
    const applyRecBtn = document.querySelector('.apply-rec-btn');
    
    // 添加声音按钮事件
    if (addSoundBtn) {
      addSoundBtn.addEventListener('click', function() {
        openSoundSelector();
      });
    }
    
    // AI优化按钮事件
    if (aiOptimizeBtn) {
      aiOptimizeBtn.addEventListener('click', function() {
        optimizeMixWithAI();
      });
    }
    
    // 保存混音按钮事件
    if (saveMixBtn) {
      saveMixBtn.addEventListener('click', function() {
        saveMixPreset();
      });
    }
    
    // 分享混音按钮事件
    if (shareMixBtn) {
      shareMixBtn.addEventListener('click', function() {
        shareMixPreset();
      });
    }
    
    // 情绪检测按钮事件
    if (emotionScanBtn) {
      emotionScanBtn.addEventListener('click', function() {
        startEmotionDetection();
      });
    }
    
    // 情感推荐应用按钮
    if (applyRecBtn) {
      applyRecBtn.addEventListener('click', function() {
        applyEmotionRecommendation();
      });
    }
    
    // AI推荐混音项点击事件
    recommendationItems.forEach(item => {
      item.addEventListener('click', function() {
        const mixId = this.getAttribute('data-mix');
        applyRecommendedMix(mixId);
      });
    });
    
    // 声音选择器关闭按钮
    if (soundSelectorClose) {
      soundSelectorClose.addEventListener('click', function() {
        soundSelectorModal.style.display = 'none';
      });
    }
    
    // 声音选择器类别切换
    soundSelectorCategories.forEach(category => {
      category.addEventListener('click', function() {
        // 移除所有激活状态
        soundSelectorCategories.forEach(cat => cat.classList.remove('active'));
        
        // 添加当前激活状态
        this.classList.add('active');
        
        // 渲染对应类别的声音
        const categoryId = this.getAttribute('data-category');
        renderSelectableSounds(categoryId);
      });
    });
    
    // 关闭情绪检测弹窗
    const emotionModalClose = emotionDetectionModal.querySelector('.share-close');
    if (emotionModalClose) {
      emotionModalClose.addEventListener('click', function() {
        emotionDetectionModal.style.display = 'none';
      });
    }
  }
  
  // 打开声音选择器
  function openSoundSelector() {
    const soundSelectorModal = document.getElementById('sound-selector-modal');
    if (!soundSelectorModal) return;
    
    // 渲染默认类别的声音
    renderSelectableSounds('nature');
    
    // 显示弹窗
    soundSelectorModal.style.display = 'flex';
  }
  
  // 渲染可选择的声音
  function renderSelectableSounds(category) {
    const selectableSounds = document.querySelector('.selectable-sounds');
    if (!selectableSounds) return;
    
    // 清空现有内容
    selectableSounds.innerHTML = '';
    
    // 获取指定类别的声音
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
    
    // 创建声音项
    sounds.forEach(sound => {
      const soundItem = document.createElement('div');
      soundItem.className = 'selectable-sound-item';
      soundItem.setAttribute('data-sound-id', sound.id);
      
      // 使用图片
      const imgSrc = sound.image || `assets/images/sounds/${category}.svg`;
      
      soundItem.innerHTML = `
        <div class="selectable-sound-image">
          <img src="${imgSrc}" alt="${sound.title}">
        </div>
        <div class="selectable-sound-title">${sound.title}</div>
        <div class="selectable-sound-artist">${sound.artist}</div>
      `;
      
      // 添加点击事件
      soundItem.addEventListener('click', function() {
        // 添加选中的声音到混音器
        const soundId = this.getAttribute('data-sound-id');
        const selectedSound = findSoundById(soundId);
        
        if (selectedSound) {
          // 关闭弹窗
          document.getElementById('sound-selector-modal').style.display = 'none';
          
          // 添加声音
          addSoundTrack(selectedSound);
          
          // 显示通知
          showNotification('已添加声音', `已将"${selectedSound.title}"添加到混音中`);
        }
      });
      
      // 添加到容器
      selectableSounds.appendChild(soundItem);
    });
  }
  
  // 根据ID查找声音
  function findSoundById(soundId) {
    // 合并所有类别的声音
    const allSounds = [
      ...soundData.nature,
      ...soundData.meditation,
      ...soundData.whitenoise,
      ...soundData.music,
      ...soundData.stories
    ];
    
    // 查找匹配的声音
    return allSounds.find(sound => sound.id === soundId);
  }
  
  // AI优化混音
  function optimizeMixWithAI() {
    // 检查是否有活动音轨
    if (activeSoundTracks.length === 0) {
      showNotification('无法优化', '请先添加至少一个声音到混音器');
      return;
    }
    
    // 显示优化中通知
    showNotification('AI优化中', '正在为您优化多音轨平衡...');
    
    // 模拟AI优化过程
    setTimeout(() => {
      // 对各个声音轨道进行"优化"调整
      let totalTracks = activeSoundTracks.length;
      
      // 计算基础音量 - 轨道越多，单个轨道音量越小
      const baseVolume = Math.min(0.8, 1.0 / totalTracks + 0.2);
      
      // "AI"优化 - 设置主声音更大一些，其他声音平衡调整
      activeSoundTracks.forEach((track, index) => {
        // 假设第一个轨道是主声音
        if (index === 0) {
          // 主声音音量稍高
          track.volume = Math.min(baseVolume + 0.15, 1.0);
        } else {
          // 给每个音轨一个稍微随机的音量，创造"AI优化"的效果
          const randomFactor = Math.random() * 0.1;
          track.volume = Math.max(0.1, Math.min(baseVolume - 0.1 + randomFactor, 0.8));
        }
        
        // 更新音频对象的音量
        if (track.audio) {
          track.audio.volume = track.volume;
        }
      });
      
      // 更新混音器UI
      updateMixerUI();
      
      // 显示优化完成通知
      showNotification('优化完成', '多声音轨道已经过AI平衡优化');
    }, 1500);
  }
  
  // 保存混音预设
  function saveMixPreset() {
    // 检查是否有活动音轨
    if (activeSoundTracks.length === 0) {
      showNotification('无法保存', '请先添加至少一个声音到混音器');
      return;
    }
    
    // 创建混音预设
    const mixPreset = {
      id: 'mix-' + Date.now(),
      name: '我的混音 ' + new Date().toLocaleDateString(),
      tracks: activeSoundTracks.map(track => ({
        soundId: track.sound.id,
        volume: track.volume
      }))
    };
    
    // 这里应该保存到本地存储或服务器
    // 模拟保存过程
    showNotification('已保存', '您的混音已保存，可在"我的"页面查看');
  }
  
  // 分享混音预设
  function shareMixPreset() {
    // 检查是否有活动音轨
    if (activeSoundTracks.length === 0) {
      showNotification('无法分享', '请先添加至少一个声音到混音器');
      return;
    }
    
    // 获取当前混音的声音名称
    const soundNames = activeSoundTracks.map(track => track.sound.title).join(' + ');
    
    // 打开分享弹窗
    const shareModal = document.getElementById('share-modal');
    if (shareModal) {
      // 设置分享链接
      const shareLink = shareModal.querySelector('.share-link input');
      if (shareLink) {
        shareLink.value = `https://dreamguardian.app/mix?sounds=${encodeURIComponent(soundNames)}`;
      }
      
      // 显示弹窗
      shareModal.style.display = 'flex';
    } else {
      // 如果没有弹窗，使用浏览器原生分享
      if (navigator.share) {
        navigator.share({
          title: '我的助眠声音组合',
          text: `我在梦境守护者中创建了一个声音组合: ${soundNames}`,
          url: 'https://dreamguardian.app/mix'
        });
      }
    }
  }
  
  // 应用推荐混音
  function applyRecommendedMix(mixId) {
    // 停止当前所有声音
    stopAllSounds();
    
    let sounds = [];
    
    // 根据混音ID获取对应的声音组合
    if (mixId === 'focus') {
      // 专注工作 - 雨声 + 咖啡馆 + 轻音乐
      sounds = [
        findSoundByKeyword('rain'),
        findSoundById('white-noise'), // 模拟咖啡馆声音
        findSoundById('piano-sleep')
      ];
    } else if (mixId === 'deep-sleep') {
      // 深度睡眠 - 白噪音 + 风扇声 + 心跳
      sounds = [
        findSoundById('pink-noise'),
        findSoundById('fan-noise'),
        findSoundByKeyword('meditation') // 模拟舒缓的"心跳"
      ];
    } else if (mixId === 'relax') {
      // 放松减压 - 海浪 + 鸟鸣 + 轻风
      sounds = [
        findSoundById('ocean'),
        findSoundByKeyword('birds'),
        findSoundByKeyword('wind')
      ];
    }
    
    // 依次添加声音
    sounds.forEach((sound, index) => {
      if (sound) {
        if (index === 0) {
          // 第一个声音使用playSound来初始化播放器
          playSound(sound);
        } else {
          // 后续声音添加为额外音轨
          setTimeout(() => {
            addSoundTrack(sound);
          }, 500 * index); // 依次添加，有间隔时间
        }
      }
    });
    
    // 显示应用通知
    showNotification('已应用推荐混音', `已为您应用"${getRecommendationName(mixId)}"声音组合`);
  }
  
  // 获取推荐混音名称
  function getRecommendationName(mixId) {
    if (mixId === 'focus') return '专注工作';
    if (mixId === 'deep-sleep') return '深度睡眠';
    if (mixId === 'relax') return '放松减压';
    return '推荐组合';
  }
  
  // 启动情绪检测
  function startEmotionDetection() {
    const emotionDetectionModal = document.getElementById('emotion-detection-modal');
    const emotionResult = emotionDetectionModal.querySelector('.emotion-result');
    const emotionDetectionStatus = emotionDetectionModal.querySelector('.emotion-detection-status');
    
    // 重置状态
    emotionResult.style.display = 'none';
    emotionDetectionStatus.style.display = 'block';
    
    // 显示弹窗
    emotionDetectionModal.style.display = 'flex';
    
    // 模拟情绪检测过程
    setTimeout(() => {
      // 隐藏检测状态，显示结果
      emotionDetectionStatus.style.display = 'none';
      emotionResult.style.display = 'block';
    }, 3000);
  }
  
  // 应用情绪推荐
  function applyEmotionRecommendation() {
    // 关闭弹窗
    document.getElementById('emotion-detection-modal').style.display = 'none';
    
    // 停止当前声音
    stopAllSounds();
    
    // 应用推荐 - 疲惫状态推荐"轻雨声 + 低频白噪音"
    const rainSound = findSoundByKeyword('rain');
    const noiseSound = findSoundById('pink-noise');
    
    // 添加声音
    if (rainSound) {
      playSound(rainSound);
      
      // 延迟添加第二个声音
      if (noiseSound) {
        setTimeout(() => {
          addSoundTrack(noiseSound);
        }, 500);
      }
    }
    
    // 显示通知
    showNotification('已应用情绪推荐', '已为您应用匹配"疲惫"情绪的声音组合');
  }
  
  // 初始化增强混音功能
  initEnhancedMixer();
  
  // 更新AI持续对话功能
  function initializeVoiceAssistant() {
    const aiVoiceBtn = document.getElementById('ai-voice-btn');
    let isListening = false;
    let continuousMode = false;
    
    // 语音识别对象
    let recognition = null;
    
    // 尝试初始化Web Speech API
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'zh-CN'; // 设置为中文
      
      // 设置错误处理
      recognition.onerror = function(event) {
        console.error('语音识别错误:', event.error);
        isListening = false;
        hideVoiceFeedback();
        
        if (continuousMode) {
          // 在连续模式下，尝试重新启动
          setTimeout(() => {
            startListening();
          }, 1000);
        }
      };
      
      // 处理识别结果
      recognition.onresult = function(event) {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript.trim();
        console.log('识别到语音:', text);
        
        // 添加用户消息到聊天
        addChatMessage(text, 'user');
        
        // 处理语音命令
        processUserVoiceCommand(text);
        
        // 在连续模式下，保持识别
        if (continuousMode) {
          showNotification('AI助手', '正在聆听...');
        }
      };
      
      recognition.onend = function() {
        console.log('语音识别结束');
        if (continuousMode) {
          console.log('保持连续监听模式');
          recognition.start();
        } else {
          isListening = false;
          hideVoiceFeedback();
        }
      };
      
    } catch (e) {
      console.error('不支持Web Speech API, 使用模拟识别:', e);
      recognition = null;
    }
    
    // 启动语音识别
    function startListening() {
      if (isListening) return;
      
      isListening = true;
      showVoiceFeedback();
      
      if (recognition) {
        try {
          recognition.start();
          console.log('开始语音识别');
        } catch (e) {
          console.error('启动语音识别失败:', e);
          simulateVoiceRecognition();
        }
      } else {
        simulateVoiceRecognition();
      }
    }
    
    // 停止语音识别
    function stopListening() {
      if (!isListening) return;
      
      if (recognition) {
        try {
          recognition.stop();
          console.log('停止语音识别');
        } catch (e) {
          console.error('停止语音识别失败:', e);
        }
      }
      
      isListening = false;
      hideVoiceFeedback();
    }
    
    // 切换连续模式
    function toggleContinuousMode() {
      continuousMode = !continuousMode;
      
      if (continuousMode) {
        showNotification('连续对话模式已开启', '您可以直接说话，无需按按钮');
        startListening();
      } else {
        showNotification('连续对话模式已关闭', '');
        stopListening();
      }
    }
    
    // 显示语音反馈UI
    function showVoiceFeedback() {
      const feedbackElem = document.createElement('div');
      feedbackElem.className = 'voice-feedback';
      feedbackElem.innerHTML = `
        <div class="voice-feedback-icon">
          <i class="fas fa-microphone-alt"></i>
        </div>
        <div class="voice-feedback-text">正在聆听...</div>
      `;
      
      // 移除任何已存在的反馈元素
      hideVoiceFeedback();
      
      // 添加到页面
      document.body.appendChild(feedbackElem);
    }
    
    // 隐藏语音反馈UI
    function hideVoiceFeedback() {
      const existingFeedback = document.querySelector('.voice-feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }
    }
    
    // 添加语音按钮事件
    if (aiVoiceBtn) {
      // 短按启动单次识别，长按启动连续模式
      let longPressTimer;
      
      aiVoiceBtn.addEventListener('mousedown', function() {
        longPressTimer = setTimeout(() => {
          toggleContinuousMode();
          longPressTimer = null;
        }, 1000);
      });
      
      aiVoiceBtn.addEventListener('mouseup', function() {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          // 普通点击，只进行单次识别
          if (!continuousMode) {
            startListening();
          }
        }
      });
      
      // 点击事件 - 在移动设备上支持点击
      aiVoiceBtn.addEventListener('click', function() {
        if (!isListening && !continuousMode) {
          startListening();
        }
      });
      
      // 添加工具提示
      aiVoiceBtn.title = "点击进行语音对话，长按开启连续对话模式";
    }
    
    // 公开方法
    return {
      startListening,
      stopListening,
      toggleContinuousMode
    };
  }

  // 在初始化时创建语音助手
  let voiceAssistant;
  document.addEventListener('DOMContentLoaded', function() {
    // 其他初始化代码...
    
    // 初始化语音助手
    voiceAssistant = initializeVoiceAssistant();
    
    // 显示初始提示
    setTimeout(() => {
      showNotification('语音交互提示', '点击麦克风按钮开始语音对话，长按开启连续对话模式');
    }, 3000);
  });

  // 添加页面加载后立即播放一个随机声音的功能
  document.addEventListener('DOMContentLoaded', function() {
    // 其他初始化代码...
    
    // 在页面加载后1秒播放默认声音
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * soundData.nature.length);
      playSound(soundData.nature[randomIndex]);
      showNotification('自动播放', `开始播放 ${soundData.nature[randomIndex].title}`);
    }, 1000);
  });
}); 