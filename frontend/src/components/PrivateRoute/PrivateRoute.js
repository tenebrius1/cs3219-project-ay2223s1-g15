import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { STATUS_CODE_OK } from '../../constants';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isPageLoad, setIsPageLoad] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const login = async () => {
        await auth.tokenLogin()
                .then(res => {
                    if (res && res.status === STATUS_CODE_OK) {
                        setIsPageLoad(true);
                    } else {
                        setIsPageLoad(false);
                    }
                })
        }
    login().catch(err => console.log(err))
    }, [])

  return isPageLoad ? children : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
