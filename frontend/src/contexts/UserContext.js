import { createContext, useState } from 'react';

export const UserContext = createContext({
  user: null,
  imageUrl: null,
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser, imageUrl, setImageUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
