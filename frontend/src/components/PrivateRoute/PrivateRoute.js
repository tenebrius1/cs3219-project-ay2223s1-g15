import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { URL_USER_SVC } from "../../configs";
import { STATUS_CODE_OK } from "../../constants";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../loader/Loader";

const PrivateRoute = ({ redirectPath="/", children }) => {
    const [isPageLoad, setIsPageLoad] = useState(true);
    const auth = useAuth();
    
    useEffect(() => {
        const verify = async () => {
            await auth.verifyJwt()
                    .then(res => {
                        if (res && res.status === STATUS_CODE_OK) {
                            setIsPageLoad(true);
                        } else {
                            setIsPageLoad(false);
                        }
                    })
        }
        verify().catch(err => console.log(err))
    }, [])
    
    return (
        isPageLoad ? (
            children
        ) : (
            <Navigate to={redirectPath} replace />
        )
    )
}

export default PrivateRoute;