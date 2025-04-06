// 声音数据配置
const soundData = {
  // 自然声音类别
  nature: [
    {
      id: 'rain',
      title: '轻柔雨声',
      artist: '大自然',
      image: 'assets/images/sounds/rain.jpg',
      audio: 'assets/sounds/rain.mp3',
      description: '舒缓的雨声有助于掩盖环境噪音，帮助大脑放松，更容易入睡。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/InspectorJ/sounds/346642/',
      downloadUrl: 'https://freesound.org/people/InspectorJ/sounds/346642/'
    },
    {
      id: 'forest',
      title: '森林夜晚',
      artist: '大自然',
      image: 'assets/images/sounds/forest.jpg',
      audio: 'assets/sounds/forest.mp3',
      description: '宁静的森林夜晚声音，包含微风吹拂树叶和远处的虫鸣声。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/kvgarlic/sounds/156826/',
      downloadUrl: 'https://freesound.org/people/kvgarlic/sounds/156826/'
    },
    {
      id: 'ocean',
      title: '海浪声',
      artist: '大自然',
      image: 'assets/images/sounds/ocean.jpg',
      audio: 'assets/sounds/ocean.mp3',
      description: '平静的海浪声让人联想到海滩度假，有助于减轻压力和焦虑。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/Luftrum/sounds/48412/',
      downloadUrl: 'https://freesound.org/people/Luftrum/sounds/48412/'
    },
    {
      id: 'thunderstorm',
      title: '远处雷雨',
      artist: '大自然',
      image: 'assets/images/sounds/thunderstorm.jpg',
      audio: 'assets/sounds/thunderstorm.mp3',
      description: '远处的雷声和雨声创造出舒适安全的感觉，非常适合深度睡眠。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/RHumphries/sounds/2523/',
      downloadUrl: 'https://freesound.org/people/RHumphries/sounds/2523/'
    },
    {
      id: 'creek',
      title: '小溪流水',
      artist: '大自然',
      image: 'assets/images/sounds/creek.jpg',
      audio: 'assets/sounds/creek.mp3',
      description: '平静的小溪流水声，轻柔而连续，适合长时间播放。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/juskiddink/sounds/98479/',
      downloadUrl: 'https://freesound.org/people/juskiddink/sounds/98479/'
    }
  ],
  
  // 冥想声音类别
  meditation: [
    {
      id: 'singing-bowl',
      title: '藏式唱碗',
      artist: '冥想大师',
      image: 'assets/images/sounds/singing-bowl.jpg',
      audio: 'assets/sounds/singing-bowl.mp3',
      description: '藏式唱碗的悠长声音可以帮助大脑进入冥想状态，非常适合睡前放松。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/juskiddink/sounds/122647/',
      downloadUrl: 'https://freesound.org/people/juskiddink/sounds/122647/'
    },
    {
      id: 'om-chanting',
      title: '梵音冥想',
      artist: '冥想大师',
      image: 'assets/images/sounds/om-chanting.jpg',
      audio: 'assets/sounds/om-chanting.mp3',
      description: '传统的梵音"Om"冥想，有助于清空思绪，进入深度放松状态。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/waveplay/sounds/207206/',
      downloadUrl: 'https://freesound.org/people/waveplay/sounds/207206/'
    },
    {
      id: 'guided-relaxation',
      title: '引导式放松',
      artist: '睡眠治疗师',
      image: 'assets/images/sounds/guided-relaxation.jpg',
      audio: 'assets/sounds/guided-relaxation.mp3',
      description: '专业睡眠治疗师指导的渐进式肌肉放松练习，帮助全身心放松。',
      source: 'Free Music Archive - 建议搜索放松冥想指导',
      downloadUrl: 'https://freemusicarchive.org/search/?quicksearch=meditation'
    }
  ],
  
  // 白噪音类别
  whitenoise: [
    {
      id: 'white-noise',
      title: '纯白噪音',
      artist: '助眠专家',
      image: 'assets/images/sounds/white-noise.jpg',
      audio: 'assets/sounds/white-noise.mp3',
      description: '均匀的白噪音可以掩盖环境中的干扰声音，创造稳定的声音环境。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/kangaroovindaloo/sounds/205966/',
      downloadUrl: 'https://freesound.org/people/kangaroovindaloo/sounds/205966/'
    },
    {
      id: 'fan-noise',
      title: '风扇声',
      artist: '助眠专家',
      image: 'assets/images/sounds/fan.jpg',
      audio: 'assets/sounds/fan.mp3',
      description: '稳定的风扇声是很多人熟悉的助眠声音，节奏均匀舒适。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/xDimebagx/sounds/193814/',
      downloadUrl: 'https://freesound.org/people/xDimebagx/sounds/193814/'
    },
    {
      id: 'pink-noise',
      title: '粉红噪音',
      artist: '助眠专家',
      image: 'assets/images/sounds/pink-noise.jpg',
      audio: 'assets/sounds/pink-noise.mp3',
      description: '比白噪音更加温和的声音频谱，研究表明可以提升深度睡眠质量。',
      source: 'Freesound.org - 建议下载: https://freesound.org/people/cityincity/sounds/212039/',
      downloadUrl: 'https://freesound.org/people/cityincity/sounds/212039/'
    }
  ],
  
  // 音乐类别
  music: [
    {
      id: 'piano-sleep',
      title: '睡眠钢琴曲',
      artist: '平静作曲家',
      image: 'assets/images/sounds/piano.jpg',
      audio: 'assets/sounds/piano-sleep.mp3',
      description: '舒缓的钢琴曲调，慢节奏，适合睡前聆听。',
      source: 'Free Music Archive - 建议下载: https://freemusicarchive.org/music/Kevin_MacLeod/Calming/Meditation_1271',
      downloadUrl: 'https://freemusicarchive.org/music/Kevin_MacLeod/Calming/'
    },
    {
      id: 'ambient-sleep',
      title: '环境音乐',
      artist: '环境音乐家',
      image: 'assets/images/sounds/ambient.jpg',
      audio: 'assets/sounds/ambient-sleep.mp3',
      description: '轻柔的合成器环境音乐，没有明显的节拍，完美融入睡眠过程。',
      source: 'Free Music Archive - 建议搜索ambient sleep music',
      downloadUrl: 'https://freemusicarchive.org/search/?quicksearch=ambient+sleep'
    },
    {
      id: 'delta-waves',
      title: 'Delta脑波音乐',
      artist: '脑波科学家',
      image: 'assets/images/sounds/delta-waves.jpg',
      audio: 'assets/sounds/delta-waves.mp3',
      description: '经过设计的音乐，包含能促进深度睡眠的delta频率音波。',
      source: 'Free Music Archive - 建议搜索delta waves',
      downloadUrl: 'https://freemusicarchive.org/search/?quicksearch=delta+waves'
    }
  ],
  
  // 故事类别
  stories: [
    {
      id: 'sleep-story-1',
      title: '森林小屋的夜晚',
      artist: '睡眠故事讲述者',
      image: 'assets/images/sounds/sleep-story-1.jpg',
      audio: 'assets/sounds/sleep-story-1.mp3',
      description: '一个平静的故事，讲述在宁静森林中小屋度过的夜晚。',
      source: '建议使用专业语音录制软件或寻找有声书资源',
      downloadUrl: ''
    },
    {
      id: 'sleep-story-2',
      title: '海边的回忆',
      artist: '睡眠故事讲述者',
      image: 'assets/images/sounds/sleep-story-2.jpg',
      audio: 'assets/sounds/sleep-story-2.mp3',
      description: '轻柔的声音讲述关于海滩、阳光和海浪的放松故事。',
      source: '建议使用专业语音录制软件或寻找有声书资源',
      downloadUrl: ''
    }
  ]
};

// 导出数据供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = soundData;
} 