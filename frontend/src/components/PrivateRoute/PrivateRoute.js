import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_OK } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../loader/Loader';

const PrivateRoute = ({ redirectPath = '/', children }) => {
  const [isAuth, setIsAuth] = useState(window.localStorage.getItem('isAuth') || false);
  const [isPageLoad, setIsPageLoad] = useState(true);
  const auth = useAuth();

  // if (auth.user) {
  //     return children;
  // }
  const login = async () => {
    const res = await auth.login();
    return res;
  };
  useEffect(() => {
    const test = async () => {
      const res = await auth.verifyJwt();
      // console.log('hi')
      // console.log(res)
      if (res && res.status === STATUS_CODE_OK) {
        setIsPageLoad(true);
      } else {
        console.log('hello', res);
        setIsPageLoad(false);
      }
    };
    test().catch((err) => console.log(err));
    // const res = auth.login();
    // console.log(auth)
    // console.log(res)
    // if (auth.user) {
    //     setIsAuth(true)
    //     setIsPageLoad(true)
    //     window.localStorage.setItem('isAuth', true)
    //     console.log(auth.user);
    // }
    // if (!res) {
    //     setIsPageLoad(false);
    //     window.localStorage.setItem('isAuth', false)
    // }
    // if (auth.user && isAuth) {
    //     setIsLoading(false);
    // }
  }, []);

  // if (resStatus === STATUS_CODE_OK) {
  //     return children;
  // }

  return isPageLoad ? children : <Navigate to={redirectPath} replace />;
  // if (isPageLoad) {
  //     return children;
  // } else {
  //     // return <Loader></Loader>
  //     return <Navigate to={redirectPath} replace />;
  // }
};

export default PrivateRoute;
