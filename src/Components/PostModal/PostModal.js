import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MdAddPhotoAlternate } from 'react-icons/md';
import auth from '../../Firebase/Firebase.init';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import JoditEditor from 'jodit-react';


const PostModal = ({ user, userDb }) => {
    const editor = useRef(null);
    const [content, setContent] = useState('');

    const today = new Date();
    const date = today.toDateString();
    const [serverStatus, setServerStatus] = useState(200);
    const [uploadPostInfo, setUploadPostInfo] = useState({
        headline: "",
        postDetails: "",
        postCategory: "",
        image: "",
    });
    const [uploadPostErrors, setUploadPostErrors] = useState({
        headlineError: "",
        postDetailsError: "",
        postCategoryError: "",
        imageError: "",
    });
    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState("");

    const [image, setImage] = useState(null);
    const hiddenFileInput = useRef(null);

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
        const file = event.target.files[0];
        const imgname = event.target.files[0].name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxSize = Math.max(img.width, img.height);
                canvas.width = maxSize;
                canvas.height = maxSize;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(
                    img,
                    (maxSize - img.width) / 2,
                    (maxSize - img.height) / 2
                );
                canvas.toBlob(
                    (blob) => {
                        const file = new File([blob], imgname, {
                            type: "image/png",
                            lastModified: Date.now(),
                        });

                        console.log(file);
                        setImage(file);
                    },
                    "image/jpeg",
                    0.8
                );
            };
        };
    };

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    };

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    const handleHeadline = (e) => {
        if (e.target.value) {
            setUploadPostInfo({ ...uploadPostInfo, headline: e.target.value });
            setUploadPostErrors({ ...uploadPostErrors, headlineError: '' });
        }
        else {
            setUploadPostErrors({ ...uploadPostErrors, headlineError: 'Headline is required' });
            setUploadPostInfo({ ...uploadPostInfo, headline: "" });
        }
    }

    const handleDetailsPost = (e) => {
        if (e.target.value) {
            setUploadPostInfo({ ...uploadPostInfo, postDetails: e.target.value });
            setUploadPostErrors({ ...uploadPostErrors, postDetailsError: '' });
        }
        else {
            setUploadPostErrors({ ...uploadPostErrors, postDetailsError: 'Post details is required' });
            setUploadPostInfo({ ...uploadPostInfo, postDetails: "" });
        }
    }
    const handleCategory = (e) => {
        if (e.target.value) {
            setUploadPostInfo({ ...uploadPostInfo, postCategory: e.target.value });
            setUploadPostErrors({ ...uploadPostErrors, postCategoryError: '' });
        }
        else {
            setUploadPostErrors({ ...uploadPostErrors, postCategoryError: 'Category is required' });
            setUploadPostInfo({ ...uploadPostInfo, postCategory: "" });
        }
    }

    const handlePostUpload = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imageFile);
        if (uploadPostInfo.headline || uploadPostInfo.postDetails) {
            fetch('https://api.imgbb.com/1/upload?key=47525efe69e4554af8476259fe5ef0b5', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetch("http://localhost:5000/posts", {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                                authorization: `${user?.email} ${localStorage.getItem('accessToken')}`
                            },
                            body: JSON.stringify({
                                userMail: user.email,
                                userName: user.displayName,
                                userImage: userDb.userProfilePic,
                                verified: userDb.verified,
                                date: date,
                                mainPic: data.data.url,
                                postTitle: uploadPostInfo.headline,
                                maintext: content,
                                postCate: uploadPostInfo.postCategory,
                                totalLike: "0",
                                comments: [],
                                totalSharee: "0",
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
                })
        }
    }
    return (
        <div>
            <input type="checkbox" id="post-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box sm:w-[80%] md:w-[70%] lg:w-11/12 max-w-5xl">
                    <label htmlFor="post-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <form onSubmit={handlePostUpload} className='px-4 flex gap-12 items-end mt-8 text-neutral text-[14px] flex flex-col gap-12 text-left'>
                        <div className='w-full'>
                            <input onBlur={handleHeadline} type="text" placeholder='হেডলাইন...' className='w-full border-b focus:outline-0 p-2' />
                            {uploadPostErrors.headlineError && (
                                <p className="text-[12px] mt-2 text-[#FF0000] eng-font">{uploadPostErrors.headlineError}</p>
                            )}
                        </div>
                        <div className='w-full'>

                            {/* <input onBlur={handleDetailsPost} type="text" placeholder='পোস্ট বিস্তারিত...' className='w-full border-b focus:outline-0 p-2' /> */}
                            <JoditEditor
                                ref={editor}
                                value={content}
                                onBlur={newContent => setContent(newContent)}
                            />
                            {uploadPostErrors.postDetailsError && (
                                <p className="text-[12px] mt-2 text-[#FF0000] eng-font">{uploadPostErrors.postDetailsError}</p>
                            )}
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="eng-font text-[13px]">Choose your category</span>
                            </label>
                            <select onChange={handleCategory} className="select select-bordered">
                                <option defaultValue disabled>Select Category</option>
                                <option>প্রবন্ধ</option>
                                <option>গল্প</option>
                                <option>কবিতা</option>
                                <option>উপন্যাস</option>
                                <option>বুক রিভিউ</option>
                            </select>
                            {/* {uploadPostErrors.postCategory && (
                                <p className="text-[12px] mt-2 text-[#FF0000] eng-font">{uploadPostErrors.postCategory}</p>
                            )} */}
                        </div>

                        <label htmlFor="image-upload-input" className="text-left w-full hidden">
                            <p className=''>{image ? image?.name : "Choose an image"}</p>
                        </label>
                        <div className='text-left w-full' onClick={handleClick} style={{ cursor: "pointer" }}>
                            {image ? (
                                <img src={URL.createObjectURL(image)} alt="upload image" className="md:h-[300px] md:w-1/2 object-cover" />
                            ) : (
                                <div className='block w-full p-3 rounded-md text-neutral cursor-pointer flex items-center gap-2'>
                                    <MdAddPhotoAlternate className='text-[23px]' />
                                    <p className='text-[16px]'>ছবি যুক্ত করুন</p>
                                </div>
                            )}

                            <input
                                id="image-upload-input"
                                type="file"
                                onChange={handleImageChange}
                                ref={hiddenFileInput}
                                style={{ display: "none" }}
                            />
                        </div>

                        <input className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white font-300' type="submit" value='POST' />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostModal;