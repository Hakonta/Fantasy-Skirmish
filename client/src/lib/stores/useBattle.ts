import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  Hero,
  Enemy,
  Item,
  BattlePhase,
  BattleAction,
  TurnOrder,
  BattleMessage,
  CommandType,
  Skill
} from '../types/battle';
import { initialHeroes, initialEnemies, initialItems } from '../data/gameData';

interface BattleState {
  heroes: Hero[];
  enemies: Enemy[];
  items: Item[];
  phase: BattlePhase;
  turnOrder: TurnOrder[];
  currentTurnIndex: number;
  currentHeroIndex: number;
  selectedCommand: CommandType | null;
  selectedSkill: Skill | null;
  selectedItem: Item | null;
  pendingActions: BattleAction[];
  fleeAttempts: number;
  fleeReadyHeroIds: string[];
  messages: BattleMessage[];
  
  initBattle: () => void;
  calculateTurnOrder: () => void;
  nextTurn: () => void;
  
  setPhase: (phase: BattlePhase) => void;
  setSelectedCommand: (command: CommandType | null) => void;
  setSelectedSkill: (skill: Skill | null) => void;
  setSelectedItem: (item: Item | null) => void;
  
  executeAttack: (actorId: string, actorType: 'hero' | 'enemy', targetId: string) => void;
  executeSkill: (actorId: string, actorType: 'hero' | 'enemy', skill: Skill, targetIds: string[]) => void;
  useItem: (item: Item, targetId: string) => void;
  chooseFlee: (heroId: string) => void;
  attemptFlee: () => boolean;
  
  enemyTakeTurn: () => void;
  
  addMessage: (text: string) => void;
  clearMessages: () => void;
  
  checkBattleEnd: () => 'victory' | 'defeat' | 'ongoing';
  
  getAliveHeroes: () => Hero[];
  getAliveEnemies: () => Enemy[];
  getCurrentActor: () => TurnOrder | null;
}

export const useBattle = create<BattleState>()(
  subscribeWithSelector((set, get) => ({
    heroes: [],
    enemies: [],
    items: [],
    phase: 'start',
    turnOrder: [],
    currentTurnIndex: 0,
    currentHeroIndex: 0,
    selectedCommand: null,
    selectedSkill: null,
    selectedItem: null,
    pendingActions: [],
    fleeAttempts: 0,
    fleeReadyHeroIds: [],
    messages: [],
    
    initBattle: () => {
      const heroes = JSON.parse(JSON.stringify(initialHeroes)) as Hero[];
      const enemies = JSON.parse(JSON.stringify(initialEnemies)) as Enemy[];
      const items = JSON.parse(JSON.stringify(initialItems)) as Item[];
      
      set({
        heroes,
        enemies,
        items,
        phase: 'start',
        turnOrder: [],
        currentTurnIndex: 0,
        currentHeroIndex: 0,
        selectedCommand: null,
        selectedSkill: null,
        selectedItem: null,
        pendingActions: [],
        fleeAttempts: 0,
        fleeReadyHeroIds: [],
        messages: []
      });
      
      get().addMessage('Battle Start!');
      
      setTimeout(() => {
        get().calculateTurnOrder();
      }, 1000);
    },
    
    calculateTurnOrder: () => {
      const { heroes, enemies } = get();
      
      const aliveHeroes = heroes.filter(h => h.isAlive);
      const aliveEnemies = enemies.filter(e => e.isAlive);
      
      const heroTurns: TurnOrder[] = aliveHeroes.map(h => ({
        id: h.id,
        type: 'hero' as const,
        agility: h.agility
      }));
      
      const enemyTurns: TurnOrder[] = aliveEnemies.map(e => ({
        id: e.id,
        type: 'enemy' as const,
        agility: e.agility
      }));
      
      const allTurns = [...heroTurns, ...enemyTurns];
      allTurns.sort((a, b) => b.agility - a.agility);
      
      set({
        turnOrder: allTurns,
        currentTurnIndex: 0,
        phase: 'turn_order',
        fleeReadyHeroIds: []
      });
      
      setTimeout(() => {
        get().nextTurn();
      }, 500);
    },
    
    nextTurn: () => {
      const { turnOrder, currentTurnIndex, heroes, enemies } = get();
      
      const result = get().checkBattleEnd();
      if (result === 'victory') {
        set({ phase: 'victory' });
        get().addMessage('Victory!');
        return;
      }
      if (result === 'defeat') {
        set({ phase: 'defeat' });
        get().addMessage('Defeated...');
        return;
      }
      
      if (currentTurnIndex >= turnOrder.length) {
        get().calculateTurnOrder();
        return;
      }
      
      const currentActor = turnOrder[currentTurnIndex];
      
      if (currentActor.type === 'hero') {
        const hero = heroes.find(h => h.id === currentActor.id);
        if (!hero || !hero.isAlive) {
          set({ currentTurnIndex: currentTurnIndex + 1 });
          get().nextTurn();
          return;
        }
        get().addMessage(`${hero.name}'s turn`);
        set({
          phase: 'player_command',
          selectedCommand: null,
          selectedSkill: null,
          selectedItem: null
        });
      } else {
        const enemy = enemies.find(e => e.id === currentActor.id);
        if (!enemy || !enemy.isAlive) {
          set({ currentTurnIndex: currentTurnIndex + 1 });
          get().nextTurn();
          return;
        }
        set({ phase: 'enemy_turn' });
        setTimeout(() => {
          get().enemyTakeTurn();
        }, 800);
      }
    },
    
    setPhase: (phase) => set({ phase }),
    setSelectedCommand: (command) => set({ selectedCommand: command }),
    setSelectedSkill: (skill) => set({ selectedSkill: skill }),
    setSelectedItem: (item) => set({ selectedItem: item }),
    
    executeAttack: (actorId, actorType, targetId) => {
      // Any non-flee action cancels a pending "all heroes flee" attempt.
      if (actorType === 'hero') {
        set({ fleeReadyHeroIds: [] });
      }

      const { heroes, enemies } = get();
      
      let attacker: Hero | Enemy | undefined;
      let defender: Hero | Enemy | undefined;
      
      if (actorType === 'hero') {
        attacker = heroes.find(h => h.id === actorId);
        defender = enemies.find(e => e.id === targetId);
      } else {
        attacker = enemies.find(e => e.id === actorId);
        defender = heroes.find(h => h.id === targetId);
      }
      
      if (!attacker || !defender) return;
      
      const baseDamage = attacker.strength * 2;
      const defense = defender.toughness;
      const variance = 0.9 + Math.random() * 0.2;
      const damage = Math.max(1, Math.floor((baseDamage - defense) * variance));
      
      get().addMessage(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);
      
      if (actorType === 'hero') {
        set({
          enemies: enemies.map(e => {
            if (e.id === targetId) {
              const newHp = Math.max(0, e.hp - damage);
              const isAlive = newHp > 0;
              if (!isAlive) {
                setTimeout(() => get().addMessage(`${e.name} is defeated!`), 300);
              }
              return { ...e, hp: newHp, isAlive };
            }
            return e;
          })
        });
      } else {
        set({
          heroes: heroes.map(h => {
            if (h.id === targetId) {
              const newHp = Math.max(0, h.hp - damage);
              const isAlive = newHp > 0;
              if (!isAlive) {
                setTimeout(() => get().addMessage(`${h.name} has fallen!`), 300);
              }
              return { ...h, hp: newHp, isAlive };
            }
            return h;
          })
        });
      }
      
      set({ phase: 'executing' });
      setTimeout(() => {
        set({ currentTurnIndex: get().currentTurnIndex + 1 });
        get().nextTurn();
      }, 1200);
    },
    
    executeSkill: (actorId, actorType, skill, targetIds) => {
      // Any non-flee action cancels a pending "all heroes flee" attempt.
      if (actorType === 'hero') {
        set({ fleeReadyHeroIds: [] });
      }

      const { heroes, enemies } = get();
      
      let caster: Hero | Enemy | undefined;
      
      if (actorType === 'hero') {
        caster = heroes.find(h => h.id === actorId);
      } else {
        caster = enemies.find(e => e.id === actorId);
      }
      
      if (!caster) return;
      
      if (caster.mp < skill.mpCost) {
        get().addMessage(`Not enough MP!`);
        set({ phase: 'player_command' });
        return;
      }
      
      if (actorType === 'hero') {
        set({
          heroes: heroes.map(h => 
            h.id === actorId ? { ...h, mp: h.mp - skill.mpCost } : h
          )
        });
      }
      
      get().addMessage(`${caster.name} uses ${skill.name}!`);
      
      if (skill.type === 'healing') {
        const healAmount = Math.floor(skill.power + caster.magic * 0.5);
        
        set({
          heroes: heroes.map(h => {
            if (targetIds.includes(h.id) && h.isAlive) {
              const newHp = Math.min(h.maxHp, h.hp + healAmount);
              setTimeout(() => get().addMessage(`${h.name} recovers ${healAmount} HP!`), 300);
              return { ...h, hp: newHp };
            }
            return h;
          })
        });
      } else {
        const isMagical = skill.type === 'magical';
        const baseDamage = isMagical 
          ? skill.power + caster.magic * 1.5
          : skill.power + caster.strength * 1.2;
        
        if (actorType === 'hero') {
          set({
            enemies: enemies.map(e => {
              if (targetIds.includes(e.id) && e.isAlive) {
                const defense = isMagical ? e.magicResistance : e.toughness;
                const variance = 0.9 + Math.random() * 0.2;
                const damage = Math.max(1, Math.floor((baseDamage - defense * 0.5) * variance));
                const newHp = Math.max(0, e.hp - damage);
                const isAlive = newHp > 0;
                
                setTimeout(() => {
                  get().addMessage(`${e.name} takes ${damage} damage!`);
                  if (!isAlive) {
                    setTimeout(() => get().addMessage(`${e.name} is defeated!`), 300);
                  }
                }, 300);
                
                return { ...e, hp: newHp, isAlive };
              }
              return e;
            })
          });
        } else {
          set({
            heroes: heroes.map(h => {
              if (targetIds.includes(h.id) && h.isAlive) {
                const defense = isMagical ? h.magicResistance : h.toughness;
                const variance = 0.9 + Math.random() * 0.2;
                const damage = Math.max(1, Math.floor((baseDamage - defense * 0.5) * variance));
                const newHp = Math.max(0, h.hp - damage);
                const isAlive = newHp > 0;
                
                setTimeout(() => {
                  get().addMessage(`${h.name} takes ${damage} damage!`);
                  if (!isAlive) {
                    setTimeout(() => get().addMessage(`${h.name} has fallen!`), 300);
                  }
                }, 300);
                
                return { ...h, hp: newHp, isAlive };
              }
              return h;
            })
          });
        }
      }
      
      set({ phase: 'executing' });
      setTimeout(() => {
        set({ currentTurnIndex: get().currentTurnIndex + 1 });
        get().nextTurn();
      }, 1500);
    },
    
    useItem: (item, targetId) => {
      // Any non-flee action cancels a pending "all heroes flee" attempt.
      set({ fleeReadyHeroIds: [] });

      const { heroes, items } = get();
      
      const itemInInventory = items.find(i => i.id === item.id);
      if (!itemInInventory || itemInInventory.quantity <= 0) {
        get().addMessage('No items left!');
        return;
      }
      
      const target = heroes.find(h => h.id === targetId);
      if (!target) return;
      
      get().addMessage(`Used ${item.name} on ${target.name}!`);
      
      set({
        items: items.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
        )
      });
      
      if (item.effect === 'heal_hp') {
        set({
          heroes: heroes.map(h => {
            if (h.id === targetId && h.isAlive) {
              const newHp = Math.min(h.maxHp, h.hp + item.power);
              setTimeout(() => get().addMessage(`${h.name} recovers ${item.power} HP!`), 300);
              return { ...h, hp: newHp };
            }
            return h;
          })
        });
      } else if (item.effect === 'heal_mp') {
        set({
          heroes: heroes.map(h => {
            if (h.id === targetId && h.isAlive) {
              const newMp = Math.min(h.maxMp, h.mp + item.power);
              setTimeout(() => get().addMessage(`${h.name} recovers ${item.power} MP!`), 300);
              return { ...h, mp: newMp };
            }
            return h;
          })
        });
      } else if (item.effect === 'revive') {
        set({
          heroes: heroes.map(h => {
            if (h.id === targetId && !h.isAlive) {
              const newHp = Math.floor(h.maxHp * (item.power / 100));
              setTimeout(() => get().addMessage(`${h.name} is revived!`), 300);
              return { ...h, hp: newHp, isAlive: true };
            }
            return h;
          })
        });
      }
      
      set({ phase: 'executing' });
      setTimeout(() => {
        set({ currentTurnIndex: get().currentTurnIndex + 1 });
        get().nextTurn();
      }, 1200);
    },
    
    attemptFlee: () => {
      const { fleeAttempts, enemies } = get();
      
      const avgEnemyAgility = enemies.reduce((sum, e) => sum + e.agility, 0) / enemies.length;
      const { heroes } = get();
      const avgHeroAgility = heroes.reduce((sum, h) => sum + h.agility, 0) / heroes.length;
      
      const fleeChance = 0.3 + (avgHeroAgility - avgEnemyAgility) * 0.02 + fleeAttempts * 0.1;
      const success = Math.random() < fleeChance;
      
      if (success) {
        get().addMessage('Escaped successfully!');
        set({ phase: 'fled' });
        return true;
      } else {
        get().addMessage('Couldn\'t escape!');
        set({ fleeAttempts: fleeAttempts + 1, phase: 'executing', fleeReadyHeroIds: [] });
        setTimeout(() => {
          set({ currentTurnIndex: get().currentTurnIndex + 1 });
          get().nextTurn();
        }, 1000);
        return false;
      }
    },

    chooseFlee: (heroId) => {
      const { heroes, fleeReadyHeroIds } = get();
      const hero = heroes.find(h => h.id === heroId);
      if (!hero || !hero.isAlive) return;

      // Mark this hero as "ready to flee"
      const nextReady = fleeReadyHeroIds.includes(heroId)
        ? fleeReadyHeroIds
        : [...fleeReadyHeroIds, heroId];

      set({
        selectedCommand: 'flee',
        selectedSkill: null,
        selectedItem: null,
        fleeReadyHeroIds: nextReady,
        phase: 'executing'
      });

      get().addMessage(`${hero.name} prepares to flee...`);

      const aliveHeroIds = heroes.filter(h => h.isAlive).map(h => h.id);
      const allReady = aliveHeroIds.every(id => nextReady.includes(id));

      // End this hero's turn. Only attempt to flee once all alive heroes have chosen flee.
      if (allReady) {
        setTimeout(() => {
          get().addMessage('The party attempts to flee!');
          get().attemptFlee();
        }, 500);
      } else {
        setTimeout(() => {
          set({ currentTurnIndex: get().currentTurnIndex + 1 });
          get().nextTurn();
        }, 800);
      }
    },
    
    enemyTakeTurn: () => {
      // Enemy actions break any coordinated flee attempt.
      set({ fleeReadyHeroIds: [] });

      const { turnOrder, currentTurnIndex, enemies, heroes } = get();
      const currentActor = turnOrder[currentTurnIndex];
      
      const enemy = enemies.find(e => e.id === currentActor.id);
      if (!enemy || !enemy.isAlive) {
        set({ currentTurnIndex: currentTurnIndex + 1 });
        get().nextTurn();
        return;
      }
      
      get().addMessage(`${enemy.name}'s turn`);
      
      const aliveHeroes = heroes.filter(h => h.isAlive);
      if (aliveHeroes.length === 0) {
        set({ phase: 'defeat' });
        return;
      }
      
      const randomTarget = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
      
      setTimeout(() => {
        get().executeAttack(enemy.id, 'enemy', randomTarget.id);
      }, 600);
    },
    
    addMessage: (text) => {
      const message: BattleMessage = {
        id: `msg_${Date.now()}_${Math.random()}`,
        text,
        timestamp: Date.now()
      };
      
      set(state => ({
        messages: [...state.messages.slice(-4), message]
      }));
    },
    
    clearMessages: () => set({ messages: [] }),
    
    checkBattleEnd: () => {
      const { heroes, enemies } = get();
      
      const aliveHeroes = heroes.filter(h => h.isAlive);
      const aliveEnemies = enemies.filter(e => e.isAlive);
      
      if (aliveEnemies.length === 0) return 'victory';
      if (aliveHeroes.length === 0) return 'defeat';
      return 'ongoing';
    },
    
    getAliveHeroes: () => get().heroes.filter(h => h.isAlive),
    getAliveEnemies: () => get().enemies.filter(e => e.isAlive),
    getCurrentActor: () => {
      const { turnOrder, currentTurnIndex } = get();
      return turnOrder[currentTurnIndex] || null;
    }
  }))
);
