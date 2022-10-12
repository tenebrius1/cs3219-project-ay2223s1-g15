import axios from 'axios';
import { Route, Navigate } from 'react-router-dom';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const auth = useAuth();
  if (auth.user) {
    return children;
  }
  const loginWithJWT = async () => {
    const res = await axios
      .post(URL_USER_SVC + '/login', {})
      .catch((err) => console.log(err));
    console.log(res);
    if (res && res.status === STATUS_CODE_OK) {
      return children;
    }
  };
  loginWithJWT();
  return <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
