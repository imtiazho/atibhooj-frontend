import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const EditBio = () => {
    const [cuser, cloading, cerror] = useAuthState(auth);
    const [updatedBio, setUpdatedBio] = useState("");
    const navigate = useNavigate();
    const [serverStatus, setServerStatus] = useState(200);
    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    const handleUpdatedBio = (e) => {
        if (e.target.value) {
            setUpdatedBio(e.target.value);
        }
    }

    const handleForm = (e) => {
        e.preventDefault();

        if (updatedBio) {
            fetch(`http://localhost:5000/userCover/${cuser?.email}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${cuser?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    userBio: updatedBio
                })
            })
                .then(res => {
                    setServerStatus(res.status);
                    if (res.status === 401 || res.status === 403) {
                        handleSignOut();
                    }
                    return res.json()
                })
                .then(data => console.log(data))
        }

    }

    return (
        <div className='w-1/2 mx-auto my-10 flex flex-col gap-6 border shadow-lg bg-neutral text-white p-8 pb-16 rounded'>
            <form onSubmit={handleForm} className='flex flex-col gap-6 text-left'>
                <p className='py-3 text-center font-bold text-3xl'>Edit Bio</p>
                <div>
                    <textarea onBlur={handleUpdatedBio} placeholder='Bio...' type="text" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md text-black resize-none h-[150px]' />
                </div>
                <input type="submit" value='UPDATE' className='rounded-sm border-0 btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white' />
            </form>
        </div>
    );
};

export default EditBio;