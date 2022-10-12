import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_OK } from '../constants';

const AuthContext = createContext({
    user: null,
    login: async () => {},
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

    const login = async (username, password) => {
        const res = await axios
            .post(URL_USER_SVC + '/login', { username, password })
            .catch((err) => {
                console.log(err);
            });
        if (res && res.status === STATUS_CODE_OK) {
            setUser(username);
        }
    };

    const logout = async () => {
        const res = await axios.delete(URL_USER_SVC + '/logout');
        if (res && res === STATUS_CODE_OK) {
            setUser(null);
        }
    };

    return {
        user,
        login,
        logout,
    };
};

export { AuthProvider, useAuth };
