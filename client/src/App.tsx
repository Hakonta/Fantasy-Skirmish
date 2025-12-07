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
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
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

      <CommandMenu />
      <SkillMenu />
      <ItemMenu />
      <TargetIndicator />
      <PartyStatus />
      <MessageLog />
      
      <StartScreen />
      <VictoryScreen />
      <DefeatScreen />
      <FleeScreen />
    </div>
  );
}

export default App;
