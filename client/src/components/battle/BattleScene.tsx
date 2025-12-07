import { Suspense } from 'react';
import { CharacterSprite } from './CharacterSprite';
import { useBattle } from '@/lib/stores/useBattle';
import { Text } from '@react-three/drei';

export function BattleScene() {
  const heroes = useBattle(state => state.heroes);
  const enemies = useBattle(state => state.enemies);
  const phase = useBattle(state => state.phase);
  const turnOrder = useBattle(state => state.turnOrder);
  const currentTurnIndex = useBattle(state => state.currentTurnIndex);
  const selectedCommand = useBattle(state => state.selectedCommand);
  const selectedSkill = useBattle(state => state.selectedSkill);
  const selectedItem = useBattle(state => state.selectedItem);
  
  const executeAttack = useBattle(state => state.executeAttack);
  const executeSkill = useBattle(state => state.executeSkill);
  const useItem = useBattle(state => state.useItem);
  
  const currentActor = turnOrder[currentTurnIndex];
  
  const handleEnemyClick = (enemyId: string) => {
    if (phase !== 'player_target' && phase !== 'player_skill') return;
    if (!currentActor || currentActor.type !== 'hero') return;
    
    if (selectedCommand === 'attack') {
      executeAttack(currentActor.id, 'hero', enemyId);
    } else if (selectedCommand === 'skill' && selectedSkill) {
      if (selectedSkill.target === 'single_enemy') {
        executeSkill(currentActor.id, 'hero', selectedSkill, [enemyId]);
      } else if (selectedSkill.target === 'all_enemies') {
        const aliveEnemyIds = enemies.filter(e => e.isAlive).map(e => e.id);
        executeSkill(currentActor.id, 'hero', selectedSkill, aliveEnemyIds);
      }
    }
  };
  
  const handleHeroClick = (heroId: string) => {
    if (phase !== 'player_skill' && phase !== 'player_item') return;
    if (!currentActor || currentActor.type !== 'hero') return;
    
    if (selectedCommand === 'skill' && selectedSkill) {
      if (selectedSkill.target === 'single_ally') {
        executeSkill(currentActor.id, 'hero', selectedSkill, [heroId]);
      } else if (selectedSkill.target === 'all_allies') {
        const aliveHeroIds = heroes.filter(h => h.isAlive).map(h => h.id);
        executeSkill(currentActor.id, 'hero', selectedSkill, aliveHeroIds);
      }
    } else if (selectedCommand === 'item' && selectedItem) {
      useItem(selectedItem, heroId);
    }
  };
  
  const isTargetingEnemy = phase === 'player_target' || 
    (phase === 'player_skill' && selectedSkill && 
      (selectedSkill.target === 'single_enemy' || selectedSkill.target === 'all_enemies'));
  
  const isTargetingAlly = (phase === 'player_skill' && selectedSkill &&
      (selectedSkill.target === 'single_ally' || selectedSkill.target === 'all_allies')) ||
    (phase === 'player_item' && selectedItem);
  
  const isReviveItem = selectedItem?.effect === 'revive';
  
  const canTargetHero = (hero: typeof heroes[0]) => {
    if (!isTargetingAlly) return false;
    if (isReviveItem) {
      return !hero.isAlive;
    }
    return hero.isAlive;
  };
  
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#88aaff" />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#2d4a3e" />
      </mesh>
      
      <mesh position={[0, 4, -8]}>
        <planeGeometry args={[30, 12]} />
        <meshBasicMaterial color="#1a1a2e" />
      </mesh>
      
      <Text
        position={[0, 6, -7.9]}
        fontSize={0.8}
        color="#334466"
        anchorX="center"
        anchorY="middle"
      >
        ~ Battle Arena ~
      </Text>
      
      {heroes.map((hero, index) => {
        const xPos = -5;
        const yPos = 0;
        const zPos = -2 + index * 2;
        const isCurrentTurn = currentActor?.id === hero.id && currentActor?.type === 'hero';
        
        return (
          <CharacterSprite
            key={hero.id}
            position={[xPos, yPos, zPos]}
            color={hero.color}
            name={hero.name}
            hp={hero.hp}
            maxHp={hero.maxHp}
            isActive={isCurrentTurn}
            isAlive={hero.isAlive}
            isEnemy={false}
            onClick={canTargetHero(hero) ? () => handleHeroClick(hero.id) : undefined}
          />
        );
      })}
      
      {enemies.map((enemy, index) => {
        const xPos = 5;
        const yPos = 0;
        const zPos = -2 + index * 2;
        const isCurrentTurn = currentActor?.id === enemy.id && currentActor?.type === 'enemy';
        
        return (
          <CharacterSprite
            key={enemy.id}
            position={[xPos, yPos, zPos]}
            color={enemy.color}
            name={enemy.name}
            hp={enemy.hp}
            maxHp={enemy.maxHp}
            isActive={isCurrentTurn}
            isAlive={enemy.isAlive}
            isEnemy={true}
            onClick={isTargetingEnemy && enemy.isAlive ? () => handleEnemyClick(enemy.id) : undefined}
          />
        );
      })}
    </Suspense>
  );
}
