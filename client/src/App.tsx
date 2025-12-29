import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import "@fontsource/inter";
import {
  BattleScene,
  VictoryScreen,
  DefeatScreen,
  FleeScreen,
  StartScreen
} from "./components/battle";
import { BottomUI } from "./components/battle/BattleMenu";
import { useBattle } from "./lib/stores/useBattle";

function App() {
  const phase = useBattle(state => state.phase);

  useEffect(() => {
    console.log("Battle phase:", phase);
  }, [phase]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* 9:16 Aspect Ratio Container */}
      <div 
        className="relative bg-[#0a0a1a] shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: 'min(100vw, calc(var(--app-vh) * 100 * 9 / 16))',
          height: 'min(calc(var(--app-vh) * 100), calc(100vw * 16 / 9))',
        }}
      >
        <div className="flex-1 relative overflow-hidden">
          <Canvas
            shadows
            camera={{
              position: [0, 4, 15],
              fov: 45,
              near: 0.1,
              far: 100
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#0a0a1a"]} />
            <Suspense fallback={null}>
              <BattleScene />
            </Suspense>
          </Canvas>
        </div>

        <BottomUI />
        
        <StartScreen />
        <VictoryScreen />
        <DefeatScreen />
        <FleeScreen />
      </div>
    </div>
  );
}

export default App;
