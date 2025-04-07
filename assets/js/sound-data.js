// 声音数据
const soundData = {
  // 自然声音分类
  nature: [
    {
      id: 'rain',
      title: '雨声',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/4150/4150992.png',
      type: 'natural',
      duration: '10:00',
      description: '舒缓的雨声，帮助您放松并进入梦乡'
    },
    {
      id: 'forest',
      title: '森林',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/2927/2927856.png',
      type: 'natural',
      duration: '10:00',
      description: '宁静的森林环境音，包含鸟鸣和微风'
    },
    {
      id: 'ocean',
      title: '海浪',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/3516/3516306.png',
      type: 'natural',
      duration: '10:00',
      description: '平静的海浪声，让您仿佛置身于海边'
    },
    {
      id: 'river',
      title: '溪流',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/4723/4723396.png',
      type: 'natural',
      duration: '10:00',
      description: '流水的声音，有助于清除杂念'
    }
  ],
  
  // 冥想声音分类
  meditation: [
    {
      id: 'tibetan-bowl',
      title: '藏音碗',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/6284/6284392.png',
      type: 'meditation',
      duration: '10:00',
      description: '传统藏音碗的共鸣声，帮助冥想和放松'
    },
    {
      id: 'om-chanting',
      title: 'Om吟唱',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/8089/8089324.png',
      type: 'meditation',
      duration: '10:00',
      description: '古老的梵语吟唱，平静心灵'
    }
  ],
  
  // 白噪音分类
  whitenoise: [
    {
      id: 'white-noise',
      title: '白噪音',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/3596/3596149.png',
      type: 'noise',
      duration: '10:00',
      description: '纯白噪音，屏蔽环境干扰'
    },
    {
      id: 'pink-noise',
      title: '粉红噪音',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/6012/6012631.png',
      type: 'noise',
      duration: '10:00',
      description: '比白噪音更柔和的频谱，更适合睡眠'
    }
  ],
  
  // 音乐分类
  music: [
    {
      id: 'piano-sleep',
      title: '睡眠钢琴曲',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/3101/3101003.png',
      type: 'music',
      duration: '10:00',
      description: '舒缓的钢琴曲，低沉的音调有助于入眠'
    },
    {
      id: 'ambient-sleep',
      title: '环境氛围音',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/4472/4472616.png',
      type: 'music',
      duration: '10:00',
      description: '环境音乐，营造放松氛围'
    }
  ],
  
  // 故事分类
  stories: [
    {
      id: 'forest-walk',
      title: '森林漫步',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/620/620967.png',
      type: 'story',
      duration: '10:00',
      description: '一段关于森林漫步的引导式冥想故事'
    },
    {
      id: 'starry-night',
      title: '星空之旅',
      artist: 'Nature Sleep',
      image: 'https://cdn-icons-png.flaticon.com/512/3094/3094818.png',
      type: 'story',
      duration: '10:00',
      description: '一段关于宇宙和星空的引导式冥想故事'
    }
  ]
};

// 地点声音
const locationSounds = [
  {
    id: 'kyoto-bamboo',
    title: '京都竹林',
    location: '日本',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/928/928698.png',
    type: 'location',
    duration: '10:00',
    popularity: 87,
    description: '京都竹林的自然声音，竹子随风摆动的声音'
  },
  {
    id: 'hawaii-beach',
    title: '夏威夷海滩',
    location: '美国',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/2937/2937808.png',
    type: 'location',
    duration: '10:00',
    popularity: 92,
    description: '夏威夷海滩的波浪声和海鸟鸣叫'
  },
  {
    id: 'amazon-rainforest',
    title: '亚马逊雨林',
    location: '巴西',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/2072/2072178.png',
    type: 'location',
    duration: '10:00',
    popularity: 79,
    description: '亚马逊雨林的丰富生态系统声音'
  },
  {
    id: 'iceland-waterfall',
    title: '冰岛瀑布',
    location: '冰岛',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/1598/1598347.png',
    type: 'location',
    duration: '10:00',
    popularity: 84,
    description: '冰岛壮观瀑布的轰鸣声'
  },
  {
    id: 'himalayan-temple',
    title: '喜马拉雅寺庙',
    location: '尼泊尔',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/3165/3165330.png',
    type: 'location',
    duration: '10:00',
    popularity: 81,
    description: '喜马拉雅山脉寺庙的钟声和僧侣颂歌'
  }
];

// 推荐混音
const recommendedMixes = [
  {
    id: 'mix-rain-piano',
    title: '雨夜放松',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/4150/4150992.png',
    sounds: [
      { id: 'rain', volume: 0.7 },
      { id: 'piano-sleep', volume: 0.5 }
    ],
    type: 'mix',
    duration: '10:00',
    description: '雨声和轻柔钢琴曲的完美组合'
  },
  {
    id: 'mix-forest-tibetan',
    title: '森林冥想',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/2927/2927856.png',
    sounds: [
      { id: 'forest', volume: 0.6 },
      { id: 'tibetan-bowl', volume: 0.4 }
    ],
    type: 'mix',
    duration: '10:00',
    description: '森林声和藏音碗的组合'
  },
  {
    id: 'mix-ocean-ambient',
    title: '海边工作',
    artist: 'Nature Sleep',
    image: 'https://cdn-icons-png.flaticon.com/512/3516/3516306.png',
    sounds: [
      { id: 'ocean', volume: 0.5 },
      { id: 'white-noise', volume: 0.3 }
    ],
    type: 'mix',
    duration: '10:00',
    description: '海浪声和微弱白噪音的组合，适合在工作时保持专注'
  }
];

// 导出数据供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = soundData;
} 