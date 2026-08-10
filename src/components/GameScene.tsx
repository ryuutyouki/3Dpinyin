import React from 'react';
import { Text3D, Center } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import Explosion from './Explosion';
import { playTTS } from '../utils/tts';

const FONT_URL = `${import.meta.env.BASE_URL}fonts/helvetiker_bold.typeface.json`.replace(/\/+/g, '/').replace('http:/', 'http://').replace('https:/', 'https://');

const playStandard = (text: string) => {
  playTTS(text, 4).catch(() => {});
};

const PinyinModel: React.FC<{ text: string; theme: string; chinese: string }> = ({ text, theme, chinese }) => {
  const color = 
    theme === 'starry' ? '#FFD700' :
    theme === 'forest' ? '#2E7D32' :
    '#E91E63';

  // 动态调整尺寸（UI遮挡问题优化后放大字母，让字母更清晰突出 */
  const size = text.length >= 3 ? 1.35 : text.length >= 2 ? 1.7 : 2.3;
  const safeGlyphText = text.replace(/ü/g, 'ϋ');

  // 彻底移除 Float 浮动组件，防止乱动、遮挡；并整体下移，避开顶栏
  // 固定位置，不做任何旋转
  return (
    <group 
      position={[0, -0.5, 0]}
      onClick={(e) => { 
        e.stopPropagation();
        playStandard(chinese);
      }} 
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <Center>
        <Text3D
          font={FONT_URL}
          size={size}
          height={0.45}
          curveSegments={16}
          bevelEnabled
          bevelThickness={0.08}
          bevelSize={0.06}
          bevelOffset={0}
          bevelSegments={8}
        >
          {safeGlyphText}
          <meshStandardMaterial 
            color={color} 
            roughness={0.25} 
            metalness={0.35}
            emissive={color}
            emissiveIntensity={0.08}
          />
        </Text3D>
      </Center>
    </group>
  );
};

const GameScene: React.FC = () => {
  const { currentPinyin, isExploding, theme } = useGameStore();
  return (
    <group>
      {!isExploding && currentPinyin && <PinyinModel text={currentPinyin.pinyin} chinese={currentPinyin.chinese} theme={theme} />}
      {isExploding && <Explosion />}
    </group>
  );
};

export default GameScene;
