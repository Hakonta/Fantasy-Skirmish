import { Hero, Enemy, Item, Skill, SkillCategory } from '../types/battle';

const blackMagicSkills: Skill[] = [
  {
    id: 'fire',
    name: 'Fire',
    mpCost: 4,
    power: 25,
    type: 'magical',
    target: 'single_enemy',
    description: 'Deals fire damage to one enemy'
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    mpCost: 4,
    power: 25,
    type: 'magical',
    target: 'single_enemy',
    description: 'Deals ice damage to one enemy'
  },
  {
    id: 'thunder',
    name: 'Thunder',
    mpCost: 4,
    power: 25,
    type: 'magical',
    target: 'single_enemy',
    description: 'Deals lightning damage to one enemy'
  }
];

const whiteMagicSkills: Skill[] = [
  {
    id: 'cure',
    name: 'Cure',
    mpCost: 5,
    power: 30,
    type: 'healing',
    target: 'single_ally',
    description: 'Restores HP to one ally'
  },
  {
    id: 'cura',
    name: 'Cura',
    mpCost: 12,
    power: 60,
    type: 'healing',
    target: 'single_ally',
    description: 'Restores more HP to one ally'
  },
  {
    id: 'heal_all',
    name: 'Heal All',
    mpCost: 18,
    power: 40,
    type: 'healing',
    target: 'all_allies',
    description: 'Restores HP to all allies'
  }
];

const swordTechSkills: Skill[] = [
  {
    id: 'power_slash',
    name: 'Power Slash',
    mpCost: 6,
    power: 40,
    type: 'physical',
    target: 'single_enemy',
    description: 'A powerful sword strike'
  },
  {
    id: 'whirlwind',
    name: 'Whirlwind',
    mpCost: 12,
    power: 25,
    type: 'physical',
    target: 'all_enemies',
    description: 'Attacks all enemies with spinning strike'
  }
];

export const initialHeroes: Hero[] = [
  {
    id: 'hero_1',
    name: 'Cloud',
    hp: 120,
    maxHp: 120,
    mp: 30,
    maxMp: 30,
    strength: 25,
    magic: 15,
    toughness: 18,
    magicResistance: 12,
    agility: 20,
    skillCategory: {
      name: 'Sword Tech',
      skills: swordTechSkills
    },
    isAlive: true,
    color: '#4a90d9'
  },
  {
    id: 'hero_2',
    name: 'Terra',
    hp: 85,
    maxHp: 85,
    mp: 60,
    maxMp: 60,
    strength: 12,
    magic: 28,
    toughness: 10,
    magicResistance: 22,
    agility: 18,
    skillCategory: {
      name: 'Black Magic',
      skills: blackMagicSkills
    },
    isAlive: true,
    color: '#9b59b6'
  },
  {
    id: 'hero_3',
    name: 'Rosa',
    hp: 75,
    maxHp: 75,
    mp: 55,
    maxMp: 55,
    strength: 10,
    magic: 25,
    toughness: 8,
    magicResistance: 20,
    agility: 22,
    skillCategory: {
      name: 'White Magic',
      skills: whiteMagicSkills
    },
    isAlive: true,
    color: '#f1c40f'
  }
];

const goblinSkills: Skill[] = [
  {
    id: 'goblin_punch',
    name: 'Goblin Punch',
    mpCost: 0,
    power: 15,
    type: 'physical',
    target: 'single_enemy',
    description: 'A wild punch'
  }
];

const orcSkills: Skill[] = [
  {
    id: 'heavy_swing',
    name: 'Heavy Swing',
    mpCost: 0,
    power: 25,
    type: 'physical',
    target: 'single_enemy',
    description: 'A heavy weapon swing'
  }
];

export const initialEnemies: Enemy[] = [
  {
    id: 'enemy_1',
    name: 'Goblin',
    hp: 45,
    maxHp: 45,
    mp: 0,
    maxMp: 0,
    strength: 12,
    magic: 5,
    toughness: 8,
    magicResistance: 6,
    agility: 15,
    skills: goblinSkills,
    isAlive: true,
    color: '#27ae60',
    expReward: 15,
    goldReward: 10
  },
  {
    id: 'enemy_2',
    name: 'Goblin',
    hp: 45,
    maxHp: 45,
    mp: 0,
    maxMp: 0,
    strength: 12,
    magic: 5,
    toughness: 8,
    magicResistance: 6,
    agility: 14,
    skills: goblinSkills,
    isAlive: true,
    color: '#27ae60',
    expReward: 15,
    goldReward: 10
  },
  {
    id: 'enemy_3',
    name: 'Orc',
    hp: 80,
    maxHp: 80,
    mp: 0,
    maxMp: 0,
    strength: 20,
    magic: 8,
    toughness: 15,
    magicResistance: 10,
    agility: 10,
    skills: orcSkills,
    isAlive: true,
    color: '#8b4513',
    expReward: 30,
    goldReward: 25
  }
];

export const initialItems: Item[] = [
  {
    id: 'potion',
    name: 'Potion',
    quantity: 5,
    effect: 'heal_hp',
    power: 50,
    target: 'single_ally',
    description: 'Restores 50 HP'
  },
  {
    id: 'hi_potion',
    name: 'Hi-Potion',
    quantity: 2,
    effect: 'heal_hp',
    power: 150,
    target: 'single_ally',
    description: 'Restores 150 HP'
  },
  {
    id: 'ether',
    name: 'Ether',
    quantity: 3,
    effect: 'heal_mp',
    power: 30,
    target: 'single_ally',
    description: 'Restores 30 MP'
  },
  {
    id: 'phoenix_down',
    name: 'Phoenix Down',
    quantity: 1,
    effect: 'revive',
    power: 25,
    target: 'single_ally',
    description: 'Revives fallen ally with 25% HP'
  }
];
