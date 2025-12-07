import { useBattle } from '@/lib/stores/useBattle';
import { Hero } from '@/lib/types/battle';

interface MenuBoxProps {
  children: React.ReactNode;
  className?: string;
}

function MenuBox({ children, className = '' }: MenuBoxProps) {
  return (
    <div 
      className={`bg-[#000033] border-4 border-[#4444aa] rounded-lg p-3 shadow-lg ${className}`}
      style={{
        boxShadow: 'inset 0 0 10px rgba(68, 68, 170, 0.5), 0 0 20px rgba(0, 0, 51, 0.8)'
      }}
    >
      {children}
    </div>
  );
}

interface MenuItemProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
}

function MenuItem({ label, onClick, disabled = false, selected = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left px-2 py-1 md:px-3 md:py-2 text-white font-mono text-sm md:text-lg
        transition-all duration-100
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#4444aa]/30'}
        ${selected ? 'bg-[#4444aa]/50' : ''}
        flex items-center gap-1 md:gap-2
      `}
    >
      <span className={`${selected ? 'text-yellow-400' : 'text-transparent'}`}>▶</span>
      {label}
    </button>
  );
}

export function CommandMenu() {
  const phase = useBattle(state => state.phase);
  const turnOrder = useBattle(state => state.turnOrder);
  const currentTurnIndex = useBattle(state => state.currentTurnIndex);
  const heroes = useBattle(state => state.heroes);
  const setPhase = useBattle(state => state.setPhase);
  const setSelectedCommand = useBattle(state => state.setSelectedCommand);
  const attemptFlee = useBattle(state => state.attemptFlee);
  
  const currentActor = turnOrder[currentTurnIndex];
  const currentHero = currentActor?.type === 'hero' 
    ? heroes.find(h => h.id === currentActor.id) 
    : null;
  
  if (phase !== 'player_command' || !currentHero) {
    return null;
  }
  
  const handleAttack = () => {
    setSelectedCommand('attack');
    setPhase('player_target');
  };
  
  const handleSkill = () => {
    setSelectedCommand('skill');
    setPhase('player_skill');
  };
  
  const handleItem = () => {
    setSelectedCommand('item');
    setPhase('player_item');
  };
  
  const handleFlee = () => {
    setSelectedCommand('flee');
    attemptFlee();
  };
  
  return (
    <MenuBox className="absolute bottom-4 left-4 w-40 md:w-48 z-10">
      <div className="text-yellow-400 font-bold mb-1 text-center border-b border-[#4444aa] pb-1 text-sm md:text-base">
        {currentHero.name}
      </div>
      <MenuItem label="Attack" onClick={handleAttack} />
      <MenuItem label={currentHero.skillCategory.name} onClick={handleSkill} />
      <MenuItem label="Item" onClick={handleItem} />
      <MenuItem label="Flee" onClick={handleFlee} />
    </MenuBox>
  );
}

export function SkillMenu() {
  const phase = useBattle(state => state.phase);
  const turnOrder = useBattle(state => state.turnOrder);
  const currentTurnIndex = useBattle(state => state.currentTurnIndex);
  const heroes = useBattle(state => state.heroes);
  const setPhase = useBattle(state => state.setPhase);
  const setSelectedSkill = useBattle(state => state.setSelectedSkill);
  const setSelectedCommand = useBattle(state => state.setSelectedCommand);
  
  const currentActor = turnOrder[currentTurnIndex];
  const currentHero = currentActor?.type === 'hero' 
    ? heroes.find(h => h.id === currentActor.id) 
    : null;
  
  if (phase !== 'player_skill' || !currentHero) {
    return null;
  }
  
  const handleSkillSelect = (skill: typeof currentHero.skillCategory.skills[0]) => {
    if (currentHero.mp < skill.mpCost) return;
    setSelectedSkill(skill);
  };
  
  const handleBack = () => {
    setSelectedCommand(null);
    setSelectedSkill(null);
    setPhase('player_command');
  };
  
  return (
    <MenuBox className="absolute bottom-4 left-44 md:left-56 w-52 md:w-64 z-20">
      <div className="text-yellow-400 font-bold mb-1 text-center border-b border-[#4444aa] pb-1 text-sm md:text-base">
        {currentHero.skillCategory.name}
      </div>
      {currentHero.skillCategory.skills.map(skill => (
        <MenuItem
          key={skill.id}
          label={`${skill.name} (${skill.mpCost} MP)`}
          onClick={() => handleSkillSelect(skill)}
          disabled={currentHero.mp < skill.mpCost}
        />
      ))}
      <div className="border-t border-[#4444aa] mt-1 pt-1">
        <MenuItem label="Back" onClick={handleBack} />
      </div>
    </MenuBox>
  );
}

export function ItemMenu() {
  const phase = useBattle(state => state.phase);
  const items = useBattle(state => state.items);
  const setPhase = useBattle(state => state.setPhase);
  const setSelectedItem = useBattle(state => state.setSelectedItem);
  const setSelectedCommand = useBattle(state => state.setSelectedCommand);
  
  if (phase !== 'player_item') {
    return null;
  }
  
  const availableItems = items.filter(item => item.quantity > 0);
  
  const handleItemSelect = (item: typeof items[0]) => {
    setSelectedItem(item);
  };
  
  const handleBack = () => {
    setSelectedCommand(null);
    setSelectedItem(null);
    setPhase('player_command');
  };
  
  return (
    <MenuBox className="absolute bottom-4 left-44 md:left-56 w-52 md:w-64 z-20">
      <div className="text-yellow-400 font-bold mb-1 text-center border-b border-[#4444aa] pb-1 text-sm md:text-base">
        Items
      </div>
      {availableItems.length === 0 ? (
        <div className="text-gray-400 text-center py-2 text-sm">No items</div>
      ) : (
        availableItems.map(item => (
          <MenuItem
            key={item.id}
            label={`${item.name} x${item.quantity}`}
            onClick={() => handleItemSelect(item)}
          />
        ))
      )}
      <div className="border-t border-[#4444aa] mt-1 pt-1">
        <MenuItem label="Back" onClick={handleBack} />
      </div>
    </MenuBox>
  );
}

export function TargetIndicator() {
  const phase = useBattle(state => state.phase);
  const selectedCommand = useBattle(state => state.selectedCommand);
  const selectedSkill = useBattle(state => state.selectedSkill);
  const selectedItem = useBattle(state => state.selectedItem);
  const setPhase = useBattle(state => state.setPhase);
  const setSelectedCommand = useBattle(state => state.setSelectedCommand);
  const setSelectedSkill = useBattle(state => state.setSelectedSkill);
  const setSelectedItem = useBattle(state => state.setSelectedItem);
  
  const isTargeting = phase === 'player_target' || 
    (phase === 'player_skill' && selectedSkill) ||
    (phase === 'player_item' && selectedItem);
  
  if (!isTargeting) return null;
  
  let targetType = '';
  if (selectedCommand === 'attack') {
    targetType = 'Select an enemy to attack';
  } else if (selectedSkill) {
    if (selectedSkill.target === 'single_enemy' || selectedSkill.target === 'all_enemies') {
      targetType = 'Select an enemy';
    } else {
      targetType = 'Select an ally';
    }
  } else if (selectedItem) {
    if (selectedItem.effect === 'revive') {
      targetType = 'Select a fallen ally to revive';
    } else {
      targetType = 'Select an ally';
    }
  }
  
  const handleCancel = () => {
    if (selectedCommand === 'attack') {
      setPhase('player_command');
      setSelectedCommand(null);
    } else if (selectedCommand === 'skill') {
      setPhase('player_skill');
      setSelectedSkill(null);
    } else if (selectedCommand === 'item') {
      setPhase('player_item');
      setSelectedItem(null);
    }
  };
  
  return (
    <MenuBox className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 max-w-[90vw]">
      <div className="text-white font-mono text-center text-xs md:text-base flex flex-col md:flex-row items-center gap-1 md:gap-4">
        <span>{targetType}</span>
        <button 
          onClick={handleCancel}
          className="text-gray-400 hover:text-white text-xs md:text-base"
        >
          [Cancel]
        </button>
      </div>
    </MenuBox>
  );
}

export function PartyStatus() {
  const heroes = useBattle(state => state.heroes);
  const phase = useBattle(state => state.phase);
  
  const hiddenPhases = ['start', 'victory', 'defeat', 'fled', 'player_target'];
  if (hiddenPhases.includes(phase)) {
    return null;
  }
  
  return (
    <MenuBox className="absolute bottom-4 right-4 w-56 md:w-72 z-10">
      <div className="text-yellow-400 font-bold mb-1 text-center border-b border-[#4444aa] pb-1 text-sm md:text-base">
        Party Status
      </div>
      {heroes.map(hero => (
        <div key={hero.id} className={`py-0.5 md:py-1 ${!hero.isAlive ? 'opacity-50' : ''}`}>
          <div className="flex justify-between text-white font-mono text-xs md:text-sm">
            <span>{hero.name}</span>
            <span>
              HP: {hero.hp}/{hero.maxHp}
            </span>
          </div>
          <div className="flex justify-between text-blue-300 font-mono text-xs">
            <span></span>
            <span>
              MP: {hero.mp}/{hero.maxMp}
            </span>
          </div>
          <div className="w-full h-1 bg-gray-700 rounded mt-0.5">
            <div 
              className="h-full rounded transition-all duration-300"
              style={{ 
                width: `${(hero.hp / hero.maxHp) * 100}%`,
                backgroundColor: hero.hp / hero.maxHp > 0.5 ? '#22c55e' : 
                                hero.hp / hero.maxHp > 0.25 ? '#eab308' : '#ef4444'
              }}
            />
          </div>
        </div>
      ))}
    </MenuBox>
  );
}

export function MessageLog() {
  const messages = useBattle(state => state.messages);
  const phase = useBattle(state => state.phase);
  
  if (phase === 'start' && messages.length === 0) {
    return null;
  }
  
  return (
    <MenuBox className="absolute top-4 right-4 w-64 md:w-80 max-h-32 md:max-h-40 overflow-hidden z-30">
      <div className="space-y-0.5 md:space-y-1">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id}
            className="text-white font-mono text-xs md:text-sm"
            style={{ opacity: 0.5 + (idx / messages.length) * 0.5 }}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </MenuBox>
  );
}
