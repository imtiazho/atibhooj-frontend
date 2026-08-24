import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MdAddPhotoAlternate } from 'react-icons/md';
import auth from '../../Firebase/Firebase.init';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const EditProfilePic = () => {
    const [cuser, cloading, cerror] = useAuthState(auth);
    const [imageFile, setImageFile] = useState("");
    console.log("One", imageFile)
    const [image, setImage] = useState(null);
    const hiddenFileInputOne = useRef(null);
    const [serverStatus, setServerStatus] = useState(200);
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    const handleProfilePic = (event) => {
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

    const handleClickOne = (event) => {
        hiddenFileInputOne.current.click();
    }

    const handleForm = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', imageFile);
        if (imageFile) {
            fetch('https://api.imgbb.com/1/upload?key=47525efe69e4554af8476259fe5ef0b5', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetch(`http://localhost:5000/userCover/${cuser?.email}`, {
                            method: 'PUT',
                            headers: {
                                'content-type': 'application/json',
                                authorization: `${cuser?.email} ${localStorage.getItem('accessToken')}`
                            },
                            body: JSON.stringify({
                                userProfilePic: data.data.url
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
            <form onSubmit={handleForm}>
                <label htmlFor="image-upload-input" className="text-left w-full hidden">
                    <p className=''>{image ? image?.name : "Choose an image"}</p>
                </label>
                <div className='w-full' onClick={handleClickOne} style={{ cursor: "pointer" }}>
                    {image ? (
                        <img src={URL.createObjectURL(image)} alt="upload image" className="h-[300px] w-[500px] mx-auto object-cover" />
                    ) : (
                        <div className='block w-full p-3 rounded-md text-neutral cursor-pointer flex items-center justify-center mt-6 gap-2 border p-16'>
                            <MdAddPhotoAlternate className='text-[23px]' />
                            <p className='text-[16px] eng-font'>Choose Profile Pic</p>
                        </div>
                    )}

                    <input
                        id="image-upload-input"
                        type="file"
                        onChange={handleProfilePic}
                        ref={hiddenFileInputOne}
                        style={{ display: "none" }}
                    />
                </div>
                <input className='mt-6 btn rounded-sm border-0 btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white font-300' type="submit" value='UPDATE' />
            </form>
        </div>
    );
};

export default EditProfilePic;