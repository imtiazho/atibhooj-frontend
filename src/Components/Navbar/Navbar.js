import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../media/Atibhooj-logo.png';
import { AiOutlineMenu, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import userPic from '../../media/place-user.jpg';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import useAdmin from '../../Hook/useAdmin';

const Navbar = () => {
    const [cuser, cloading, cerror] = useAuthState(auth);
    const [signOut, loading, error] = useSignOut(auth);
    const [userDb, setUsers] = useState([]);
    const [admin, setAdmin] = useAdmin(cuser);

    useEffect(() => {
        fetch(`http://localhost:5000/user?email=${cuser?.email}`)
            .then(res => res.json())
            .then(data => setUsers(...data))
    }, [cuser?.email])
    const navItems = (
        <>
            <li className='lg:text-black text-white'><Link className='active:text-white' to="/">HOME</Link></li>
            <li className='lg:text-black text-white'><Link className='active:text-white' to="/about-sec">ABOUT</Link></li>
            <li className='lg:text-black text-white'><Link className='active:text-white' to="/service-sec">SERVICE</Link></li>
            <li className='lg:text-black text-white'><Link className='active:text-white' to="/our-doctor">DOCTORS</Link></li>
            <li className='lg:text-black text-white'><Link className='active:text-white' to="/blog-sec">BLOG</Link></li>
            <li className='lg:text-black'><Link className='active:text-white' to="/portfolio-sec">PORTFOLIO</Link></li>
            <li className='lg:text-black text-white'><Link className='active:bg-secondary active:text-white' to="/contact-sec">CONTACT</Link></li>
        </>
    )

    return (
        <div className="w-[93%] mx-auto flex justify-between items-center py-5 eng-font">
            <Link to='/' ><img className='lg:w-[145px] md:w-[135px] sm:w-[125px] w-[120px]' src={logo} alt="" /></Link>

            <ul className='flex items-center gap-2'>
                {/* <Link>
                    <li className='bg-[#F2F2F2] rounded-[25px] p-[5px] flex items-center gap-2 text-neutral'>
                        <div className='bg-white text-[14px] w-[30px] h-[30px] flex justify-center items-center rounded-full font-[500]'>BN</div>
                        <select className='bg-transparent focus:outline-none'>
                            <option value="" key="">English</option>
                            <option value="" key="">Bangla</option>
                        </select>
                    </li>
                </Link> */}
                {/* <Link>
                    <li className='bg-[#F2F2F2] lg:w-[40px] h-[40px] flex justify-center items-center text-neutral text-[18px] rounded-full'><AiOutlineSearch /></li>
                </Link> */}
                {cuser ?
                    <div className="dropdown dropdown-end text-neutral">
                        <label tabIndex={0} className="cursor-pointer avatar w-12 h-12 ">
                            <div className="">
                                <img className="rounded-full border-2" src={userDb?.userProfilePic ? userDb?.userProfilePic : userPic} alt='avt' />
                            </div>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link to={`/userprofile/${cuser.email}`} className="justify-between">
                                    {cuser?.displayName?.split(" ")[0]}
                                    <span className="badge">New</span>
                                </Link>
                            </li>
                            <li><Link>Settings</Link></li>
                            {admin && <li><Link to='/admin-dashboard'>Admin Panel</Link></li>}
                            <li><Link onClick={() => signOut()}>Logout</Link></li>
                        </ul>
                    </div>
                    :
                    <Link to='/login-page'>
                        <li className='bg-[#F2F2F2] rounded-[25px] pl-[5px] pt-[5px] pr-[10px] pb-[5px] flex items-center gap-2 text-neutral'>
                            <div className='bg-white md:text-[18px] text-[16px] w-[30px] h-[30px] flex justify-center items-center rounded-full'>
                                <AiOutlineUser />
                            </div>
                            <div className='font-[500] md:text-[14px] text-[12px]'>
                                Login/Sign Up
                            </div>
                        </li>
                    </Link>}
                {/* <Link>
                    <li className='bg-[#F2F2F2] w-[40px] h-[40px] flex justify-center items-center text-neutral text-[18px] rounded-full'><AiOutlineMenu /></li>
                </Link> */}
            </ul>
        </div>
    );
};

export default Navbar;