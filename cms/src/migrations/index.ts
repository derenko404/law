import * as migration_20260827_114712_initial from './20260827_114712_initial';
import * as migration_20260828_101356_categories from './20260828_101356_categories';

export const migrations = [
  {
    up: migration_20260827_114712_initial.up,
    down: migration_20260827_114712_initial.down,
    name: '20260827_114712_initial',
  },
  {
    up: migration_20260828_101356_categories.up,
    down: migration_20260828_101356_categories.down,
    name: '20260828_101356_categories'
  },
];
