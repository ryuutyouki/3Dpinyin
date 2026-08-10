export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type GameMode = 'menu' | 'practice' | 'test' | 'report';

export interface PinyinWord {
  pinyin: string;        // 拼音字符
  chinese: string;       // 中文读音
  difficulty: Difficulty;
  words: {
    spell: string;       // 组词拼音
    text: string;        // 组词汉字
  }[];
}

// 23 个声母 + 24 个韵母 + 16 个整体认读音节 = 63 个
export const PINYIN_DATABASE: PinyinWord[] = [
  // Level 1: 简单声母、单韵母
  { pinyin: 'b', chinese: '玻', difficulty: 'beginner', words: [{ spell: 'bà ba', text: '爸爸' }, { spell: 'bái yún', text: '白云' }] },
  { pinyin: 'p', chinese: '坡', difficulty: 'beginner', words: [{ spell: 'píng guǒ', text: '苹果' }, { spell: 'pá shān', text: '爬山' }] },
  { pinyin: 'm', chinese: '摸', difficulty: 'beginner', words: [{ spell: 'mā ma', text: '妈妈' }, { spell: 'mào zi', text: '帽子' }] },
  { pinyin: 'f', chinese: '佛', difficulty: 'beginner', words: [{ spell: 'fēi jī', text: '飞机' }, { spell: 'fāng fǎ', text: '方法' }] },
  { pinyin: 'd', chinese: '得', difficulty: 'beginner', words: [{ spell: 'dà xiàng', text: '大象' }, { spell: 'dì tú', text: '地图' }] },
  { pinyin: 't', chinese: '特', difficulty: 'beginner', words: [{ spell: 'tiān kōng', text: '天空' }, { spell: 'tǔ dì', text: '土地' }] },
  { pinyin: 'n', chinese: '讷', difficulty: 'beginner', words: [{ spell: 'niú nǎi', text: '牛奶' }, { spell: 'nán hái', text: '男孩' }] },
  { pinyin: 'l', chinese: '勒', difficulty: 'beginner', words: [{ spell: 'lǎo shī', text: '老师' }, { spell: 'lǜ sè', text: '绿色' }] },
  { pinyin: 'g', chinese: '哥', difficulty: 'beginner', words: [{ spell: 'gē ge', text: '哥哥' }, { spell: 'gāo xìng', text: '高兴' }] },
  { pinyin: 'k', chinese: '科', difficulty: 'beginner', words: [{ spell: 'kǒu shuǐ', text: '口水' }, { spell: 'kǔ guā', text: '苦瓜' }] },
  { pinyin: 'h', chinese: '喝', difficulty: 'beginner', words: [{ spell: 'hē shuǐ', text: '喝水' }, { spell: 'huā duǒ', text: '花朵' }] },
  { pinyin: 'j', chinese: '鸡', difficulty: 'beginner', words: [{ spell: 'jī dàn', text: '鸡蛋' }, { spell: 'jià gé', text: '价格' }] },
  { pinyin: 'q', chinese: '七', difficulty: 'beginner', words: [{ spell: 'qì chē', text: '汽车' }, { spell: 'qīng wā', text: '青蛙' }] },
  { pinyin: 'x', chinese: '西', difficulty: 'beginner', words: [{ spell: 'xī guā', text: '西瓜' }, { spell: 'xiǎo māo', text: '小猫' }] },
  { pinyin: 'a', chinese: '啊', difficulty: 'beginner', words: [{ spell: 'bà ba', text: '爸爸' }, { spell: 'mā ma', text: '妈妈' }] },
  { pinyin: 'o', chinese: '喔', difficulty: 'beginner', words: [{ spell: 'pō shuǐ', text: '泼水' }, { spell: 'mó gu', text: '蘑菇' }] },
  { pinyin: 'e', chinese: '鹅', difficulty: 'beginner', words: [{ spell: 'bái é', text: '白鹅' }, { spell: 'kè táng', text: '课堂' }] },
  { pinyin: 'i', chinese: '衣', difficulty: 'beginner', words: [{ spell: 'yī fú', text: '衣服' }, { spell: 'pí guǒ', text: '皮果(苹果)' }] },
  { pinyin: 'u', chinese: '乌', difficulty: 'beginner', words: [{ spell: 'wū yā', text: '乌鸦' }, { spell: 'shū fu', text: '舒服' }] },
  { pinyin: 'ü', chinese: '鱼', difficulty: 'beginner', words: [{ spell: 'yú ér', text: '鱼儿' }, { spell: 'lǜ sè', text: '绿色' }] },

  // Level 2: 翘舌声母、复韵母、特殊韵母er
  { pinyin: 'zh', chinese: '知', difficulty: 'intermediate', words: [{ spell: 'zhū bāo', text: '猪包' }, { spell: 'zhí shù', text: '植树' }] },
  { pinyin: 'ch', chinese: '吃', difficulty: 'intermediate', words: [{ spell: 'chī fàn', text: '吃饭' }, { spell: 'chē zi', text: '车子' }] },
  { pinyin: 'sh', chinese: '诗', difficulty: 'intermediate', words: [{ spell: 'shī gē', text: '诗歌' }, { spell: 'shū bāo', text: '书包' }] },
  { pinyin: 'r', chinese: '日', difficulty: 'intermediate', words: [{ spell: 'rì chū', text: '日出' }, { spell: 'rè shui', text: '热水' }] },
  { pinyin: 'z', chinese: '资', difficulty: 'intermediate', words: [{ spell: 'zǔ guó', text: '祖国' }, { spell: 'zǐ sè', text: '紫色' }] },
  { pinyin: 'c', chinese: '雌', difficulty: 'intermediate', words: [{ spell: 'cì wei', text: '刺猬' }, { spell: 'cā bō li', text: '擦玻璃' }] },
  { pinyin: 's', chinese: '思', difficulty: 'intermediate', words: [{ spell: 'sī jī', text: '司机' }, { spell: 'sān gè', text: '三个' }] },
  { pinyin: 'ai', chinese: '哀', difficulty: 'intermediate', words: [{ spell: 'bái cài', text: '白菜' }, { spell: 'dài zi', text: '袋子' }] },
  { pinyin: 'ei', chinese: '诶', difficulty: 'intermediate', words: [{ spell: 'hēi bái', text: '黑白' }, { spell: 'fēi jī', text: '飞机' }] },
  { pinyin: 'ui', chinese: '威', difficulty: 'intermediate', words: [{ spell: 'shuǐ guǒ', text: '水果' }, { spell: 'kuài lè', text: '快乐' }] },
  { pinyin: 'ao', chinese: '熬', difficulty: 'intermediate', words: [{ spell: 'māo mì', text: '猫咪' }, { spell: 'pǎo bù', text: '跑步' }] },
  { pinyin: 'ou', chinese: '欧', difficulty: 'intermediate', words: [{ spell: 'gǒu xióng', text: '狗熊' }, { spell: 'dòu zi', text: '豆子' }] },
  { pinyin: 'iu', chinese: '优', difficulty: 'intermediate', words: [{ spell: 'niú nǎi', text: '牛奶' }, { spell: 'xià tiān', text: '夏天' }] },
  { pinyin: 'ie', chinese: '耶', difficulty: 'intermediate', words: [{ spell: 'xié zi', text: '鞋子' }, { spell: 'tiě lù', text: '铁路' }] },
  { pinyin: 'üe', chinese: '约', difficulty: 'intermediate', words: [{ spell: 'xuě huā', text: '雪花' }, { spell: 'yuè liàng', text: '月亮' }] },
  { pinyin: 'er', chinese: '耳', difficulty: 'intermediate', words: [{ spell: 'ěr duo', text: '耳朵' }, { spell: 'èr shí', text: '二十' }] },

  // Level 3: 前后鼻韵母、全部整体认读音节
  { pinyin: 'an', chinese: '安', difficulty: 'advanced', words: [{ spell: 'ān quán', text: '安全' }, { spell: 'píng ān', text: '平安' }] },
  { pinyin: 'en', chinese: '恩', difficulty: 'advanced', words: [{ spell: 'rén mín', text: '人民' }, { spell: 'fēn zhōng', text: '分钟' }] },
  { pinyin: 'in', chinese: '因', difficulty: 'advanced', words: [{ spell: 'pīn yīn', text: '拼音' }, { spell: 'yīn guǒ', text: '因果' }] },
  { pinyin: 'un', chinese: '温', difficulty: 'advanced', words: [{ spell: 'wēn dù', text: '温度' }, { spell: 'chūn tiān', text: '春天' }] },
  { pinyin: 'ün', chinese: '晕', difficulty: 'advanced', words: [{ spell: 'jūn duì', text: '军队' }, { spell: 'xún zhǎo', text: '寻找' }] },
  { pinyin: 'ang', chinese: '昂', difficulty: 'advanced', words: [{ spell: 'yáng guāng', text: '阳光' }, { spell: 'xué xiào', text: '学校' }] },
  { pinyin: 'eng', chinese: '鞥', difficulty: 'advanced', words: [{ spell: 'dēng guāng', text: '灯光' }, { spell: 'fēng jǐng', text: '风景' }] },
  { pinyin: 'ing', chinese: '英', difficulty: 'advanced', words: [{ spell: 'xīng xing', text: '星星' }, { spell: 'tīng jiǎng', text: '听讲' }] },
  { pinyin: 'ong', chinese: '轰', difficulty: 'advanced', words: [{ spell: 'sōng shǔ', text: '松鼠' }, { spell: 'gōng jī', text: '公鸡' }] },
  { pinyin: 'zhi', chinese: '知', difficulty: 'advanced', words: [{ spell: 'zhī shi', text: '知识' }, { spell: 'zhī qián', text: '之前' }] },
  { pinyin: 'chi', chinese: '吃', difficulty: 'advanced', words: [{ spell: 'chī fàn', text: '吃饭' }, { spell: 'chí táng', text: '池塘' }] },
  { pinyin: 'shi', chinese: '师', difficulty: 'advanced', words: [{ spell: 'lǎo shī', text: '老师' }, { spell: 'shí tou', text: '石头' }] },
  { pinyin: 'ri', chinese: '日', difficulty: 'advanced', words: [{ spell: 'rì zi', text: '日子' }, { spell: 'rì yuè', text: '日月' }] },
  { pinyin: 'zi', chinese: '资', difficulty: 'advanced', words: [{ spell: 'hài zi', text: '孩子' }, { spell: 'zī liào', text: '资料' }] },
  { pinyin: 'ci', chinese: '雌', difficulty: 'advanced', words: [{ spell: 'cí qì', text: '瓷器' }, { spell: 'gōng cì', text: '公厕' }] },
  { pinyin: 'si', chinese: '思', difficulty: 'advanced', words: [{ spell: 'sī niàn', text: '思念' }, { spell: 'sì jì', text: '四季' }] },
  { pinyin: 'yi', chinese: '衣', difficulty: 'advanced', words: [{ spell: 'yī shēng', text: '医生' }, { spell: 'yī yuàn', text: '医院' }] },
  { pinyin: 'wu', chinese: '乌', difficulty: 'advanced', words: [{ spell: 'wū guī', text: '乌龟' }, { spell: 'wǔ dǎo', text: '舞蹈' }] },
  { pinyin: 'yu', chinese: '鱼', difficulty: 'advanced', words: [{ spell: 'yú gāng', text: '鱼缸' }, { spell: 'yǔ sǎn', text: '雨伞' }] },
  { pinyin: 'ye', chinese: '爷', difficulty: 'advanced', words: [{ spell: 'yé ye', text: '爷爷' }, { spell: 'yè zi', text: '叶子' }] },
  { pinyin: 'yue', chinese: '月', difficulty: 'advanced', words: [{ spell: 'yuè liang', text: '月亮' }, { spell: 'yīn yuè', text: '音乐' }] },
  { pinyin: 'yuan', chinese: '圆', difficulty: 'advanced', words: [{ spell: 'yuán xíng', text: '圆形' }, { spell: 'xiào yuán', text: '校园' }] },
  { pinyin: 'yin', chinese: '音', difficulty: 'advanced', words: [{ spell: 'yīn yuè', text: '音乐' }, { spell: 'pīn yīn', text: '拼音' }] },
  { pinyin: 'yun', chinese: '云', difficulty: 'advanced', words: [{ spell: 'bái yún', text: '白云' }, { spell: 'yǔn xǔ', text: '允许' }] },
  { pinyin: 'ying', chinese: '英', difficulty: 'advanced', words: [{ spell: 'yīng xióng', text: '英雄' }, { spell: 'liú yǐng', text: '留影' }] }
];

export function getPinyinByDifficulty(difficulty: Difficulty): PinyinWord[] {
  return PINYIN_DATABASE.filter(p => p.difficulty === difficulty);
}

export function getRandomPinyin(difficulty: Difficulty, current?: string): PinyinWord {
  const list = getPinyinByDifficulty(difficulty);
  let p = list[Math.floor(Math.random() * list.length)];
  while (p.pinyin === current && list.length > 1) {
    p = list[Math.floor(Math.random() * list.length)];
  }
  return p;
}

export function getOptions(correctAnswer: PinyinWord, difficulty: Difficulty): string[] {
  const list = getPinyinByDifficulty(difficulty);
  const options = new Set<string>();
  options.add(correctAnswer.chinese);
  while(options.size < 4) {
    const randomPinyin = list[Math.floor(Math.random() * list.length)];
    options.add(randomPinyin.chinese);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}
