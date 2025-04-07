/**
 * Nature Sleep 2.0 Redesign
 * 声音数据
 */

window.soundData = {
  // 自然声音
  'nature': [
    {
      id: 'rain',
      title: '雨声',
      image: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'forest',
      title: '森林',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'ocean',
      title: '海浪',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'river',
      title: '河流',
      image: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 冥想声音
  'meditation': [
    {
      id: 'tibetan-bowl',
      title: '藏音碗',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'om-chanting',
      title: 'OM吟唱',
      image: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 白噪音
  'noise': [
    {
      id: 'white-noise',
      title: '白噪音',
      image: 'https://images.unsplash.com/photo-1557682250-48bce9d32b37?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'pink-noise',
      title: '粉噪音',
      image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 音乐
  'music': [
    {
      id: 'piano-sleep',
      title: '钢琴曲',
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    },
    {
      id: 'ambient-sleep',
      title: '环境音乐',
      image: 'https://images.unsplash.com/photo-1546707012-c46675f12716?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '10:00'
    }
  ],
  
  // 故事
  'story': [
    {
      id: 'sleep-story-1',
      title: '森林漫步',
      image: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '15:00'
    },
    {
      id: 'sleep-story-2',
      title: '深海冥想',
      image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      artist: 'Nature Sleep',
      duration: '12:00'
    }
  ]
};

// 预设混音列表
window.soundMixes = [
  {
    id: 'mix-rain-ambient',
    title: '雨天氛围',
    description: '雨声混合环境音乐，营造舒适放松的氛围',
    sounds: [
      { id: 'rain', volume: 0.7, speed: 1 },
      { id: 'ambient-sleep', volume: 0.4, speed: 1 }
    ]
  },
  {
    id: 'mix-ocean-meditation',
    title: '冥想海洋',
    description: '海浪声与藏音碗的组合，帮助深度冥想',
    sounds: [
      { id: 'ocean', volume: 0.6, speed: 1 },
      { id: 'tibetan-bowl', volume: 0.5, speed: 0.75 }
    ]
  },
  {
    id: 'mix-forest-piano',
    title: '森林钢琴',
    description: '森林环境声与优美钢琴曲，帮助集中注意力',
    sounds: [
      { id: 'forest', volume: 0.5, speed: 1 },
      { id: 'piano-sleep', volume: 0.6, speed: 1 }
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
  module.exports = window.soundData;
} 