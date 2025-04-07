// 声音数据
const soundData = {
  // 自然声音
  'nature': [
    {
      id: 'rain',
      title: '雨声',
      image: 'https://cdn-icons-png.flaticon.com/512/1779/1779891.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'forest',
      title: '森林',
      image: 'https://cdn-icons-png.flaticon.com/512/620/620995.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'ocean',
      title: '海浪',
      image: 'https://cdn-icons-png.flaticon.com/512/2784/2784399.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'river',
      title: '河流',
      image: 'https://cdn-icons-png.flaticon.com/512/2080/2080056.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 冥想声音
  'meditation': [
    {
      id: 'tibetan-bowl',
      title: '西藏碗',
      image: 'https://cdn-icons-png.flaticon.com/512/2829/2829661.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'om-chanting',
      title: 'Om吟唱',
      image: 'https://cdn-icons-png.flaticon.com/512/1468/1468160.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 白噪音
  'noise': [
    {
      id: 'white-noise',
      title: '白噪音',
      image: 'https://cdn-icons-png.flaticon.com/512/3280/3280026.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'pink-noise',
      title: '粉噪音',
      image: 'https://cdn-icons-png.flaticon.com/512/2065/2065061.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 音乐
  'music': [
    {
      id: 'piano-sleep',
      title: '钢琴安眠曲',
      image: 'https://cdn-icons-png.flaticon.com/512/2829/2829076.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'ambient-sleep',
      title: '环境音乐',
      image: 'https://cdn-icons-png.flaticon.com/512/5274/5274728.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 故事
  'story': [
    {
      id: 'nature-story',
      title: '大自然的故事',
      image: 'https://cdn-icons-png.flaticon.com/512/806/806292.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'meditation-guide',
      title: '引导冥想',
      image: 'https://cdn-icons-png.flaticon.com/512/3048/3048319.png',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ]
};

// 预设混音列表
const mixData = [
  {
    id: 'mix-ocean-ambient',
    title: '海洋环境',
    image: 'https://cdn-icons-png.flaticon.com/512/2784/2784399.png',
    artist: 'Nature Sleep',
    description: '海洋与环境音乐的完美结合',
    sounds: [
      {id: 'ocean', volume: 0.6},
      {id: 'ambient-sleep', volume: 0.4}
    ]
  },
  {
    id: 'mix-rain-piano',
    title: '雨声钢琴',
    image: 'https://cdn-icons-png.flaticon.com/512/1779/1779891.png',
    artist: 'Nature Sleep',
    description: '雨声与钢琴的浪漫组合',
    sounds: [
      {id: 'rain', volume: 0.7},
      {id: 'piano-sleep', volume: 0.5}
    ]
  }
];

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