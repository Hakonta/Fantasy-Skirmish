export interface CharacterStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  strength: number;
  magic: number;
  toughness: number;
  magicResistance: number;
  agility: number;
}

export interface Skill {
  id: string;
  name: string;
  mpCost: number;
  power: number;
  type: 'physical' | 'magical' | 'healing';
  target: 'single_enemy' | 'all_enemies' | 'single_ally' | 'all_allies' | 'self';
  description: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  effect: 'heal_hp' | 'heal_mp' | 'revive' | 'cure_status';
  power: number;
  target: 'single_ally' | 'all_allies' | 'self';
  description: string;
}

export interface Hero extends CharacterStats {
  id: string;
  name: string;
  skillCategory: SkillCategory;
  isAlive: boolean;
  color: string;
}

export interface Enemy extends CharacterStats {
  id: string;
  name: string;
  skills: Skill[];
  isAlive: boolean;
  color: string;
  expReward: number;
  goldReward: number;
}

export type BattlePhase = 
  | 'start'
  | 'turn_order'
  | 'player_command'
  | 'player_target'
  | 'player_skill'
  | 'player_item'
  | 'executing'
  | 'enemy_turn'
  | 'victory'
  | 'defeat'
  | 'fled';

export type CommandType = 'attack' | 'skill' | 'item' | 'flee';

export interface BattleAction {
  actorId: string;
  actorType: 'hero' | 'enemy';
  command: CommandType;
  skillId?: string;
  itemId?: string;
  targetIds: string[];
}

export interface TurnOrder {
  id: string;
  type: 'hero' | 'enemy';
  agility: number;
}

export interface BattleMessage {
  id: string;
  text: string;
  timestamp: number;
}
