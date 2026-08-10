import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Settings, Trophy, Flame, Home, Clock, Play, Pause, PlayCircle } from 'lucide-react';
import { playTTS, stopSpeaking } from '../utils/tts';

const praiseTexts = [
  { text: "太棒啦！" },
  { text: "发音真标准！" },
  { text: "你真厉害！" },
  { text: "完美！" },
  { text: "好聪明！" },
  { text: "超级棒！" },
  { text: "发音超清楚！" },
  { text: "你是小天才！" }
];

const playAudio = (url: string) => {
  try {
    const audio = new Audio(url);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  } catch {}
};

const playReadAudio = (text: string, times = 1) => {
  // 替换为云端标准发音引擎
  stopSpeaking();
  const run = async () => {
    for (let i = 0; i < times; i++) {
      await playTTS(text, 4); // 儿童教学语速 4
      if (i < times - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  };
  run();
};

const UIOverlay: React.FC = () => {
  const { 
    options, 
    score, 
    streak, 
    showFeedback, 
    checkAnswer, 
    difficulty, 
    setDifficulty,
    currentPinyin,
    isExploding,
    mode,
    countdown,
    setCountdown,
    handleTimeout,
    isCoaching,
    goToMenu,
    endTest,
    effectLevel,
    currentPraiseText,
    isPaused,
    togglePause,
    goNextManually
  } = useGameStore();

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown logic (practice mode only)
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // 暂停时 / 爆炸时 / 辅导中 / 显示答错反馈中，暂停倒计时
    if (mode !== 'practice' || isExploding || isCoaching || !currentPinyin || showFeedback === 'wrong' || isPaused) return;

    let c = countdown; // 从当前剩下的时间继续（暂停恢复时不重置）
    timerRef.current = setInterval(() => {
      // Double check inside interval
      if (useGameStore.getState().isPaused) return;
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleTimeout();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, currentPinyin?.pinyin, isExploding, isCoaching, showFeedback, isPaused, setCountdown, handleTimeout, countdown]);

  // Coaching: play 3 times
  useEffect(() => {
    if (isCoaching && currentPinyin) {
      playReadAudio(currentPinyin.chinese, 3);
    }
  }, [isCoaching, currentPinyin?.pinyin]);

  // Feedback audio + TTS voice（严格去重：使用唯一的 session id 防 double-play，解决暂停/恢复导致的 useEffect 二次触发）
  const feedbackSessionIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!showFeedback) {
      feedbackSessionIdRef.current = null;
      return;
    }
    // 生成一个唯一会话 id，后续所有 setTimeout 都校验此 id；
    // 若暂停/恢复导致 useEffect 再次触发，新 session id 会覆盖旧值，旧的 setTimeout 会被拦住不执行。
    const sessionId = `${showFeedback}-${currentPraiseText || ''}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    feedbackSessionIdRef.current = sessionId;

    const stillAlive = () => feedbackSessionIdRef.current === sessionId;

    if (showFeedback === 'correct') {
      playAudio('https://actions.google.com/sounds/v1/cartoon/pop_reverb.ogg');
      setTimeout(() => {
        if (!stillAlive()) return;
        playAudio('https://actions.google.com/sounds/v1/human_voices/human_yay.ogg');
      }, 200);
      // 夸奖真人语音：只播一次，严格 session 校验 + 播放前 stopSpeaking 清理队列
      setTimeout(() => {
        if (!stillAlive() || !currentPraiseText) return;
        stopSpeaking();
        playTTS(currentPraiseText, 5).catch(() => {});
      }, 500);
      if (effectLevel === 'fullscreen') {
        setTimeout(() => {
          if (!stillAlive()) return;
          playAudio('https://actions.google.com/sounds/v1/crowds/crowd_celebrating.ogg');
        }, 900);
      }
    } else if (showFeedback === 'wrong') {
      playAudio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
      setTimeout(() => {
        if (!stillAlive()) return;
        stopSpeaking();
        if (mode === 'test') {
          // 测试模式：绝对不泄露答案，仅温柔提醒重新思考（不读正确发音！）
          playTTS('没关系，再想一想哦~', 4).catch(() => {});
        } else {
          // 练习模式（学习阶段）：温柔鼓励 + 示范正确发音
          playTTS('没关系，再试试哦~', 4).catch(() => {});
          if (currentPinyin) {
            setTimeout(() => {
              if (!stillAlive()) return;
              playReadAudio(currentPinyin.chinese);
            }, 1600);
          }
        }
      }, 700);
    }
    // 依赖项只留 showFeedback + effectLevel + currentPraiseText 这种核心触发器；
    // 把 currentPinyin/mode 都去掉（暂停/恢复会导致依赖变引用但值一样，触发两次），
    // 读取它们用 useGameStore.getState() 闭包获取即可
  }, [showFeedback, effectLevel, currentPraiseText, mode, currentPinyin?.pinyin]);

  if (!currentPinyin) return null;

  return (
    <div className="overlay-root">
      {/* Top Bar: Scores & Buttons —— 更紧凑，字号+图标统一更小，不占顶部纵深 */}
      <div className="absolute top-0 left-0 right-0 px-1.5 md:px-3 pt-[max(0.3rem,env(safe-area-inset-top)] pt-1 md:pt-2.5 pointer-events-auto z-30">
        <div className="flex justify-between items-start gap-1.5">
          <div className="flex flex-col gap-0.5 md:gap-1">
            <div className="bg-white/90 backdrop-blur-md rounded-full px-1.5 md:px-2.5 py-0.5 md:py-1 flex items-center gap-0.5 md:gap-1 shadow-md border-2 border-white/50">
              <Trophy className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-yellow-500" />
              <span className="font-black text-gray-700 text-xs md:text-base">得分:{score}</span>
            </div>
            {streak > 1 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 backdrop-blur-md rounded-full px-1.5 md:px-2.5 py-0.5 md:py-0.5 flex items-center gap-0.5 shadow-md border-2 border-white/50 text-white w-fit"
              >
                <Flame className="w-2 h-2 md:w-2.5 md:h-2.5" />
                <span className="font-black text-[9px] md:text-xs">连对:{streak}</span>
                {streak >= 5 && <span className="text-[9px] md:text-xs">全屏</span>}
                {streak >= 3 && streak < 5 && <span className="text-[9px] md:text-xs">彩虹</span>}
              </motion.div>
            )}

            {mode === 'practice' && (
              <div className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-md backdrop-blur-md font-black text-white text-[9px] md:text-xs ${countdown <= 2 ? 'bg-red-500/90 animate-pulse' : 'bg-indigo-500/90'} w-fit`}>
                <Clock className="w-2 h-2 md:w-2.5 md:h-2.5" />
                <span>{countdown}s</span>
              </div>
            )}
            {isCoaching && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full font-black shadow-md flex items-center gap-0.5 md:gap-1 w-fit text-[9px] md:text-xs"
              >
                <Play className="w-2 h-2 md:w-2.5 md:h-2.5" />
                跟读三遍
              </motion.div>
            )}
          </div>

          <div className="flex gap-1 md:gap-1.5 items-start">
            {/* 学习模式 / 暂停切换按钮 */}
            <button 
              className={`rounded-full p-1.5 md:p-2 shadow-md border-2 border-white/50 transition-all active:scale-95 ${
                isPaused ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:brightness-110' : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
              onClick={() => {
                togglePause();
              }}
              title={isPaused ? "恢复自动切题" : "进入学习模式（可反复点例词，不自动下一题）"}
            >
              {isPaused ? <PlayCircle className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" /> : <Pause className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />}
            </button>

            {/* 标准发音按钮：学习模式下也永远可以点 */}
            <button 
              className="bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-md border-2 border-white/50 transition-all active:scale-95"
              onClick={() => playReadAudio(currentPinyin.chinese)}
              disabled={isExploding || isCoaching}
              title="标准发音"
            >
              <Volume2 className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-blue-500" />
            </button>
            
            <div className="relative group">
              <button className="bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-md border-2 border-white/50 transition-all active:scale-95">
                <Settings className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-gray-600" />
              </button>
              <div className="absolute right-0 mt-1.5 w-20 md:w-24 bg-white rounded-xl shadow-xl border-2 border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity overflow-hidden z-50">
                <button onClick={() => setDifficulty('beginner')} className={`w-full text-left px-2 py-1 hover:bg-blue-50 font-black text-xs ${difficulty === 'beginner' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'}`}>入门</button>
                <button onClick={() => setDifficulty('intermediate')} className={`w-full text-left px-2 py-1 hover:bg-blue-50 font-black text-xs ${difficulty === 'intermediate' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'}`}>基础</button>
                <button onClick={() => setDifficulty('advanced')} className={`w-full text-left px-2 py-1 hover:bg-blue-50 font-black text-xs ${difficulty === 'advanced' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'}`}>进阶</button>
              </div>
            </div>

            {mode === 'test' && (
              <button 
                onClick={endTest}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full px-1.5 md:px-2.5 py-1.5 md:py-2 shadow-md border-2 border-white/50 transition-all active:scale-95 font-black flex items-center gap-0.5 md:gap-1 text-[9px] md:text-xs"
              >
                <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden md:inline">结束</span>
              </button>
            )}
            <button 
              onClick={goToMenu}
              className="bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-md border-2 border-white/50 transition-all active:scale-95"
              title="返回主页"
            >
              <Home className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D 中央区：绝对安全！不渲染任何东西，只在出现答对/答错反馈时短暂弹窗 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20" style={{ top: "8%", bottom: "25%" }}>
        <AnimatePresence>
          {showFeedback === 'wrong' && (
            <motion.div
              key={'wrong-' + Date.now()}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              className="bg-white/95 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-3xl shadow-2xl border-4 border-red-200"
            >
              <span className="text-lg md:text-2xl font-black text-red-500">再试试哦~</span>
            </motion.div>
          )}
          {showFeedback === 'correct' && (
            <motion.div
              key={'correct-' + Date.now()}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: [1, 1.15, 1], opacity: 1, y: 0 }}
              transition={{ type: 'spring' }}
              exit={{ scale: 0.5, opacity: 0, y: -20 }}
              className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-3xl shadow-2xl border-4 bg-white/95 ${
                effectLevel === 'fullscreen' ? 'border-yellow-400 text-yellow-600' :
                effectLevel === 'rainbow' ? 'border-purple-400 text-purple-600' :
                'border-green-300 text-green-600'
              }`}
            >
              <span className="text-2xl md:text-4xl font-black drop-shadow">{currentPraiseText || praiseTexts[0].text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 组词+读作：贴屏幕最右下角 + 大幅缩窄压薄，绝对不占中央 3D 字母区域 */}
      <div className="absolute right-0 md:right-2 z-30 pointer-events-auto flex flex-col gap-1 w-[170px] sm:w-[200px] md:w-[260px]" style={{ bottom: "calc(env(safe-area-inset-bottom) + 190px)" }}>
        {/* 读作：卡片（紧凑薄版，贴右边） */}
        <motion.div 
          key={currentPinyin.pinyin + '-reading'}
          initial={{ opacity: 0, y: 10, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          className="bg-white/95 backdrop-blur rounded-lg md:rounded-xl px-1.5 md:px-2.5 py-1 md:py-1.5 shadow-xl border-2 border-white flex items-center gap-1 w-fit ml-auto"
        >
          <span className="text-xs md:text-lg font-black text-gray-700 whitespace-nowrap">
            读作：<span className="text-blue-600 text-base md:text-2xl">{currentPinyin.chinese}</span>
          </span>
          <button 
            onClick={() => playReadAudio(currentPinyin.chinese)}
            className="bg-blue-100 text-blue-600 rounded-full p-1 md:p-1.5 hover:bg-blue-200 shrink-0"
          >
            <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </motion.div>

        {/* 组词两张卡片：大幅缩窄 + 压薄，不遮挡中央字母 */}
        {currentPinyin.words.map((w, idx) => (
          <motion.div 
            key={`${w.spell}-${idx}`}
            initial={{ scale: 0, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.05 }}
            className="bg-white/95 backdrop-blur rounded-lg md:rounded-xl shadow-xl border-2 md:border-[3px] border-yellow-300 px-2 md:px-3 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 w-full hover:scale-[1.02] transition-transform ml-auto"
          >
            <div className="flex flex-col min-w-0 flex-1 items-end text-right">
              <span className="font-black text-xs md:text-lg text-purple-600 tracking-wide break-all leading-tight mb-0.5">
                {w.spell}
              </span>
              <span className="font-black text-lg md:text-2xl text-gray-800 break-all leading-tight">
                {w.text}
              </span>
            </div>
            <button 
              onClick={() => playReadAudio(w.text)}
              className="bg-yellow-100 text-yellow-700 rounded-full p-1 md:p-2 hover:bg-yellow-200 shrink-0 shadow border-2 border-yellow-200"
              title={`播放${w.text}发音`}
            >
              <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom: Options —— 贴最底部，移动端：内边距 + 选项按钮缩小以适配窄屏 */}
      <div className="absolute bottom-0 left-0 right-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] pb-3 md:pb-6 px-2 md:px-4 pointer-events-auto z-30">
        {/* 学习模式提示条 + 手动下一题按钮（移动端紧凑，按钮字号缩小） */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              key="learning-mode-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2 md:mb-3 max-w-3xl mx-auto"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full shadow-lg font-black text-[11px] md:text-base flex items-center gap-1 md:gap-2 border-2 md:border-4 border-white w-full sm:w-fit justify-center">
                👨‍🏫 学习模式：点击例词发音自由学习
              </div>
              <button 
                onClick={() => goNextManually()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm md:text-xl font-black px-4 md:px-5 py-1.5 md:py-2 rounded-full shadow-xl border-2 md:border-4 border-white hover:brightness-110 active:translate-y-0.5 transition-all flex items-center gap-1 md:gap-2 w-full sm:w-fit justify-center"
              >
                学完了 → 下一题
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-1 md:mb-2">
          <span className="bg-black/30 text-white px-2 md:px-3 py-0.5 rounded-full font-black text-[10px] md:text-xs backdrop-blur-sm">
            {mode === 'practice' 
              ? (isPaused ? '学习：自由点击组词学习，点按钮进入下一题' : '练习：选正确读音（答对立即下一题）')
              : (isPaused ? '学习模式：自由复习，点“下一题”继续测试' : '测试：请选择正确的读音')
            }
          </span>
        </div>
        <div className="grid grid-cols-2 md:flex md:justify-center gap-2 md:gap-3 md:flex-wrap max-w-3xl mx-auto">
          {options.map((opt, i) => (
            <motion.button
              key={`${currentPinyin.pinyin}-${opt}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => checkAnswer(opt)}
              disabled={isExploding || showFeedback !== null || isCoaching}
              className="bg-white border-b-[4px] md:border-b-[5px] border-blue-300 text-blue-600 text-lg md:text-2xl font-black py-2 md:py-3.5 px-3 md:px-6 rounded-xl md:rounded-2xl shadow-lg hover:bg-blue-50 hover:border-blue-400 disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto md:min-w-[70px] md:min-w-[90px]"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
