import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

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
      .catch((err) => {
        console.log(err);
      });
    if (res && res.status === STATUS_CODE_OK) {
      setUser(res.data.username);
      return true;
      // window.localStorage.setItem('isAuth', true);
      // return error code then check in useeFect of each protected page if got error when log in
    } else {
      setUser(null);
      return false;
    }
  };

  const tokenLogin = async () => {
    const res = await axios
      .post(URL_USER_SVC + '/tokenLogin', {}, { withCredentials: true })
      .catch((err) => {
        console.log(err);
      });
    if (res && res.status === STATUS_CODE_OK) {
      setUser(res.data.username);
      return true;
    } else {
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    const res = await axios.delete(URL_USER_SVC + '/logout');
    if (res && res.status === STATUS_CODE_OK) {
      setUser(null);
    }
  };

  return {
    user,
    passwordLogin,
    tokenLogin,
    logout,
  };
};

export { AuthProvider, useAuth };
