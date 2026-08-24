import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import { BsFacebook, BsFillCheckCircleFill } from 'react-icons/bs';
import { AiFillLinkedin, AiOutlineInstagram } from 'react-icons/ai';
import Footer from '../Footer/Footer';


const TeamAtibhooj = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/teamMembers`)
            .then(res => res.json())
            .then(data => setTeamMembers(data))
    }, [])

    return (
        <div>
            <div className='w-[93%] mx-auto text-neutral'>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-6'>
                    {
                        teamMembers.map(eachMemebers => <div key={eachMemebers._id} className='text-left mt-6 p-4 shadow-lg rounded-md'>
                            <img className='w-full object-cover rounded-md' src={eachMemebers?.userCoverPic} alt="" />
                            <div className='flex flex-col text-center items-center gap-2 relative top-[-50px]'>
                                <img className='w-[100px] h-[100px] rounded-full border-4 border-[#fff] object-cover' src={eachMemebers?.userProfilePic} alt="" />
                                <div>
                                    <div className='flex items-center gap-[8px]'>
                                        <Link to='/userprofile' className='eng-font text-neutral font-bold text-[25px]'>{eachMemebers?.userName}</Link>
                                        <BsFillCheckCircleFill className='text-[#2C83C6] text-[14px]' />
                                    </div>
                                    <div className='flex items-center gap-2 justify-center'>
                                        <p className='text-[12px] font-[500] text-neutral bg-secondary inline py-[3px] px-[8px] rounded-md'>{eachMemebers?.userType[0]}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 items-center gap-3 justify-center -mt-[32px]'>
                                <button className='btn btn-sm btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white rounded-sm'>Follow</button>
                                <Link to={`/userprofile/${eachMemebers?.userEmail}`} className='btn btn-sm btn-secondary hover:bg-secondary focus:outline-none hover:border-0 text-neutral rounded-sm'>VISIT</Link>
                            </div>
                            <div>
                                <div className='flex gap-4 justify-center items-center mt-4 text-white'>
                                    <Link className='bg-secondary w-[30px] h-[30px] flex justify-center items-center text-neutral rounded-md text-[16px]'><BsFacebook /></Link>
                                    <Link className='bg-secondary w-[30px] h-[30px] flex justify-center items-center text-neutral rounded-md text-[16px]'><AiOutlineInstagram /></Link>
                                    <Link className='bg-secondary w-[30px] h-[30px] flex justify-center items-center text-neutral rounded-md text-[16px]'><AiFillLinkedin /></Link>
                                </div>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TeamAtibhooj;