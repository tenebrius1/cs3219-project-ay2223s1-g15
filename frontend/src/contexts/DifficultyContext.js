import { createContext } from 'react';

const DifficultyContext = createContext({
  currentDifficulty: '',
  setCurrentDifficulty: (difficulty) => {},
  roomID: '',
  setRoomID: (roomID) => {},
});

export default DifficultyContext;
