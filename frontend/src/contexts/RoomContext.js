import { createContext, useState } from 'react';

export const RoomContext = createContext({
  difficulty: '',
  setDifficulty: (difficulty) => {},
  roomId: '',
  setRoomId: (roomId) => {},
  partner: '',
  setPartner: (partner) => {},
});

export const RoomContextProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState('');
  const [roomId, setRoomId] = useState('');
  const [partner, setPartner] = useState('');

  return (
    <RoomContext.Provider
      value={{ difficulty, setDifficulty, roomId, setRoomId, partner, setPartner }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
