import * as migration_20260827_114712_initial from './20260827_114712_initial';

export const migrations = [
  {
    up: migration_20260827_114712_initial.up,
    down: migration_20260827_114712_initial.down,
    name: '20260827_114712_initial'
  },
];
