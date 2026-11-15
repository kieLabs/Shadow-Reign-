import { CHARACTERS, availableCharacters } from './data.js';

export function getCharacter(characterId = 'arin') {
  return CHARACTERS[characterId] || CHARACTERS.arin;
}

export function getUnlockedCharacters(completedChapters = []) {
  return availableCharacters(completedChapters);
}

export function canSelectCharacter(characterId, completedChapters = []) {
  return getUnlockedCharacters(completedChapters).some(character => character.id === characterId);
}
