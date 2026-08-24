import React, { useEffect, useState } from 'react';
import postImg from '../../media/post.jpg';
import userPic from '../../media/user.jpg';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { IoIosShareAlt } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import CommentPostModal from '../CommentPostModal/CommentPostModal';
import { useQuery } from '@tanstack/react-query';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import { signOut } from 'firebase/auth';
import HTMLReactParser from 'html-react-parser';


const PostContainer = () => {
    const navigate = useNavigate();
    const [serverStatus, setServerStatus] = useState(200);
    const [likeQounter, setLikeQounter] = useState(100);
    const [openModal, setOpenModal] = useState(null);
    const [posts, setPosts] = useState([]);
    const [cuser, cloading, cerror] = useAuthState(auth);
    const [commentNew, setCommentNew] = useState("")
    const [user, setUser] = useState({})
    const [postID, setPostId] = useState("");
    useEffect(() => {
        fetch(`http://localhost:5000/user?email=${cuser?.email}`)
            .then(res => res.json())
            .then(data => setUser(...data))
    }, [cuser?.email])
    console.log(posts)
    // console.log(user);
    // const { serviceLoading, serviceError, data: serviceData, refetch } = useQuery({
    //     queryKey: ['posts'],
    //     queryFn: () =>
    //         fetch('http://localhost:5000/posts').then(
    //             (res) => res.json(),
    //         ),
    // })

    useEffect(() => {
        fetch("http://localhost:5000/posts")
            .then(res => res.json())
            .then(data => setPosts(data))
    }, [])

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    const handleLike = (postId) => {
        const targetedPost = posts.find(eachpost => eachpost._id === postId);
        const likeCount = parseInt(targetedPost?.totalLike) + 1;
        fetch(`http://localhost:5000/postLike/${postId}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                totalLike: likeCount
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))

    }
    const handlePostSingleId = (postId) => {
        setPostId(postId)
    }

    const handleComment = (e) => {
        if (e.target.value) {
            setCommentNew(e.target.value)
        }
    }

    const handleForm = (e) => {
        e.preventDefault();
        const targetedPost = posts.find(eachpost => eachpost._id === postID);
        const commentUpdated = [...targetedPost.comments, { comment: commentNew, commenter: cuser?.displayName, commenterImage: user?.userProfilePic, reactOnComment: "0" }]

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
    const shareButton = () => {
        alert("This button is temporary disable");
    }
    return (
        <div className='my-12 mx-auto w-[93%] grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {
                posts?.map(eachPost =>
                    <div key={eachPost?._id} className='text-left rounded-xl shadow-lg pb-4 overflow-hidden'>
                        <div className='relative'>
                            <p className='bg-secondary text-neutral absolute left-[1rem] top-[1rem] py-[5px] px-4 rounded-md'>{eachPost?.postCate}</p>
                            <img className='h-[275px] object-cover w-full' src={eachPost?.mainPic} alt="" />
                            <div className='flex items-center gap-2 px-4 absolute -bottom-[5rem]'>
                                <img className='w-[100px] h-[100px] rounded-full border-4 border-secondary object-cover' src={eachPost?.userImage} alt="" />
                                <div>
                                    <div className='flex items-center gap-[8px]'>
                                        <Link to={`/userprofile/${eachPost?.userMail}`} className='eng-font text-neutral font-bold text-[20px]'>{eachPost?.userName}</Link>
                                        {eachPost?.verified && <BsFillCheckCircleFill className='text-[#2C83C6] text-[14px]' />}
                                    </div>
                                    <p className='text-[12px] text-[#a7a7a7]'>{eachPost?.date}</p>
                                </div>
                            </div>
                        </div>
                        <div className='px-4 mt-[5.4rem] text-neutral'>
                            <div className='lg:h-[190px] md:h-[190px] xl:h-[150px]'>
                                <Link to={`/postD/${eachPost?._id}`} className='text-[27px] font-bold'>{eachPost?.postTitle.length < 50 ? eachPost?.postTitle : eachPost?.postTitle.slice(0, 50) + "..."}</Link>
                                <p className='leading-relaxed font-[500] mb-4'>{eachPost?.maintext && HTMLReactParser(eachPost?.maintext?.slice(0, 75))}</p>
                            </div>

                            <ul className='flex justify-evenly items-center border rounded-[25px]'>
                                {/* <li className='w-full bg-[#F2F2F2] rounded-[25px] p-[6px] flex items-center gap-[6px] text-neutral'>
                                    <button onClick={() => handleLike(eachPost?._id)} className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost'>
                                        <AiFillHeart className='text-primary' />
                                    </button>
                                    <p className='font-[500] text-[14px]'>{eachPost?.totalLike} Likes</p>
                                </li> */}
                                <li onClick={() => handlePostSingleId(eachPost?._id)} className='w-full p-[6px] flex items-center gap-[6px] text-neutral justify-center'>
                                    <label htmlFor="comment-modal" onClick={() => setOpenModal(1)} className='bg-white text-[15px] w-[35px] h-[35px] flex justify-center items-center rounded-full btn-ghost cursor-pointer'>
                                        <AiOutlineComment className='text-neutral text-[18px]' />
                                    </label>
                                    <p className='font-[500] text-[15px]'>{eachPost?.comments?.length} comment</p>
                                </li>
                                <li onClick={shareButton} className='w-full border-l p-[6px] flex items-center gap-[6px] text-neutral'>
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
            {openModal && <CommentPostModal handleComment={handleComment} handleForm={handleForm} />}
        </div >
    );
};

export default PostContainer;