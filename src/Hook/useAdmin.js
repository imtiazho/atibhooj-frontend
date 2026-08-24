import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../Firebase/Firebase.init';

const useAdmin = (user) => {
    const [admin, setAdmin] = useState("");
    const navigate = useNavigate();
    const [serverStatus, setServerStatus] = useState(200);
    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    useEffect(() => {
        const email = user?.email;
        fetch(`http://localhost:5000/admin/${email}`, {
            method: "GET",
            headers: {
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                setServerStatus(res.status);
                if (res.status === 401 || res.status === 403) {
                    handleSignOut();
                }
                return res.json()
            })
            .then(data => setAdmin(data.admin))
    }, [user])

    return [admin, setAdmin];
};

export default useAdmin;