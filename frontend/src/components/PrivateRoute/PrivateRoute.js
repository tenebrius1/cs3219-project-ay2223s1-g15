import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isPageLoad, setIsPageLoad] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const login = async () => {
      const res = await auth.tokenLogin();
      if (res) {
        setIsPageLoad(true);
      } else {
        setIsPageLoad(false);
      }
    };

    if (auth.user != null) {
      setIsPageLoad(true);
    } else {
      login().catch((err) => console.log(err));
    }
  }, [auth]);

  return isPageLoad ? children : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
