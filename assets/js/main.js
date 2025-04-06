document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动导航功能
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除其他活动类并添加当前活动类
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // 声音分类切换功能
    const soundCategories = document.querySelectorAll('.sound-category');
    const soundItems = [
        {
            category: 'nature',
            sounds: [
                { name: '雨声', file: 'rain.mp3' },
                { name: '海浪', file: 'ocean.mp3' },
                { name: '森林', file: 'forest.mp3' },
                { name: '篝火', file: 'fire.mp3' }
            ]
        },
        {
            category: 'meditation',
            sounds: [
                { name: '冥想引导-睡前', file: 'meditation-sleep.mp3' },
                { name: '冥想引导-放松', file: 'meditation-relax.mp3' },
                { name: '冥想引导-深呼吸', file: 'meditation-breath.mp3' },
                { name: '冥想引导-压力释放', file: 'meditation-stress.mp3' }
            ]
        },
        {
            category: 'music',
            sounds: [
                { name: '轻音乐-钢琴', file: 'music-piano.mp3' },
                { name: '轻音乐-吉他', file: 'music-guitar.mp3' },
                { name: '轻音乐-自然', file: 'music-nature.mp3' },
                { name: '轻音乐-空灵', file: 'music-ambient.mp3' }
            ]
        },
        {
            category: 'stories',
            sounds: [
                { name: '睡前故事-旅行', file: 'story-journey.mp3' },
                { name: '睡前故事-童话', file: 'story-fairytale.mp3' },
                { name: '睡前故事-梦境', file: 'story-dream.mp3' },
                { name: '睡前故事-自然', file: 'story-nature.mp3' }
            ]
        }
    ];
    
    let currentCategory = 'nature';
    const soundList = document.querySelector('.sound-list');
    
    // 根据分类渲染声音列表
    function renderSoundList(category) {
        soundList.innerHTML = '';
        
        const categoryData = soundItems.find(item => item.category === category);
        if (!categoryData) return;
        
        categoryData.sounds.forEach(sound => {
            const soundItem = document.createElement('div');
            soundItem.className = 'sound-item';
            soundItem.innerHTML = `
                <span class="sound-name">${sound.name}</span>
                <div class="sound-controls">
                    <button class="play-btn" data-file="${sound.file}"><i class="fas fa-play"></i></button>
                    <input type="range" min="0" max="100" value="80" class="volume-slider">
                </div>
            `;
            soundList.appendChild(soundItem);
        });
        
        // 添加播放按钮事件
        addPlayButtonEvents();
    }
    
    // 声音分类点击事件
    soundCategories.forEach(category => {
        category.addEventListener('click', function() {
            soundCategories.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            renderSoundList(currentCategory);
        });
    });
    
    // 初始渲染声音列表
    renderSoundList(currentCategory);
    
    // 当前播放的音频元素和按钮
    let currentAudio = null;
    let currentButton = null;
    
    // 添加播放按钮事件
    function addPlayButtonEvents() {
        const playButtons = document.querySelectorAll('.play-btn');
        
        playButtons.forEach(button => {
            button.addEventListener('click', function() {
                const soundFile = this.getAttribute('data-file');
                const soundPath = `assets/sounds/${soundFile}`;
                
                // 如果点击的是当前播放的音频
                if (currentButton === this && currentAudio && !currentAudio.paused) {
                    currentAudio.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                    return;
                }
                
                // 如果有其他音频正在播放，先暂停它
                if (currentAudio && currentButton) {
                    currentAudio.pause();
                    currentButton.innerHTML = '<i class="fas fa-play"></i>';
                }
                
                // 创建新的音频并播放
                currentAudio = new Audio(soundPath);
                currentButton = this;
                
                currentAudio.addEventListener('canplaythrough', () => {
                    currentAudio.play();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                });
                
                currentAudio.addEventListener('ended', () => {
                    this.innerHTML = '<i class="fas fa-play"></i>';
                    currentAudio = null;
                    currentButton = null;
                });
                
                // 获取音量控制
                const volumeSlider = this.nextElementSibling;
                currentAudio.volume = volumeSlider.value / 100;
                
                // 音量变化事件
                volumeSlider.addEventListener('input', function() {
                    if (currentAudio) {
                        currentAudio.volume = this.value / 100;
                    }
                });
                
                // 加载音频可能失败（比如文件不存在）的处理
                currentAudio.addEventListener('error', () => {
                    alert('无法加载音频文件，请稍后再试。');
                    this.innerHTML = '<i class="fas fa-play"></i>';
                    currentAudio = null;
                    currentButton = null;
                });
            });
        });
    }
    
    // AI聊天功能模拟
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-btn');
    const aiInteraction = document.querySelector('.ai-interaction p');
    const voiceButton = document.querySelector('.voice-btn');
    
    const aiResponses = [
        "深呼吸是放松的好方法。试着吸气数5秒，屏住呼吸3秒，然后呼气数7秒。重复几次，感受身体的放松。",
        "您今天感觉怎么样？我可以为您播放一些舒缓的音乐帮助您放松。",
        "如果您正在为失眠而烦恼，不妨尝试我们的引导冥想功能，它能帮助您平静心绪。",
        "根据研究，保持规律的睡眠时间对睡眠质量非常重要。试着每天在同一时间上床和起床。",
        "睡前避免使用手机和电脑是改善睡眠的有效方法，蓝光会抑制褪黑素的分泌。",
        "您想听一个放松的睡前故事吗？我有很多不同主题的故事可以选择。",
        "温暖的牛奶或草药茶是传统的助眠饮品，可以帮助您放松身心。",
        "记录梦境可以帮助您更好地理解自己的潜意识，要不要试试我们的梦境日记功能？"
    ];
    
    // 发送消息事件
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // 模拟AI回复
            setTimeout(() => {
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                aiInteraction.textContent = randomResponse;
            }, 1000);
            
            chatInput.value = '';
        }
    }
    
    sendButton.addEventListener('click', sendMessage);
    
    // 输入框回车发送
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 语音输入模拟
    voiceButton.addEventListener('click', function() {
        this.classList.add('active');
        
        // 模拟语音识别中
        setTimeout(() => {
            this.classList.remove('active');
            
            // 模拟识别到的文本
            chatInput.value = "我今晚睡不着，有什么好方法吗？";
            
            // 自动发送
            setTimeout(() => {
                sendMessage();
            }, 500);
        }, 2000);
    });
    
    // 创建混合按钮事件
    const mixButton = document.querySelector('.mix-button');
    
    mixButton.addEventListener('click', function() {
        const mixerModal = document.createElement('div');
        mixerModal.className = 'mixer-modal';
        mixerModal.innerHTML = `
            <div class="mixer-content">
                <span class="close-mixer">&times;</span>
                <h3>创建自定义混合</h3>
                <p>选择多种声音并调整各自音量来创建完美的睡眠环境</p>
                <div class="mixer-tracks">
                    <div class="mixer-track">
                        <span>雨声</span>
                        <input type="range" min="0" max="100" value="0" class="mixer-volume">
                        <span class="volume-value">0%</span>
                    </div>
                    <div class="mixer-track">
                        <span>海浪</span>
                        <input type="range" min="0" max="100" value="0" class="mixer-volume">
                        <span class="volume-value">0%</span>
                    </div>
                    <div class="mixer-track">
                        <span>轻音乐</span>
                        <input type="range" min="0" max="100" value="0" class="mixer-volume">
                        <span class="volume-value">0%</span>
                    </div>
                    <div class="mixer-track">
                        <span>森林</span>
                        <input type="range" min="0" max="100" value="0" class="mixer-volume">
                        <span class="volume-value">0%</span>
                    </div>
                </div>
                <div class="mixer-controls">
                    <button class="play-mix">播放混合</button>
                    <button class="save-mix">保存混合</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(mixerModal);
        
        // 关闭混合器模态框
        const closeButton = document.querySelector('.close-mixer');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(mixerModal);
        });
        
        // 音量滑块事件
        const volumeSliders = document.querySelectorAll('.mixer-volume');
        volumeSliders.forEach(slider => {
            slider.addEventListener('input', function() {
                const volumeValue = this.nextElementSibling;
                volumeValue.textContent = `${this.value}%`;
            });
        });
        
        // 添加混合播放按钮事件
        const playMixButton = document.querySelector('.play-mix');
        playMixButton.addEventListener('click', function() {
            alert('混合播放功能即将推出！');
        });
        
        // 添加保存混合按钮事件
        const saveMixButton = document.querySelector('.save-mix');
        saveMixButton.addEventListener('click', function() {
            alert('混合保存功能即将推出！');
        });
    });
    
    // 添加"开始体验"按钮事件
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        const soundsSection = document.querySelector('#sounds');
        window.scrollTo({
            top: soundsSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });
    
    // 在滚动时添加激活的导航链接
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // 添加一些自定义CSS以支持混合器模态框
    const customStyle = document.createElement('style');
    customStyle.innerHTML = `
        .mixer-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .mixer-content {
            background-color: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        }
        
        .close-mixer {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
            color: #888;
        }
        
        .close-mixer:hover {
            color: #333;
        }
        
        .mixer-tracks {
            margin: 30px 0;
        }
        
        .mixer-track {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .mixer-track span {
            width: 80px;
        }
        
        .mixer-track .volume-value {
            width: 40px;
            text-align: right;
        }
        
        .mixer-volume {
            flex: 1;
            height: 5px;
            border-radius: 5px;
            background-color: #ddd;
            appearance: none;
            outline: none;
            margin: 0 15px;
        }
        
        .mixer-volume::-webkit-slider-thumb {
            appearance: none;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background-color: var(--primary-color);
            cursor: pointer;
        }
        
        .mixer-controls {
            display: flex;
            justify-content: center;
            gap: 20px;
        }
        
        .play-mix, .save-mix {
            padding: 10px 25px;
            background-color: var(--accent-color);
            color: white;
            border-radius: 30px;
        }
        
        .play-mix:hover, .save-mix:hover {
            background-color: var(--dark-color);
        }
        
        .voice-btn.active {
            background-color: #f44336;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1);
            }
        }
    `;
    
    document.head.appendChild(customStyle);
}); 