import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

const AuthContext = createContext({
    user: null,
    login: async () => {},
    logout: async () => {},
    verifyJwt: async () => {},
})

const AuthProvider = ({children}) => {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext);
  }
  
const useProvideAuth = () => {
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        const res = await axios.post(URL_USER_SVC + "/login", { username, password }, { withCredentials: true })
                            .then(res => {
                                if (res && res.status === STATUS_CODE_OK) {
                                    setUser(res.data.username);
                                } else {
                                    setUser(null);
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            });
        return res;
    };

    const logout = async () => {
        const res = await axios.delete(URL_USER_SVC + "/logout", { withCredentials: true })
                            .then(res => {
                                if (res) {
                                    setUser(null);
                                }
                                return res
                            })
                            .catch(err => console.log(err))
        return res
    };

    const verifyJwt = async () => {
        const res = await axios.post(URL_USER_SVC + "/verifyJwt", {}, { withCredentials: true })
                .then(res => {                                
                    if (res && res.status === STATUS_CODE_OK) {
                        setUser(res.data.username)
                        return res;
                    } else {
                        setUser(null);
                        return res;
                    }
                })
                .catch(err => console.log(err))
        return res;
    }

    return {
        user,
        login,
        logout,
        verifyJwt,
    };
}
  

export { AuthProvider, useAuth };