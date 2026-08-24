import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';


const Login = () => {
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || "/";

    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        emailError: "",
        passwordError: "",
    });

    const handleEmail = (e) => {
        const emailRegEx = /\S+@\S+\.\S+/;
        const validEmail = emailRegEx.test(e.target.value);
        if (validEmail) {
            setUserInfo({ ...userInfo, email: e.target.value });
            setErrors({ ...errors, emailError: "" });
        } else {
            setErrors({ ...errors, emailError: "Enter a valid Email" });
            setUserInfo({ ...userInfo, email: "" });
        }
    };

    const handlePassword = (e) => {
        const passwordRegex = /.{6,}/;
        const validPassword = passwordRegex.test(e.target.value);
        if (validPassword) {
            setUserInfo({ ...userInfo, password: e.target.value });
            setErrors({ ...errors, passwordError: "" });
        } else {
            setErrors({
                ...errors,
                passwordError: "Password must be in 6 character",
            });
            setUserInfo({ ...userInfo, password: "" });
        }
    };

    const handleForm = (e) => {
        e.preventDefault();

        const emailToToken = userInfo.email
        fetch('http://localhost:5000/jwtTokenGenerator', {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ emailToToken })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem("accessToken", data.token)
                }
            })

        if (userInfo.email || userInfo.password) {
            signInWithEmailAndPassword(userInfo.email, userInfo.password);
        }
        else {
            setErrors({ nameError: "Name is required.", emailError: "Enter a valid Email", passwordError: "Password must be 6 character", confirmPasswordError: "Password Mismatch", imageError: "Image is required." })
        }

    };
    const handleGoogleLogin = () => {
        // signInWithGoogle();
        alert("Temporary disabled")
    }
    useEffect(() => {
        if (user || guser) {
            navigate(from, { replace: true });
        }
    }, [navigate, user, guser, from]);

    return (
        <div>
            <div className='lg:w-5/6 w-[95%] mx-auto'>
                <div className='lg:w-1/2 md:w-[60%] sm:w-[80%] w-[100%] mx-auto my-20 flex flex-col gap-6 border shadow-lg bg-neutral text-white p-8 pb-16 rounded'>
                    <form onSubmit={handleForm} className='flex flex-col gap-6 text-left'>
                        <p className='py-3 text-center font-bold text-3xl'>Login</p>
                        <div>
                            <input onBlur={handleEmail} placeholder='Email' type="email" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md' />
                            {errors.emailError && (
                                <p className="text-[13px] mt-1 text-[#FF0000]">{errors.emailError}</p>
                            )}
                        </div>
                        <div>
                            <input onBlur={handlePassword} placeholder='Password' type="password" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md' />
                            {errors.passwordError && (
                                <p className="text-[13px] mt-1 text-[#FF0000]">{errors.passwordError}</p>
                            )}
                        </div>
                        <input className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white' type="submit" value='LOGIN' />
                        <p className='text-center'>Don't have any account? <Link to='/signup-page'>Sign Up</Link></p>
                        <div className='flex justfify-center gap-4 items-center text-white'>
                            <div className='bg-secondary w-full h-[1px]'></div>
                            <div>OR</div>
                            <div className='bg-secondary w-full h-[1px]'></div>
                        </div>
                    </form>
                    <button onClick={() => handleGoogleLogin()} className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white'>Continue with google</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;