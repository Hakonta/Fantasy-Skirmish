import { useBattle } from '@/lib/stores/useBattle';

interface MenuBoxProps {
  children: React.ReactNode;
  className?: string;
}

function MenuBox({ children, className = '' }: MenuBoxProps) {
  return (
    <div 
      className={`bg-[#000033] border-4 border-[#4444aa] rounded-lg shadow-lg ${className}`}
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
        w-full text-left px-2 py-1.5 text-white font-mono text-xs
        transition-all duration-100
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#4444aa]/30'}
        ${selected ? 'bg-[#4444aa]/50' : ''}
        flex items-center gap-1
      `}
    >
      <span className={`${selected ? 'text-yellow-400' : 'text-transparent'} text-sm`}>▶</span>
      <span className="text-xs">{label}</span>
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
    <MenuBox className="p-2">
      <div className="text-yellow-400 font-bold text-center border-b border-[#4444aa] pb-1 text-xs mb-1">
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
    <MenuBox className="p-2 max-h-64 overflow-y-auto">
      <div className="text-yellow-400 font-bold text-center border-b border-[#4444aa] pb-1 text-xs mb-1">
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
    <MenuBox className="p-2 max-h-64 overflow-y-auto">
      <div className="text-yellow-400 font-bold text-center border-b border-[#4444aa] pb-1 text-xs mb-1">
        Items
      </div>
      {availableItems.length === 0 ? (
        <div className="text-gray-400 text-center py-2 text-xs">No items</div>
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

export function PartyStatus() {
  const heroes = useBattle(state => state.heroes);
  const phase = useBattle(state => state.phase);
  
  const hiddenPhases = ['start', 'victory', 'defeat', 'fled'];
  if (hiddenPhases.includes(phase)) {
    return null;
  }
  
  return (
    <MenuBox className="p-2">
      <div className="text-yellow-400 font-bold text-center border-b border-[#4444aa] pb-1 text-xs mb-1">
        Party Status
      </div>
      {heroes.map(hero => (
        <div key={hero.id} className={`py-0.5 px-1 ${!hero.isAlive ? 'opacity-50' : ''}`}>
          <div className="flex justify-between text-white font-mono text-xs gap-2">
            <span className="flex-1 truncate">{hero.name}</span>
            <span className="text-xs whitespace-nowrap">
              {hero.hp}/{hero.maxHp}
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
    targetType = 'Select enemy';
  } else if (selectedSkill) {
    if (selectedSkill.target === 'single_enemy' || selectedSkill.target === 'all_enemies') {
      targetType = 'Select enemy';
    } else {
      targetType = 'Select ally';
    }
  } else if (selectedItem) {
    if (selectedItem.effect === 'revive') {
      targetType = 'Select fallen ally';
    } else {
      targetType = 'Select ally';
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
    <MenuBox className="p-2">
      <div className="text-white font-mono text-center text-xs flex items-center justify-center gap-2">
        <span>{targetType}</span>
        <button 
          onClick={handleCancel}
          className="text-gray-400 hover:text-white text-xs whitespace-nowrap"
        >
          [X]
        </button>
      </div>
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
    <MenuBox className="p-2 max-h-20 overflow-y-auto flex-shrink-0">
      <div className="space-y-0.5">
        {messages.slice(-3).map((msg) => (
          <div 
            key={msg.id}
            className="text-white font-mono text-xs"
            style={{ opacity: 0.7 }}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </MenuBox>
  );
}

// New unified bottom UI container
export function BottomUI() {
  const phase = useBattle(state => state.phase);
  
  const showUI = !['start', 'victory', 'defeat', 'fled'].includes(phase);
  
  if (!showUI) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-[100vh] flex flex-col pointer-events-auto bg-gradient-to-t from-black/80 to-transparent pt-96 p-2 gap-2">
        
        {/* Message Log at top of UI area */}
        <MessageLog />
        
        {/* Target Indicator */}
        <TargetIndicator />
        
        {/* Main Menu Row - Responsive */}
        <div className="flex gap-2 flex-col sm:flex-row">
          {/* Left side: Commands/Menus */}
          <div className="flex-1 flex gap-2 flex-col sm:flex-row min-w-0">
            <div className="flex-1 sm:w-40">
              <CommandMenu />
            </div>
            <div className="flex-1 sm:w-44 min-w-0">
              <SkillMenu />
              <ItemMenu />
            </div>
          </div>
          
          {/* Right side: Party Status */}
          <div className="w-full sm:w-48 flex-shrink-0">
            <PartyStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
