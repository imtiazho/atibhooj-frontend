import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthState, useCreateUserWithEmailAndPassword, useSignInWithGoogle, useUpdateProfile } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import Footer from '../Footer/Footer';

const SignUp = () => {
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [updateProfile, updating, updateError] = useUpdateProfile(auth);
    const [signInWithGoogle, guser, gloading, gerror] = useSignInWithGoogle(auth);
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || "/";

    // Here start the collect form data
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        nameError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
    });
    const handleName = (e) => {
        if (e.target.value !== "") {
            setUserInfo({ ...userInfo, name: e.target.value });
            setErrors({ ...errors, nameError: "" });
        } else {
            setErrors({ ...errors, nameError: "Name is required." });
            setUserInfo({ ...userInfo, name: "" });
        }
    };
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
    const handleConfirmPassword = (e) => {
        if (userInfo.password === e.target.value) {
            setUserInfo({ ...userInfo, confirmPassword: e.target.value });
            setErrors({ ...errors, confirmPasswordError: "" });
        } else {
            setErrors({ ...errors, confirmPasswordError: "Password Mismatch" });
            setUserInfo({ ...userInfo, confirmPassword: "" });
        }
    };

    const handleForm = async (e) => {
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

        if (userInfo.name || userInfo.password || userInfo.confirmPassword || userInfo.email) {
            await createUserWithEmailAndPassword(userInfo.email, userInfo.password);
            await updateProfile({ displayName: userInfo.name });
            fetch(`http://localhost:5000/users/${userInfo.email}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ userName: userInfo.name, userPassWord: userInfo.password, userEmail: userInfo.email, userCoverPic: false, userProfilePic: false, userBio: false, verified: false, userType: ["New Member"], role: "", Followers: 0, Following: 0, allLikes: 0, totalPosts: 0, allFollowing: [] })
            })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                })
        } else {
            setErrors({ nameError: "Name is required.", emailError: "Enter a valid Email", passwordError: "Password must be 6 character", confirmPasswordError: "Password Mismatch", imageError: "Image is required." })
        }
    };

    const handleGoogleSignIn = () => {
        // signInWithGoogle();
        alert("Temporary disabled")
    }

    useEffect(() => {
        if (user || guser) {
            navigate(from, { replace: true });
        }
    }, [navigate, user, guser, from])
    return (
        <div>
            <div>
                <div className='lg:w-5/6 w-[95%] mx-auto'>
                    <div className='lg:w-1/2 md:w-[60%] sm:w-[80%] w-[100%] mx-auto my-20 flex flex-col gap-6 border shadow-lg bg-neutral text-white p-8 pb-16 rounded'>
                        <form onSubmit={handleForm} className='flex flex-col gap-6 text-left'>
                            <p className='py-3 text-center font-bold text-3xl'>Sign Up</p>
                            <div>
                                <input onBlur={handleName} placeholder='Name' type="You Name" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md text-black' />
                                {errors.nameError && (
                                    <p className="text-[13px] mt-1 text-[#FF0000]">{errors.nameError}</p>
                                )}
                            </div>
                            <div>
                                <input onBlur={handleEmail} placeholder='Email' type="email" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md text-black' />
                                {errors.emailError && (
                                    <p className="text-[13px] mt-1 text-[#FF0000]">{errors.emailError}</p>
                                )}
                            </div>
                            <div>
                                <input onBlur={handlePassword} placeholder='Password' type="password" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md text-black' />
                                {errors.passwordError && (
                                    <p className="text-[13px] mt-1 text-[#FF0000]">{errors.passwordError}</p>
                                )}
                            </div>
                            <div>
                                <input onBlur={handleConfirmPassword} placeholder='Confirm Password' type="password" className='w-full focus:outline-0 h-full bg-white rounded p-[1rem] text-black text-md text-black' />
                                {errors.confirmPasswordError && (
                                    <p className="text-[13px] mt-1 text-[#FF0000]">{errors.confirmPasswordError}</p>
                                )}
                            </div>
                            <input className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white' type="submit" value='SIGNUP' />
                            <p className='text-center text-white'>Already have account? <Link to='/login-page'>Login</Link></p>
                            <div className='flex justfify-center gap-4 items-center text-white'>
                                <div className='bg-white w-full h-[1px]'></div>
                                <div>OR</div>
                                <div className='bg-white w-full h-[1px]'></div>
                            </div>
                        </form>
                        <button onClick={handleGoogleSignIn} className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white'>Continue with google</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SignUp;