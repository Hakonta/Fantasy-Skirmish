import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import "@fontsource/inter";
import {
  BattleScene,
  CommandMenu,
  SkillMenu,
  ItemMenu,
  TargetIndicator,
  PartyStatus,
  MessageLog,
  VictoryScreen,
  DefeatScreen,
  FleeScreen,
  StartScreen
} from "./components/battle";
import { useBattle } from "./lib/stores/useBattle";

function App() {
  const phase = useBattle(state => state.phase);

  useEffect(() => {
    console.log("Battle phase:", phase);
  }, [phase]);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Portrait-first 9:16 battlefield with letterboxing */}
      <div
        className="relative bg-black overflow-hidden"
        style={{
          width: "min(100vw, calc(100vh * 0.5625))", // 9/16
          height: "min(100vh, calc(100vw * 1.7777778))", // 16/9
        }}
      >
        <Canvas
          shadows
          camera={{
            position: [0, 5, 12],
            fov: 50,
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

        {/* UI overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 right-2">
            <TargetIndicator className="mx-auto w-fit max-w-full" />
          </div>

          <div className="absolute top-2 left-2 right-2 flex justify-end">
            <MessageLog className="max-w-[85%]" />
          </div>

          <div
            className="absolute inset-x-0 bottom-0 p-2"
            style={{
              paddingBottom: "max(8px, env(safe-area-inset-bottom))"
            }}
          >
            <div className="grid grid-cols-2 gap-2 items-end">
              <PartyStatus />
              <div className="space-y-2">
                <CommandMenu />
                <SkillMenu />
                <ItemMenu />
              </div>
            </div>
          </div>
        </div>
        
        <StartScreen />
        <VictoryScreen />
        <DefeatScreen />
        <FleeScreen />
      </div>
    </div>
  );
}

export default App;
