import React, { useEffect, useState } from 'react';
import coverImg from '../../media/place-cover.jpg';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import userPic from '../../media/place-user.jpg';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import { FaComment, FaRegComment } from 'react-icons/fa';
import { AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { IoIosShareAlt } from 'react-icons/io';
import Footer from '../Footer/Footer';
import PostModal from '../PostModal/PostModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import { signOut } from 'firebase/auth';


const UserProfile = () => {
    const { gmailId } = useParams();
    const [user, loading, error] = useAuthState(auth);
    const [currentUserData, setCurrentUserData] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const [userDb, setUsers] = useState([]);
    const [userDbPost, setUserDbPost] = useState([]);
    const [serverStatus, setServerStatus] = useState(200);
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    useEffect(() => {
        fetch(`http://localhost:5000/user?email=${gmailId}`)
            .then(res => res.json())
            .then(data => setUsers(...data))
    }, [gmailId]);

    useEffect(() => {
        fetch(`http://localhost:5000/post?email=${gmailId}`)
            .then(res => res.json())
            .then(data => setUserDbPost(data))
    }, [gmailId]);

    useEffect(() => {
        fetch(`http://localhost:5000/user?email=${user?.email}`)
            .then(res => res.json())
            .then(data => setCurrentUserData(...data))
    }, [user?.email])

    const profileOwnerVerification = gmailId === user?.email;
    const targetedFollowingData = currentUserData?.allFollowing?.find(eachFollowing => eachFollowing.userData === gmailId);
    const isFollowing = targetedFollowingData?.userData === gmailId;

    const handleFollowButton = (userData) => {
        // These code for followers
        let newFollower = [...currentUserData.allFollowing, { userData }];
        if (newFollower) {
            fetch(`http://localhost:5000/myFollowing/${user?.email}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    allFollowing: newFollower
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

        // These code for influencer
        const newFollowers = parseInt(userDb?.followers + 1)
        if (newFollowers) {
            fetch(`http://localhost:5000/myFollowers/${userDb?.userEmail}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    followers: newFollowers
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
        <div className='lg:w-[93%] mx-auto'>
            <div className='text-left mt-6 w-[97%] mx-auto'>
                <img className='h-[210px] md:h-[300px] lg:h-[500px] w-full object-cover rounded-xl' src={userDb?.userCoverPic ? userDb?.userCoverPic : coverImg} alt="" />
                <div className='flex flex-col text-center items-center gap-2 relative top-[-75px] sm:top-[-85px] md:top-[-100px] lg:top-[-120px]'>
                    <img className='w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] rounded-full border-4 border-[#fff] object-cover bg-white' src={userDb?.userProfilePic ? userDb?.userProfilePic : userPic} alt="" />
                    <div className='flex flex-col justify-center gap-3'>
                        <div className='flex items-center gap-[8px]'>
                            <Link className='eng-font text-neutral font-bold text-[32px] sm:text-[34px] md:text-[37px] lg:text-[40px]'>{userDb?.userName}</Link>
                            {userDb?.verified && <BsFillCheckCircleFill className='text-[#2C83C6] text-[16px]' />}
                        </div>
                        <div className='flex items-center gap-2 justify-center w-full flex-wrap'>
                            {userDb?.userType?.map(eachType => <p className='text-[10px] font-[500] text-neutral bg-secondary inline py-[3px] px-[8px] rounded-sm'>{eachType}</p>)}
                        </div>
                    </div>
                    {profileOwnerVerification && <div className='absolute top-[19rem] md:top-[20.5rem] sm:top-[20rem] lg:right-[4rem]'>
                        <Link to='/edit-profile' className='btn rounded-sm btn-sm btn-primary hover:bg-primary focus:outline-none border-0 hover:border-0 text-white mb-4 w-full'>Edit Profile</Link>
                    </div>}
                </div>
            </div>
            <div className='text-neutral lg:mt-[-100px] mt-[-55px] sm:mt-[-65px] md:mt-[-85px] w-full sm:w-[90%] lg:w-[60%] mx-auto'>
                <p className='mx-[0.5rem] sm:mx-[1.5rem] md:mx-[2.5rem] lg:mx-[6rem] leading-relaxed'>{userDb?.userBio ? userDb?.userBio : "কোনো বায়ো নেই"}</p>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-6 items-start gap-4 md:mt-24 lg:mt-6 mt-20 mx-[0.3rem] lg:mx-[3rem]'>
                <div className='lg:col-span-2 border flex flex-col gap-4 p-4 rounded-lg'>
                    {profileOwnerVerification || <div className='w-full'>
                        {isFollowing ?
                            <button className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white w-full'>Following</button>
                            :
                            <button onClick={() => handleFollowButton(userDb?.email)} className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white w-full'>Follow</button>
                        }
                    </div>}
                    <div className='flex items-center gap-2 text-neutral eng-font bg-secondary p-3 rounded-lg'>
                        <p>Followed by <strong>{userDb?.followers} people</strong></p>
                    </div>
                    <div className='flex items-center gap-2 text-neutral eng-font bg-secondary p-3 rounded-lg'>
                        <p>Following <strong>{userDb?.allFollowing?.length} people</strong></p>
                    </div>
                    {/* <div className='flex items-center gap-2 text-neutral eng-font bg-secondary p-3 rounded-lg'>
                            <p>Total <strong>{userDb?.allLikes} likes</strong></p>
                        </div> */}
                    <div className='flex items-center gap-2 text-neutral eng-font bg-secondary p-3 rounded-lg'>
                        <p>Total <strong>{userDbPost?.length} post</strong></p>
                    </div>
                </div>
                <div className='lg:col-span-4 border p-4 rounded-xl'>
                    {profileOwnerVerification && <label htmlFor="post-modal" onClick={() => setOpenModal(true)} className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white mb-4 w-full flex items-center gap-2'>
                        <p className='text-[18px] lg:text-[22px]'>+</p>
                        <p className='text-[10px] lg:text-[16px]'>Create new post</p>
                    </label>}
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={3}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                    >
                        <SwiperSlide className='bg-primary text-white font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p>অতিভূজ</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>সাহিত্য</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>অতিভূজ</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>মিডিয়া</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>খবর</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>অতিসৃজন</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>টিম অতিভূজ</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>সাহিত্য</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>মিডিয়া</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>খবর</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>মিডিয়া</p></SwiperSlide>
                        <SwiperSlide className='bg-secondary text-neutral font-[500] p-[5px] rounded-md cursor-pointer text-[11px] lg:text-[15px]'><p className='flex justify-center items-center'>মিডিয়া</p></SwiperSlide>
                    </Swiper>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8'>
                        {
                            userDbPost?.map(eachPost =>
                                <div key={eachPost._id} className='text-left rounded-xl shadow-lg pb-4 overflow-hidden'>
                                    <div className='relative'>
                                        <p className='bg-secondary text-neutral absolute left-[1rem] top-[1rem] py-[5px] px-4 rounded-md'>{eachPost?.postCate}</p>
                                        <img className='object-cover w-full h-[275px]' src={eachPost?.mainPic} alt="" />
                                    </div>
                                    <div className='px-3 mt-2 text-neutral'>
                                        <div>
                                            <Link className='text-[20px] font-bold'>{eachPost?.postTitle} </Link>
                                            <p className='leading-relaxed font-[500] mb-4 mt-2 text-[13px]'>{eachPost?.maintext.slice(0, 85)}...</p>
                                        </div>

                                        <ul className='flex justify-evenly items-center border rounded-[25px]'>
                                            {/* <li className='w-full bg-[#F2F2F2] rounded-[25px] p-[6px] flex items-center gap-[6px] text-neutral'>
                                    <button onClick={() => handleLike(eachPost?._id)} className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost'>
                                        <AiFillHeart className='text-primary' />
                                    </button>
                                    <p className='font-[500] text-[14px]'>{eachPost?.totalLike} Likes</p>
                                </li> */}
                                            <li className='w-full p-[6px] flex items-center gap-[6px] text-neutral justify-center'>
                                                <label htmlFor="comment-modal" onClick={() => setOpenModal(1)} className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost cursor-pointer'>
                                                    <AiOutlineComment className='text-neutral text-[18px]' />
                                                </label>
                                                <p className='font-[500] text-[15px]'>{eachPost?.comments?.length} comment</p>
                                            </li>
                                            <li className='w-full border-l p-[6px] flex items-center gap-[6px] text-neutral'>
                                                <button className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost'>
                                                    <IoIosShareAlt className='text-neutral text-[18px]' />
                                                </button>
                                                <p className='font-[500] text-[14px]'>{eachPost?.totalSharee} share</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            {openModal && <PostModal user={user} userDb={userDb} setOpenModal={setOpenModal} />}
            <Footer />
        </div>
    );
};

export default UserProfile;