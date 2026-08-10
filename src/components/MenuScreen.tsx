import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileCheck, Sun, Cloud, Trees, Sparkles, PlayCircle, Target } from 'lucide-react';
import { useGameStore, Theme } from '../store/gameStore';

const THEMES: { value: Theme; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'cloud', label: '云朵', icon: <Cloud className="w-5 h-5" />, color: 'bg-sky-400 text-white' },
  { value: 'starry', label: '星空', icon: <Sparkles className="w-5 h-5" />, color: 'bg-indigo-700 text-white' },
  { value: 'forest', label: '童话森林', icon: <Trees className="w-5 h-5" />, color: 'bg-green-500 text-white' }
];

const DIFFICULTIES: { value: 'beginner' | 'intermediate' | 'advanced'; label: string; desc: string }[] = [
  { value: 'beginner', label: '入门', desc: '单韵母 / 简单声母' },
  { value: 'intermediate', label: '基础', desc: '复韵母 / 翘舌声母' },
  { value: 'advanced', label: '进阶', desc: '整体认读音节 / 鼻音' }
];

const MenuScreen: React.FC = () => {
  const { theme, setTheme, difficulty, setDifficulty, startMode } = useGameStore();

  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-3 md:p-6 overflow-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-5 md:p-10 border-4 md:border-8 border-white my-4"
      >
        <div className="text-center mb-6 md:mb-8">
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="inline-block mb-3 md:mb-4"
          >
            <div className="text-5xl md:text-8xl font-black tracking-tight bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">
              3D拼音乐园
            </div>
          </motion.div>
          <p className="text-base md:text-2xl text-gray-600 font-bold">开口学拼音，越玩越上瘾 ✨</p>
        </div>

        {/* Theme Pick */}
        <div className="mb-5 md:mb-8">
          <h3 className="text-base md:text-xl font-black text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
            选择喜欢的场景
          </h3>
          <div className="flex gap-2 md:gap-3 flex-wrap">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all border-b-4 ${
                  theme === t.value
                    ? `${t.color} scale-105 border-black/20`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                } active:scale-95`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-5 md:mb-8">
          <h3 className="text-base md:text-xl font-black text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            选择学习难度
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className={`text-left p-3 md:p-5 rounded-xl md:rounded-2xl font-bold transition-all border-b-4 ${
                  difficulty === d.value
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500 text-white border-black/20 scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border-gray-200'
                } active:scale-95`}
              >
                <div className="text-xl md:text-2xl mb-1">{d.label}</div>
                <div className={`text-xs md:text-sm opacity-90 ${difficulty === d.value ? 'text-white' : 'text-gray-500'}`}>
                  {d.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startMode('practice')}
            className="group relative overflow-hidden p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 text-white shadow-2xl border-b-6 md:border-b-8 border-emerald-700/50"
          >
            <div className="absolute -right-4 -top-4 md:-right-6 md:-top-6 text-6xl md:text-8xl opacity-20 group-hover:rotate-12 transition-transform">🌈</div>
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              <div className="bg-white/30 backdrop-blur p-2.5 md:p-4 rounded-2xl md:rounded-3xl">
                <BookOpen className="w-7 h-7 md:w-10 md:h-10" />
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-4xl font-black">练习模式</div>
                <div className="text-sm md:text-lg opacity-95 mt-0.5 md:mt-1 font-bold">跟读+辅导·零基础入门</div>
              </div>
            </div>
            <div className="mt-3 md:mt-5 flex items-center gap-1 md:gap-2 text-white/90 relative z-10 font-bold text-sm md:text-base">
              <PlayCircle className="w-4 h-4 md:w-5 md:h-5" /> 点击开始快乐学习
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => startMode('test')}
            className="group relative overflow-hidden p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-pink-400 via-rose-400 to-orange-400 text-white shadow-2xl border-b-6 md:border-b-8 border-rose-700/50"
          >
            <div className="absolute -right-4 -top-4 md:-right-6 md:-top-6 text-6xl md:text-8xl opacity-20 group-hover:rotate-12 transition-transform">🏆</div>
            <div className="flex items-center gap-3 md:gap-4 relative z-10">
              <div className="bg-white/30 backdrop-blur p-2.5 md:p-4 rounded-2xl md:rounded-3xl">
                <FileCheck className="w-7 h-7 md:w-10 md:h-10" />
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-4xl font-black">测试模式</div>
                <div className="text-sm md:text-lg opacity-95 mt-0.5 md:mt-1 font-bold">答题闯关·检查学习成果</div>
              </div>
            </div>
            <div className="mt-3 md:mt-5 flex items-center gap-1 md:gap-2 text-white/90 relative z-10 font-bold text-sm md:text-base">
              <PlayCircle className="w-4 h-4 md:w-5 md:h-5" /> 挑战你的拼音实力
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuScreen;
