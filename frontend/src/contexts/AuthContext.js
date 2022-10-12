import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: async () => {},
  verifyJwt: async () => {},
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

  const login = async (username, password) => {
    console.log('hi');
    const res = await axios
      .post(URL_USER_SVC + '/login', { username, password }, { withCredentials: true })
      .catch((err) => {
        console.log(err);
      });
    if (res && res.status === STATUS_CODE_OK) {
      setUser(res.data.username);
      // window.localStorage.setItem('isAuth', true);
      // return error code then check in useeFect of each protected page if got error when log in
    } else {
      setUser(null);
    }
  };

  const logout = async () => {
    const res = await axios.delete(URL_USER_SVC + '/logout');
    if (res && res === STATUS_CODE_OK) {
      setUser(null);
    }
  };

  const verifyJwt = async () => {
    const res = await axios
      .post(URL_USER_SVC + '/verifyJwt', {}, { withCredentials: true })
      .catch((err) => console.log(err));
    console.log('hi2');
    console.log(res);
    if (res && res === STATUS_CODE_OK) {
      console.log(res.data.username);
      setUser(res.data.username);
      return res;
    } else {
      setUser(null);
      return res;
    }
  };

  return {
    user,
    login,
    logout,
    verifyJwt,
  };
};

export { AuthProvider, useAuth };
