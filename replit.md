# Turn-Based RPG Battle System

## Overview
A classic turn-based RPG battle system inspired by Final Fantasy games. Features side-view combat with a party of heroes fighting against enemies, complete with spell casting, item usage, and strategic combat mechanics.

## Current State
MVP complete with full battle functionality including:
- 3 playable heroes with unique skill categories
- 3 enemies to battle against
- Attack, Magic/Skills, Items, and Flee commands
- Victory/Defeat/Flee battle end conditions

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   └── battle/
│       ├── BattleScene.tsx      # 3D battle arena with character sprites
│       ├── CharacterSprite.tsx  # Individual character visual representation
│       ├── BattleMenu.tsx       # FF-style command menus (Attack, Skills, Items)
│       ├── BattleResult.tsx     # Victory/Defeat/Flee screens
│       └── index.ts             # Barrel exports
├── lib/
│   ├── types/
│   │   └── battle.ts            # TypeScript interfaces for battle system
│   ├── data/
│   │   └── gameData.ts          # Initial heroes, enemies, skills, items data
│   └── stores/
│       └── useBattle.ts         # Zustand store for battle state management
└── App.tsx                      # Main application component
```

### Key Technologies
- React 18 with TypeScript
- Three.js / React Three Fiber for 3D rendering
- Zustand for state management
- Tailwind CSS for styling

## Battle System Details

### Character Stats
- **HP** (Hit Points): Health, character dies at 0
- **MP** (Mana Points): Resource for skills
- **Strength**: Physical attack power
- **Magic**: Magical attack/healing power
- **Toughness**: Physical defense
- **Magic Resistance**: Magical defense
- **Agility**: Determines turn order

### Combat Flow
1. Turn order calculated by agility (highest first)
2. Player selects commands for each hero on their turn
3. Enemies automatically attack random heroes
4. Battle ends when all enemies or all heroes are defeated

### Commands
- **Attack**: Basic physical attack against one enemy
- **Magic/Skills**: Character-specific abilities costing MP
- **Items**: Use consumable items (potions, revive, etc.)
- **Flee**: Attempt to escape battle (success based on agility comparison)

### Heroes
1. **Cloud** (Sword Tech) - Physical damage dealer
2. **Terra** (Black Magic) - Offensive magic user
3. **Rosa** (White Magic) - Healer/support

### Damage Formula
- Physical: `(Strength * 2 - Toughness) * variance`
- Magical: `(Power + Magic * 1.5 - MagicResistance * 0.5) * variance`

## Running the Project
```bash
npm run dev
```
The game runs on port 5000.

## Recent Changes
- December 2024: Initial MVP implementation
  - Created battle state management with turn order system
  - Implemented side-view 3D battle scene
  - Added Final Fantasy-style menu UI
  - Implemented attack, skill, item, and flee mechanics
  - Added victory/defeat/flee result screens
  - Fixed revive item targeting for fallen allies
