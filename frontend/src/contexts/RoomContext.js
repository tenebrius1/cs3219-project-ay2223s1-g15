import { createContext, useState } from 'react';

export const RoomContext = createContext({
  difficulty: '',
  setDifficulty: (difficulty) => {},
  roomId: '',
  setRoomId: (roomId) => {},
  partner: '',
  setPartner: (partner) => {},
  tracks: '',
  setTracks: (tracks) => {},
  client: '',
  setClient: (client) => {},
});

export const RoomContextProvider = ({ children }) => {
  const [difficulty, setDifficulty] = useState('');
  const [roomId, setRoomId] = useState('');
  const [partner, setPartner] = useState('');
  const [tracks, setTracks] = useState('');
  const [client, setClient] = useState('');

  return (
    <RoomContext.Provider
      value={{
        difficulty,
        setDifficulty,
        roomId,
        setRoomId,
        tracks,
        setTracks,
        client,
        setClient,
        partner,
        setPartner,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
