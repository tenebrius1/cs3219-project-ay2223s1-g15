import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { URL_USER_SVC } from '../configs.js';
import { STATUS_CODE_OK } from '../constants.js';

const AuthContext = createContext({
  user: null,
  passwordLogin: async () => {},
  tokenLogin: async () => {},
  logout: async () => {},
});

const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

const useProvideAuth = () => {
  const [user, setUser] = useState(null);

  const passwordLogin = async (username, password) => {
    const res = await axios
      .post(
        URL_USER_SVC + '/passwordLogin',
        { username, password },
        { withCredentials: true }
      )
      .then((res) => {
        if (res && res.status === STATUS_CODE_OK) {
          setUser(res.data.username);
        } else {
          console.log('invalid login');
          setUser(null);
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    return res;
  };

  const tokenLogin = async () => {
    const res = await axios
      .post(URL_USER_SVC + '/auth/tokenLogin', {}, { withCredentials: true })
      .then((res) => {
        if (res && res.status === STATUS_CODE_OK) {
          setUser(res.data.username);
        } else {
          setUser(null);
        }
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    return res;
  };

  const logout = async () => {
    const res = await axios
      .delete(URL_USER_SVC + '/auth/logout', { withCredentials: true })
      .then((res) => {
        if (res) {
          setUser(null);
        }
        return res;
      })
      .catch((err) => console.log(err));
    return res;
  };

  return {
    user,
    passwordLogin,
    tokenLogin,
    logout,
  };
};

export { AuthProvider, useAuth };
