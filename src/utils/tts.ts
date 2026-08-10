/**
 * 标准中文云端 TTS 发音引擎（单引擎统一版）
 * 只用百度翻译公共 TTS（标准普通话女声），彻底移除浏览器本地机械音 fallback。
 * 避免“两套引擎同时发声 / 机械音插进来 / 音色不统一”的问题。
 */

// 音频缓存池，避免重复请求
const audioCache = new Map<string, string>();
// 正在播放的音频实例，用于快速停止 / 防止并发两套播放
let currentAudio: HTMLAudioElement | null = null;
// 当前执行 session id，防止旧的 playTTS 还没 resolve 就触发下一次导致双重发声
let currentSessionId = 0;

/**
 * 播放标准普通话发音
 * @param text 需要发音的标准汉字（如：玻、坡、啊、鸡蛋）
 * @param speed 语速 (3-慢，5-正常，7-快)，儿童教学建议 4
 */
export const playTTS = (text: string, speed: number = 4): Promise<void> => {
  return new Promise((resolve) => {
    if (!text) return resolve();
    currentSessionId++;
    const mySession = currentSessionId;

    // 立刻停止上一个正在播放的发音（保证单次只能有一个引擎发音，绝不同步两套）
    stopSpeaking();

    // --- 单引擎：只使用云端标准 TTS (百度翻译公共接口) ---
    // 这是标准普通话女声，绝不会出现浏览器本地机械音
    const cacheKey = `${text}-${speed}`;
    let src = audioCache.get(cacheKey);
    
    if (!src) {
      src = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURIComponent(text)}&spd=${speed}&source=web`;
      audioCache.set(cacheKey, src);
    }

    const audio = new Audio(src);
    audio.crossOrigin = "anonymous";
    audio.volume = 1.0;
    currentAudio = audio;

    // 3s 超时兜底：如果网络不好加载不出来，直接 resolve 结束（不 fallback 本地机械音）
    const timer = setTimeout(() => {
      if (mySession !== currentSessionId) { resolve(); return; }
      try { audio.pause(); } catch {}
      resolve();
    }, 3000);

    audio.addEventListener('ended', () => {
      clearTimeout(timer);
      if (mySession === currentSessionId) resolve();
    });

    audio.addEventListener('canplaythrough', () => {
      if (mySession !== currentSessionId) { clearTimeout(timer); resolve(); return; }
      audio.play().catch(() => {
        clearTimeout(timer);
        resolve();
      });
    });

    // 加载错误：静默 resolve，不再 fallback 本地机械音
    audio.addEventListener('error', () => {
      clearTimeout(timer);
      if (mySession === currentSessionId) resolve();
    });

    // 触发加载
    try { audio.load(); } catch { clearTimeout(timer); resolve(); }
  });
};

/**
 * 停止所有正在播放的发音
 * （方案1：纯云端单引擎，不再调用任何本地 speechSynthesis，彻底杜绝机械音）
 */
export const stopSpeaking = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
};
