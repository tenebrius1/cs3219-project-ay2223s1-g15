import { createContext, useState } from 'react';

export const RoomContext = createContext({
  difficulty: '',
  setDifficulty: (difficulty) => {},
  roomId: '',
  setRoomId: (roomId) => {},
});

export const RoomContextProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState('');
  const [roomId, setRoomId] = useState('');

  return (
    <RoomContext.Provider value={{ difficulty, setDifficulty, roomId, setRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
