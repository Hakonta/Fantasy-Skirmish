import { useBattle } from '@/lib/stores/useBattle';

interface MenuBoxProps {
  children: React.ReactNode;
  className?: string;
}

function MenuBox({ children, className = '' }: MenuBoxProps) {
  return (
    <div 
      className={`bg-[#000033] border-4 border-[#4444aa] rounded-lg p-6 shadow-lg ${className}`}
      style={{
        boxShadow: 'inset 0 0 10px rgba(68, 68, 170, 0.5), 0 0 20px rgba(0, 0, 51, 0.8)'
      }}
    >
      {children}
    </div>
  );
}

export function VictoryScreen() {
  const phase = useBattle(state => state.phase);
  const enemies = useBattle(state => state.enemies);
  const initBattle = useBattle(state => state.initBattle);
  
  if (phase !== 'victory') {
    return null;
  }
  
  const totalExp = enemies.reduce((sum, e) => sum + e.expReward, 0);
  const totalGold = enemies.reduce((sum, e) => sum + e.goldReward, 0);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
      <MenuBox className="text-center min-w-80">
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">VICTORY!</h1>
        
        <div className="space-y-3 text-white font-mono mb-6">
          <div className="flex justify-between border-b border-[#4444aa] pb-2">
            <span>EXP Gained:</span>
            <span className="text-green-400">{totalExp}</span>
          </div>
          <div className="flex justify-between border-b border-[#4444aa] pb-2">
            <span>Gold Gained:</span>
            <span className="text-yellow-300">{totalGold}</span>
          </div>
        </div>
        
        <button
          onClick={initBattle}
          className="
            bg-[#4444aa] hover:bg-[#5555bb] 
            text-white font-bold py-3 px-8 rounded-lg
            transition-all duration-200
            border-2 border-[#6666cc]
          "
        >
          Fight Again
        </button>
      </MenuBox>
    </div>
  );
}

export function DefeatScreen() {
  const phase = useBattle(state => state.phase);
  const initBattle = useBattle(state => state.initBattle);
  
  if (phase !== 'defeat') {
    return null;
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
      <MenuBox className="text-center min-w-80">
        <h1 className="text-4xl font-bold text-red-500 mb-6">GAME OVER</h1>
        
        <div className="text-gray-300 font-mono mb-6">
          Your party has been defeated...
        </div>
        
        <button
          onClick={initBattle}
          className="
            bg-[#aa4444] hover:bg-[#bb5555] 
            text-white font-bold py-3 px-8 rounded-lg
            transition-all duration-200
            border-2 border-[#cc6666]
          "
        >
          Try Again
        </button>
      </MenuBox>
    </div>
  );
}

export function FleeScreen() {
  const phase = useBattle(state => state.phase);
  const initBattle = useBattle(state => state.initBattle);
  
  if (phase !== 'fled') {
    return null;
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
      <MenuBox className="text-center min-w-80">
        <h1 className="text-3xl font-bold text-gray-300 mb-6">ESCAPED!</h1>
        
        <div className="text-gray-400 font-mono mb-6">
          You fled from battle...
        </div>
        
        <button
          onClick={initBattle}
          className="
            bg-[#444466] hover:bg-[#555577] 
            text-white font-bold py-3 px-8 rounded-lg
            transition-all duration-200
            border-2 border-[#666688]
          "
        >
          Fight Again
        </button>
      </MenuBox>
    </div>
  );
}

export function StartScreen() {
  const phase = useBattle(state => state.phase);
  const initBattle = useBattle(state => state.initBattle);
  
  if (phase !== 'start') {
    return null;
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
      <MenuBox className="text-center min-w-96">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">RPG Battle System</h1>
        <p className="text-gray-300 font-mono mb-2">Classic Turn-Based Combat</p>
        
        <div className="text-left text-gray-400 font-mono text-sm my-6 space-y-1 border-t border-b border-[#4444aa] py-4">
          <p>Controls:</p>
          <p>- Click menu options to select actions</p>
          <p>- Click enemies to target them</p>
          <p>- Click allies for healing/items</p>
        </div>
        
        <button
          onClick={initBattle}
          className="
            bg-[#44aa44] hover:bg-[#55bb55] 
            text-white font-bold py-4 px-12 rounded-lg text-xl
            transition-all duration-200
            border-2 border-[#66cc66]
            animate-pulse
          "
        >
          Start Battle
        </button>
      </MenuBox>
    </div>
  );
}
