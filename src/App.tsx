import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { useGameStore } from './store/gameStore';
import GameScene from './components/GameScene';
import UIOverlay from './components/UIOverlay';
import MenuScreen from './components/MenuScreen';
import ReportScreen from './components/ReportScreen';
import ThemeWrapper from './components/ThemeWrapper';

const SimpleCloud: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const groupPos = useMemo(() => position, [position]);
  return (
    <group position={groupPos} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
      <mesh position={[1.0, 0.2, 0]}>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
      <mesh position={[-1.0, 0.15, 0]}>
        <sphereGeometry args={[0.75, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
      <mesh position={[0.4, 0.5, 0]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
      <mesh position={[-0.4, 0.45, 0]}>
        <sphereGeometry args={[0.6, 16, 12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
    </group>
  );
};

const App: React.FC = () => {
  const { mode, theme, currentPinyin } = useGameStore();
  // 响应式判断移动端 / 桌面端，动态调整 3D 相机距离与视角
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // 移动端：相机拉远 + fov 调大，保证 3D 字母不被 UI 遮挡，看的更完整
  const mobileCam = {
    position: [0, 0, isMobile ? 11.5 : 8] as [number, number, number],
    fov: isMobile ? 55 : 45,
  };

  return (
    <ThemeWrapper theme={theme}>
      <div className="w-full h-full relative font-sans">
        {/* 3D Canvas 层 — z-index: 0 永远在最底层 */}
        <div className="absolute inset-0 z-0">
          <Canvas shadows camera={mobileCam} dpr={[1, 2]}>
            {theme === 'cloud' && (
            <>
              <color attach="background" args={['#87CEEB']} />
              <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
              {/* 云朵全部移到画面 4 个角落+远景位置，绝不和中央 3D 字母重叠 */}
              <SimpleCloud position={[-6.5, 4.5, -18]} scale={1.0} />
              <SimpleCloud position={[6.5, 5.5, -20]} scale={1.2} />
              <SimpleCloud position={[-7, -1, -22]} scale={0.9} />
              <SimpleCloud position={[7, -0.5, -19]} scale={1.1} />
            </>
          )}
            {theme === 'starry' && (
              <>
                <color attach="background" args={['#0B1F4A']} />
                <Stars radius={100} depth={50} count={isMobile ? 2500 : 5000} factor={4} saturation={0} fade speed={1} />
                <fog attach="fog" args={['#0B1F4A', 10, 50]} />
              </>
            )}
            {theme === 'forest' && (
              <>
                <color attach="background" args={['#86B560']} />
                <Sky sunPosition={[50, 20, 50]} turbidity={0.5} rayleigh={0.5} />
                <fog attach="fog" args={['#C1E1C1', 15, 40]} />
              </>
            )}

            <ambientLight intensity={theme === 'starry' ? 0.3 : 0.6} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={theme === 'starry' ? 0.5 : 1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            
            {currentPinyin && <GameScene />}
          </Canvas>
        </div>

        {/* 2D UI 层 — z-index: 1000 强制压在 Canvas 之上 */}
        <div className="absolute inset-0 z-[1000] pointer-events-none">
          <div className="w-full h-full pointer-events-auto">
            {mode === 'menu' && <MenuScreen />}
            {mode === 'report' && <ReportScreen />}
            {(mode === 'practice' || mode === 'test') && <UIOverlay />}
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default App;
