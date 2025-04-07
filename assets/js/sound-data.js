// 声音数据文件
const soundData = {
  // 自然声音
  nature: [
    {
      id: 'rain',
      title: '雨声',
      artist: '大自然',
      image: 'assets/images/icons/rain.svg',
      type: 'nature',
      duration: '无限',
      description: '轻柔的雨声，帮助放松和入睡',
      isFree: true
    },
    {
      id: 'forest',
      title: '森林',
      artist: '大自然',
      image: 'assets/images/icons/forest.svg',
      type: 'nature',
      duration: '无限',
      description: '宁静的森林环境声，包含鸟鸣和微风声',
      isFree: true
    },
    {
      id: 'ocean',
      title: '海浪',
      artist: '大自然',
      image: 'assets/images/icons/waves.svg',
      type: 'nature',
      duration: '无限',
      description: '平静的海浪声，让人感到宁静和放松',
      isFree: true
    },
    {
      id: 'river',
      title: '溪流',
      artist: '大自然',
      image: 'assets/images/icons/river.svg',
      type: 'nature',
      duration: '无限',
      description: '流水声，有助于集中注意力和放松',
      isFree: true
    }
  ],
  
  // 冥想声音
  meditation: [
    {
      id: 'tibetan-bowl',
      title: '藏音碗',
      artist: '冥想助手',
      image: 'assets/images/icons/bell.svg',
      type: 'meditation',
      duration: '无限',
      description: '藏音碗的悠扬声音，帮助深度放松和冥想',
      isFree: true
    },
    {
      id: 'om-chanting',
      title: 'Om吟唱',
      artist: '冥想助手',
      image: 'assets/images/icons/om.svg',
      type: 'meditation',
      duration: '无限',
      description: '传统的Om吟唱声音，帮助入定和冥想',
      isFree: true
    }
  ],
  
  // 白噪音
  whitenoise: [
    {
      id: 'white-noise',
      title: '白噪音',
      artist: '助眠声音',
      image: 'assets/images/icons/white-noise.svg',
      type: 'whitenoise',
      duration: '无限',
      description: '均匀的白噪音，有助于掩盖环境噪音，帮助入睡',
      isFree: true
    },
    {
      id: 'pink-noise',
      title: '粉红噪音',
      artist: '助眠声音',
      image: 'assets/images/icons/pink-noise.svg',
      type: 'whitenoise',
      duration: '无限',
      description: '低频增强的噪音，更接近自然声音，更适合长时间聆听',
      isFree: true
    }
  ],
  
  // 音乐
  music: [
    {
      id: 'piano-sleep',
      title: '睡眠钢琴曲',
      artist: '梦境守护',
      image: 'assets/images/icons/piano.svg',
      type: 'music',
      duration: '30分钟',
      description: '舒缓的钢琴曲，专为睡眠设计',
      isFree: true
    },
    {
      id: 'ambient-sleep',
      title: '环境氛围音',
      artist: '梦境守护',
      image: 'assets/images/icons/ambient.svg',
      type: 'music',
      duration: '45分钟',
      description: '环境氛围音乐，轻柔的电子音效和自然声音的混合',
      isFree: true
    }
  ],
  
  // 故事
  stories: [
    {
      id: 'sleep-story-1',
      title: '森林漫步',
      artist: '睡眠叙事者',
      image: 'assets/images/icons/story.svg',
      type: 'story',
      duration: '15分钟',
      description: '一段关于在宁静森林中漫步的睡前故事，配有轻柔背景音乐',
      isFree: false
    },
    {
      id: 'sleep-story-2',
      title: '星空之旅',
      artist: '睡眠叙事者',
      image: 'assets/images/icons/stars.svg',
      type: 'story',
      duration: '20分钟',
      description: '一次引导式的想象旅程，带您穿越星空，帮助放松和入睡',
      isFree: false
    }
  ]
};

// 地理位置声音数据
const locationSounds = [
  {
    id: 'location-1',
    title: '京都竹林',
    location: '日本',
    coordinates: { lat: 35.0116, lng: 135.6936 },
    image: 'assets/images/locations/kyoto.jpg',
    soundId: 'forest',
    description: '日本京都的宁静竹林，微风穿过竹叶的声音',
    popularity: 87
  },
  {
    id: 'location-2',
    title: '夏威夷海滩',
    location: '美国',
    coordinates: { lat: 19.8968, lng: -155.5828 },
    image: 'assets/images/locations/hawaii.jpg',
    soundId: 'ocean',
    description: '夏威夷热带海滩的海浪声',
    popularity: 92
  },
  {
    id: 'location-3',
    title: '亚马逊雨林',
    location: '巴西',
    coordinates: { lat: -3.4653, lng: -62.2159 },
    image: 'assets/images/locations/amazon.jpg',
    soundId: 'rain',
    description: '亚马逊雨林中的雨声，伴随着远处的雷声和野生动物的声音',
    popularity: 79
  },
  {
    id: 'location-4',
    title: '冰岛瀑布',
    location: '冰岛',
    coordinates: { lat: 64.8014, lng: -23.0987 },
    image: 'assets/images/locations/iceland.jpg',
    soundId: 'river',
    description: '冰岛壮观瀑布的水流声',
    popularity: 85
  },
  {
    id: 'location-5',
    title: '喜马拉雅寺庙',
    location: '尼泊尔',
    coordinates: { lat: 27.9881, lng: 86.9250 },
    image: 'assets/images/locations/himalaya.jpg',
    soundId: 'tibetan-bowl',
    description: '喜马拉雅山脉中一座古老寺庙的藏音碗声音',
    popularity: 76
  }
];

// 推荐的混音组合
const mixRecommendations = [
  {
    id: 'mix-1',
    title: '雨夜放松',
    description: '雨声和轻柔钢琴曲的完美组合，适合雨天晚上入睡',
    sounds: [
      { id: 'rain', volume: 0.7 },
      { id: 'piano-sleep', volume: 0.4 }
    ],
    image: 'assets/images/mixes/rainy-night.jpg',
    likes: 1245
  },
  {
    id: 'mix-2',
    title: '森林冥想',
    description: '森林声和藏音碗的组合，创造出完美的冥想环境',
    sounds: [
      { id: 'forest', volume: 0.6 },
      { id: 'tibetan-bowl', volume: 0.5 }
    ],
    image: 'assets/images/mixes/forest-meditation.jpg',
    likes: 986
  },
  {
    id: 'mix-3',
    title: '海边工作',
    description: '海浪声和轻微的白噪音，帮助集中注意力工作',
    sounds: [
      { id: 'ocean', volume: 0.6 },
      { id: 'white-noise', volume: 0.3 }
    ],
    image: 'assets/images/mixes/ocean-work.jpg',
    likes: 754
  }
];

// 导出数据供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = soundData;
} 