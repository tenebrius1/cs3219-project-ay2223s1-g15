import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenLogin } from '../../api/user/auth';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isPageLoad, setIsPageLoad] = useState(true);

  useEffect(() => {
    const login = async () => {
      if (await tokenLogin()) {
        setIsPageLoad(true);
      } else {
        setIsPageLoad(false);
      }
    };
    login().catch((err) => console.log(err));
  }, []);

  return isPageLoad ? children : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
