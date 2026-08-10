import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, FileText, Flame, Star, Frown } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

const ReportScreen: React.FC = () => {
  const { testStats, goToMenu } = useGameStore();
  const { totalQuestions, correctCount, maxStreak, wrongList } = testStats;
  const rate = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  const getScore = () => {
    if (rate >= 90) return { emoji: '🏆', text: '拼音小专家！', color: 'from-yellow-400 to-orange-500' };
    if (rate >= 75) return { emoji: '🌟', text: '超级厉害！', color: 'from-pink-400 to-purple-500' };
    if (rate >= 60) return { emoji: '👍', text: '表现不错！', color: 'from-green-400 to-teal-500' };
    return { emoji: '💪', text: '继续加油！', color: 'from-sky-400 to-blue-500' };
  };
  const score = getScore();

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-5 md:p-10 border-4 md:border-8 border-white my-4"
      >
        <div className="text-center mb-5 md:mb-6">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
            className="inline-block text-6xl md:text-8xl mb-2 md:mb-3"
          >
            {score.emoji}
          </motion.div>
          <div className={`text-3xl md:text-5xl font-black bg-gradient-to-r ${score.color} bg-clip-text text-transparent`}>
            {score.text}
          </div>
          <div className="text-gray-500 mt-1 md:mt-2 text-sm md:text-lg font-bold">测试报告</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-5 md:mb-8">
          <Stat icon={<FileText className="w-4 h-4 md:w-5 md:h-5" />} value={`${totalQuestions}`} label="总题数" color="text-blue-500 bg-blue-50" />
          <Stat icon={<Trophy className="w-4 h-4 md:w-5 md:h-5" />} value={`${correctCount}`} label="答对" color="text-green-500 bg-green-50" />
          <Stat icon={<Star className="w-4 h-4 md:w-5 md:h-5" />} value={`${rate}%`} label="正确率" color="text-yellow-600 bg-yellow-50" />
          <Stat icon={<Flame className="w-4 h-4 md:w-5 md:h-5" />} value={`${maxStreak}`} label="最高连对" color="text-orange-500 bg-orange-50" />
        </div>

        {wrongList.length > 0 && (
          <div className="mb-5 md:mb-8 p-3 md:p-5 rounded-xl md:rounded-2xl bg-red-50 border-2 md:border-4 border-red-100">
            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3 text-red-500 font-black text-sm md:text-base">
              <Frown className="w-5 h-5 md:w-6 md:h-6" /> 这些拼音需要多加练习哦：
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {wrongList.map(py => (
                <span key={py} className="bg-white text-red-500 px-2.5 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-black text-base md:text-xl shadow-sm border border-red-100">
                  {py}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 md:gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToMenu}
            className="flex items-center gap-1.5 md:gap-2 px-5 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xl border-b-4 border-indigo-800/40"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" /> 返回主页
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; value: string; label: string; color: string }> = ({ icon, value, label, color }) => (
  <div className={`rounded-xl md:rounded-2xl p-2 md:p-4 text-center ${color}`}>
    <div className="flex items-center justify-center mb-1 opacity-70">{icon}</div>
    <div className="text-2xl md:text-3xl font-black">{value}</div>
    <div className="text-xs md:text-sm font-bold opacity-70 mt-0.5 md:mt-1">{label}</div>
  </div>
);

export default ReportScreen;
