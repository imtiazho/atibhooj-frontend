import React, { useEffect, useState } from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { FaComment, FaRegComment } from 'react-icons/fa';
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { IoIosShareAlt } from 'react-icons/io';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../Footer/Footer';
import CommentPostModal from '../CommentPostModal/CommentPostModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import userDefaultPic from '../../media/place-user.jpg';
import { signOut } from 'firebase/auth';
import HTMLReactParser from 'html-react-parser';

const PostDetails = () => {
    const [serverStatus, setServerStatus] = useState(200);
    const { postID } = useParams()
    const [likeCommentQounter, setCommentLikeQounter] = useState(100);
    const [likeQounter, setLikeQounter] = useState(100);
    const [openModal, setOpenModal] = useState(null);
    const [posts, setPosts] = useState([]);
    // const [postIDForCommente, setPostIDForCommente] = useState("");
    const [commentNew, setCommentNew] = useState("")
    const [cuser, cloading, cerror] = useAuthState(auth);
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/user?email=${cuser?.email}`)
            .then(res => res.json())
            .then(data => setUser(...data))
    }, [cuser?.email])

    useEffect(() => {
        fetch(`http://localhost:5000/post-details/${postID}`)
            .then(res => res.json())
            .then(data => setPosts(data))
    }, [postID])

    // const handlePostSingleId = (postId) => {
    //     setPostIDForCommente(postId)
    // }

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    const handleComment = (e) => {
        if (e.target.value) {
            setCommentNew(e.target.value)
        }
    }

    const handleForm = (e) => {
        e.preventDefault();
        const commentUpdated = [...posts.comments, { comment: commentNew, commenter: cuser?.displayName, commenterImage: user?.userProfilePic, reactOnComment: "0" }]

        fetch(`http://localhost:5000/postComment/${postID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                comments: commentUpdated
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

    // console.log(postIDForCommente)
    // const posts = posts?.find(eachPost => eachPost._id === postID);
    // console.log(posts)
    return (
        <div>
            <div className='w-[95%] md:w-[93%] mx-auto my-12 rounded-lg text-left'>
                <div className='flex flex-col gap-8'>
                    <div className='flex items-center gap-3'>
                        <img className='w-[85px] md:w-[140px] h-[85px] md:h-[140px] rounded-full object-cover' src={posts?.userImage} alt="" />
                        <div>
                            <div className='flex items-center gap-[8px]'>
                                <p className='eng-font text-neutral font-bold text-[24px] md:text-[28px]'>{posts?.userName}</p>
                                <BsFillCheckCircleFill className='text-[#2C83C6] text-[16px]' />
                            </div>
                            <button className='btn mt-[5px] mt-[0px] btn-sm rounded-sm md:text-[12px] text-[13px] text-white hover:bg-primary focus:outline-none border-0 btn-primary'>Follow</button>
                        </div>
                    </div>
                    <div>
                        <p className='text-[1.8rem] md:text-[2.2rem] font-bold text-neutral'>{posts?.postTitle}</p>
                        <p className='text-[13px] text-neutral'>{posts?.date}</p>
                    </div>
                    <img className='w-full h-[365px] md:h-[500px] object-cover rounded-xl' src={posts?.mainPic} alt="" />
                    <div className='leading-relaxed text-neutral'>
                        {posts?.maintext && HTMLReactParser(posts?.maintext)}
                    </div>
                    <ul className='flex justify-evenly items-center border rounded-[25px]'>
                        {/* <li className='w-full bg-[#F2F2F2] rounded-[25px] p-[7px] flex justify-center items-center gap-[6px] text-neutral'>
                            <button onClick={() => setLikeQounter(likeQounter + 1)} className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost'>
                                <AiFillHeart className='text-primary' />
                            </button>
                            <p className='font-[500] text-[14px]'>{posts?.totalLike} Likes</p>
                        </li> */}
                        <li className='w-full p-[7px] flex justify-center items-center gap-[6px] text-neutral'>
                            <label htmlFor="comment-modal" onClick={() => setOpenModal(1)} className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost cursor-pointer'>
                                <AiOutlineComment className='text-neutral text-[18px]' />
                            </label>
                            <p className='font-[500] text-[15px]'>{posts?.comments?.length} times</p>
                        </li>
                        <li className='w-full border-l p-[7px] flex justify-center items-center gap-[6px] text-neutral cursor-pointer'>
                            <div className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost'>
                                <IoIosShareAlt className='text-neutral text-[18px]' />
                            </div>
                            <p className='font-[500] text-[15px] eng-font'>{posts?.totalSharee} share</p>
                        </li>
                    </ul>
                    <div className='text-neutral'>
                        <p className='text-[18px] md:text-[25px] font-bold eng-font mb-4'>Comments</p>
                        <div className='flex flex-col gap-8'>
                            {
                                posts?.comments?.map(eachComment => <div className='flex items-start gap-4 w-[100%] md:w-[55%]'>
                                    <img className='w-[70px] md:w-[90px] md:h-[90px] h-[70px] object-cover rounded-full' src={eachComment?.commenterImage ? eachComment?.commenterImage : userDefaultPic} alt="" />
                                    <div>
                                        <div className='bg-secondary p-5 rounded-xl'>
                                            <Link className='eng-font text-lg font-bold'>{eachComment?.commenter}</Link>
                                            <p className='mt-1'>{eachComment?.comment}</p>
                                        </div>
                                        <div className='pl-4 pt-2 flex items-center gap-4'>
                                            <button onClick={() => setCommentLikeQounter(likeCommentQounter + 1)} className='font-[500] hover:text-primary'>Like</button>
                                            <p>{eachComment?.reactOnComment} likes</p>
                                        </div>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
            {openModal && <CommentPostModal handleComment={handleComment} handleForm={handleForm} />}
            <Footer />
        </div>
    );
};

export default PostDetails;