import { create } from 'zustand';
import { getRandomPinyin, getOptions, Difficulty, GameMode, PinyinWord } from '../utils/pinyin';

export type Theme = 'cloud' | 'starry' | 'forest';

interface TestStats {
  totalQuestions: number;
  correctCount: number;
  maxStreak: number;
  wrongList: string[]; // wrong pinyin chars
}

interface GameState {
  mode: GameMode;
  theme: Theme;
  difficulty: Difficulty;
  currentPinyin: PinyinWord | null;
  options: string[];
  score: number;
  streak: number;
  isExploding: boolean;
  showFeedback: 'correct' | 'wrong' | null;
  currentPraiseText: string;
  effectLevel: 'normal' | 'rainbow' | 'fullscreen';
  countdown: number;
  isCoaching: boolean;
  isEnding: boolean;
  testStats: TestStats;
  isPaused: boolean; // 学习模式（用户说的“暂停”）：不自动切题，但允许点发音/组词学习
  answeredCorrectly: boolean; // 学习模式下，本题是否已经答对过（防止重复刷分）

  goToMenu: () => void;
  setTheme: (theme: Theme) => void;
  setDifficulty: (diff: Difficulty) => void;
  startMode: (mode: 'practice' | 'test') => void;
  nextPinyin: () => void;
  checkAnswer: (answer: string) => void;
  handleTimeout: () => void;
  setCountdown: (n: number) => void;
  endTest: () => void;
  togglePause: () => void;
  resumeGame: () => void;
  goNextManually: () => void; // 学习模式下手动前进
}

const praiseList = [
  "太棒啦！",
  "发音真标准！",
  "你真厉害！",
  "完美！",
  "好聪明！",
  "超级棒！",
  "发音超清楚！",
  "你是小天才！"
];

const initialTestStats: TestStats = {
  totalQuestions: 0,
  correctCount: 0,
  maxStreak: 0,
  wrongList: []
};

export const useGameStore = create<GameState>((set, get) => ({
  mode: 'menu',
  theme: 'cloud',
  difficulty: 'beginner',
  currentPinyin: null,
  options: [],
  score: 0,
  streak: 0,
  isExploding: false,
  showFeedback: null,
  currentPraiseText: "",
  effectLevel: 'normal',
  countdown: 5,
  isCoaching: false,
  isEnding: false,
  testStats: initialTestStats,
  isPaused: false,
  answeredCorrectly: false,

  goToMenu: () => set({ mode: 'menu', currentPinyin: null, isExploding: false, showFeedback: null, isCoaching: false, isPaused: false, answeredCorrectly: false }),

  setTheme: (theme) => set({ theme }),

  setDifficulty: (diff) => set({ difficulty: diff }),

  startMode: (mode) => {
    const { difficulty } = get();
    const firstPinyin = getRandomPinyin(difficulty);
    set({
      mode,
      score: 0,
      streak: 0,
      countdown: 5,
      isCoaching: false,
      isEnding: false,
      isPaused: false,
      answeredCorrectly: false,
      testStats: mode === 'test' ? { ...initialTestStats, totalQuestions: 1 } : get().testStats,
      currentPinyin: firstPinyin,
      options: getOptions(firstPinyin, difficulty)
    });
  },

  nextPinyin: () => {
    // 学习模式（暂停）下，不允许自动切题（除非是手动前进 goNextManually 调用，它会先清 isPaused 再调本函数）
    if (get().isPaused) return;
    const { difficulty, currentPinyin, mode } = get();
    const p = getRandomPinyin(difficulty, currentPinyin?.pinyin);
    set({
      currentPinyin: p,
      options: getOptions(p, difficulty),
      isExploding: false,
      showFeedback: null,
      isCoaching: false,
      countdown: 5,
      effectLevel: 'normal',
      answeredCorrectly: false
    });
    // test mode: increment total questions
    if (mode === 'test') {
      set(state => ({
        testStats: {
          ...state.testStats,
          totalQuestions: state.testStats.totalQuestions + 1
        }
      }));
    }
  },

  checkAnswer: (answer) => {
    // 注意：学习模式（isPaused=true）下**允许答题**，只是答对了不自动切题。
    // 只有爆炸动画播放中 / 辅导中才禁止答题，防止狂点乱切
    if (get().isExploding || get().isCoaching) return;
    const { currentPinyin, score, streak, mode, isPaused, answeredCorrectly } = get();
    if (!currentPinyin) return;
    if (answer === currentPinyin.chinese) {
      const newStreak = streak + 1;
      let level: 'normal' | 'rainbow' | 'fullscreen' = 'normal';
      if (newStreak >= 5) level = 'fullscreen';
      else if (newStreak >= 3) level = 'rainbow';
      
      const randomPraise = praiseList[Math.floor(Math.random() * praiseList.length)];

      let newStats = undefined;
      if (mode === 'test') {
        newStats = {
          ...get().testStats,
          // 学习模式：答对了只给一次 testStats.correctCount 加分，防止重复刷
          correctCount: get().testStats.correctCount + (answeredCorrectly ? 0 : 1),
          maxStreak: Math.max(get().testStats.maxStreak, newStreak)
        };
      }

      // 得分逻辑：学习模式下本题已答对过就不再重复加分（防止刷分）；普通模式正常加分
      const shouldAddScore = !isPaused || !answeredCorrectly;

      set({
        showFeedback: 'correct',
        score: shouldAddScore ? score + 1 : score,
        streak: newStreak,
        effectLevel: level,
        currentPraiseText: randomPraise,
        answeredCorrectly: isPaused ? true : answeredCorrectly,
        testStats: newStats ? newStats : get().testStats
      });
      setTimeout(() => {
        set({ isExploding: true });
      }, 700);

      // 关键：学习模式（isPaused=true）下，答对后**永远不自动切题**，留给孩子去点发音/组词学习！
      // 只有普通模式（非学习模式），才在 3.2 秒后自动切下一题
      if (!isPaused) {
        setTimeout(() => {
          get().nextPinyin();
        }, 3200);
      } else {
        // 学习模式：反馈字幕过一会就消，但字母留下（isExploding 结束后也不切题）
        setTimeout(() => {
          set({ showFeedback: null, isExploding: false });
        }, 3200);
      }
    } else {
      let newStats = undefined;
      if (mode === 'test') {
        newStats = {
          ...get().testStats,
          wrongList: [...get().testStats.wrongList, currentPinyin.pinyin].filter((v, i, a) => a.indexOf(v) === i)
        };
      }
      set({
        showFeedback: 'wrong',
        streak: 0,
        testStats: newStats ? newStats : get().testStats
      });
      // 练习模式答错，会播放“没关系再试试”+ 正确示范音（约 3.5 秒），文字反馈保留到它们说完
      setTimeout(() => {
        set({ showFeedback: null });
      }, mode === 'test' ? 2200 : 4000);
    }
  },

  handleTimeout: () => {
    // 学习模式下：老师辅导三遍，但辅导完**不自动切题**，留在当前题让孩子学习
    const { currentPinyin, isPaused } = get();
    if (!currentPinyin) return;
    set({ isCoaching: true });
    
    setTimeout(() => {
      if (isPaused) {
        // 学习模式：辅导结束后，保留本题
        set({ isCoaching: false, countdown: 0 });
      } else {
        // 普通模式：按原逻辑切题
        set({ isCoaching: false });
        get().nextPinyin();
      }
    }, 6500);
  },

  setCountdown: (n) => set({ countdown: n }),

  endTest: () => {
    set({ mode: 'report' });
  },

  togglePause: () => set((state) => {
    const newPaused = !state.isPaused;
    // 切换到学习模式时，不清空语音（孩子可能正在听组词发音），保持原状
    return { isPaused: newPaused };
  }),

  resumeGame: () => set({ isPaused: false }),

  // 学习模式下：手动点击“下一题”按钮前进
  goNextManually: () => {
    // 先临时关闭 isPaused 让 nextPinyin 能跑（nextPinyin 里有 isPaused 守门）
    // 之后再根据用户意图：如果只是过这一题，学习模式继续开启？
    // —— 用户意思是“我这题学够了，去下一题继续学习模式”，所以学完后继续保持 isPaused=true
    set({ isPaused: false });
    get().nextPinyin();
    // nextPinyin 跑完（同步 set）后，重新置回学习模式
    setTimeout(() => {
      set({ isPaused: true });
    }, 0);
  },
}));
