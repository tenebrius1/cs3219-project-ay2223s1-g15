import { createContext, useState } from 'react';

export const UserContext = createContext({
  user: null,
  imageUrl: null,
  role: null,
});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [role, setRole] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser, imageUrl, setImageUrl, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
