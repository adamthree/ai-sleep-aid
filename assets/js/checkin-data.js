// 睡眠打卡数据
const checkinData = {
  // 用户的打卡历史
  history: [
    {
      id: 'checkin-001',
      location: '亚马逊雨林',
      date: '2025/02/15',
      quality: 94,
      duration: '7h 20m',
      image: 'assets/images/checkins/rainforest-checkin.jpg',
      soundTrack: ['rain', 'forest', 'birds'],
      description: '伴随着雨林的自然声音入眠，感受野生动物的陪伴。'
    },
    {
      id: 'checkin-002',
      location: '巴厘岛海滩',
      date: '2025/02/14',
      quality: 87,
      duration: '6h 45m',
      image: 'assets/images/checkins/ocean-checkin.jpg',
      soundTrack: ['ocean', 'wind'],
      description: '海浪声轻抚耳畔，仿佛置身海边度假。'
    },
    {
      id: 'checkin-003',
      location: '挪威峡湾',
      date: '2025/02/13',
      quality: 92,
      duration: '7h 10m',
      image: 'assets/images/checkins/nordic-checkin.jpg',
      soundTrack: ['wind', 'creek'],
      description: '北欧宁静的自然环境，冰雪与清澈溪流的完美结合。'
    },
    {
      id: 'checkin-004',
      location: '京都竹林',
      date: '2025/02/12',
      quality: 89,
      duration: '6h 55m',
      image: 'assets/images/checkins/bamboo-checkin.jpg',
      soundTrack: ['wind', 'birds'],
      description: '竹林中的微风与鸟鸣，东方禅意十足的睡眠体验。'
    },
    {
      id: 'checkin-005',
      location: '非洲草原',
      date: '2025/02/11',
      quality: 85,
      duration: '6h 30m',
      image: 'assets/images/checkins/savanna-checkin.jpg',
      soundTrack: ['savanna', 'fire'],
      description: '广阔草原的夜晚，远处的狮吼与篝火声交织。'
    }
  ],
  
  // 世界地图位置数据
  locations: [
    {
      id: 'rainforest',
      name: '亚马逊雨林',
      type: '热带雨林声音',
      coordinates: [230, 270],
      sounds: ['rain', 'forest', 'birds', 'insects'],
      description: '世界最大的热带雨林，拥有丰富的生物多样性和令人放松的自然声音。'
    },
    {
      id: 'ocean',
      name: '巴厘岛海滩',
      type: '海浪声',
      coordinates: [640, 250],
      sounds: ['ocean', 'wind'],
      description: '印度尼西亚著名的度假胜地，宁静的海浪声是完美的助眠声音。'
    },
    {
      id: 'mountain',
      name: '瑞士阿尔卑斯山',
      type: '高山风声',
      coordinates: [410, 110],
      sounds: ['wind', 'creek'],
      description: '壮丽的山脉风光，清新的高山空气和流水声帮助深度放松。'
    },
    {
      id: 'nordic',
      name: '北欧森林',
      type: '宁静冬季声音',
      coordinates: [420, 70],
      sounds: ['wind', 'snowfall'],
      description: '寒冷而宁静的北欧森林，雪落在松树上的声音令人安心。'
    },
    {
      id: 'savanna',
      name: '非洲草原',
      type: '草原夜晚声音',
      coordinates: [430, 220],
      sounds: ['savanna', 'fire', 'distant-animals'],
      description: '广阔的非洲草原，夜晚的自然声音和远处的动物叫声。'
    },
    {
      id: 'bamboo',
      name: '京都竹林',
      type: '东方禅意声音',
      coordinates: [620, 150],
      sounds: ['wind', 'birds', 'temple-bells'],
      description: '日本京都的竹林小径，微风吹拂竹叶的声音带来平静。'
    }
  ]
};

// 导出数据供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = checkinData;
} 