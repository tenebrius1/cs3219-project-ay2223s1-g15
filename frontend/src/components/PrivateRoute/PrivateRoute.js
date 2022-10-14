import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isPageLoad, setIsPageLoad] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const login = async () => {
        await auth.verifyJwt()
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
