import React, { useRef, useState } from 'react';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../Firebase/Firebase.init';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const MegazineUploadModal = ({ setModalOpen }) => {
    const [cuser, cloading, cerror] = useAuthState(auth);
    const [imageFile, setImageFile] = useState("");
    const [imageTwo, setImageTwo] = useState(null);
    const hiddenFileInputTwo = useRef(null);
    const navigate = useNavigate();
    const [serverStatus, setServerStatus] = useState(200);
    const [megazineInfo, setMegazineInfo] = useState({
        megazineTitle: "",
        megazineQuantity: "",
        megazineUploadYear: "",
        megazineDriveLink: ""
    })
    const [errors, setErrors] = useState({
        megazineTitleError: "",
        megazineQuantityError: "",
        megazineUploadYearError: "",
        megazineDriveLinkError: ""
    });

    const handleSignOut = () => {
        signOut(auth);
        navigate("/login-page");
        // toast.success("Something is wrong login again!");
    };

    const handleMegazineTitle = (e) => {
        if (e.target.value) {
            setMegazineInfo({ ...megazineInfo, megazineTitle: e.target.value });
            setErrors({ ...errors, megazineTitleError: "" });
        } else {
            setErrors({ ...errors, megazineTitleError: "Title is required." });
            setMegazineInfo({ ...megazineInfo, megazineTitle: "" });
        }
    }

    const handleMegazineQuantity = (e) => {
        if (e.target.value) {
            setMegazineInfo({ ...megazineInfo, megazineQuantity: e.target.value });
            setErrors({ ...errors, megazineQuantityError: "" });
        } else {
            setErrors({ ...errors, megazineQuantityError: "Quantity is required." });
            setMegazineInfo({ ...megazineInfo, megazineQuantity: "" });
        }
    }

    const handleMegazineUploadYear = (e) => {
        if (e.target.value) {
            setMegazineInfo({ ...megazineInfo, megazineUploadYear: e.target.value });
            setErrors({ ...errors, megazineUploadYearError: "" });
        } else {
            setErrors({ ...errors, megazineUploadYearError: "Year and month is required." });
            setMegazineInfo({ ...megazineInfo, megazineUploadYear: "" });
        }
    }

    const handleMegazineDriveLink = (e) => {
        if (e.target.value) {
            setMegazineInfo({ ...megazineInfo, megazineDriveLink: e.target.value });
            setErrors({ ...errors, megazineDriveLinkError: "" });
        } else {
            setErrors({ ...errors, megazineDriveLinkError: "Drive link is required." });
            setMegazineInfo({ ...megazineInfo, megazineDriveLink: "" });
        }
    }

    const handleMegazineCover = (event) => {
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
                        setImageTwo(file);
                    },
                    "image/jpeg",
                    0.8
                );
            };
        };
    };

    const handleClickTwo = (event) => {
        hiddenFileInputTwo.current.click();
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
                        fetch(`http://localhost:5000/megazineUpload`, {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                                authorization: `${cuser?.email} ${localStorage.getItem('accessToken')}`
                            },
                            body: JSON.stringify({
                                megazineTitle: megazineInfo.megazineTitle,
                                megazineCover: data.data.url,
                                downloadCount: "0",
                                quantity: megazineInfo.megazineQuantity,
                                monthAndYear: megazineInfo.megazineUploadYear,
                                megazineDrivelink: megazineInfo.megazineDriveLink
                            })
                        })
                            .then(res => {
                                setServerStatus(res.status);
                                if (res.status === 401 || res.status === 403) {
                                    handleSignOut();
                                }
                                return res.json()
                            })
                    }
                })
        }
    }
    return (
        <div>
            <input type="checkbox" id="modal-megazine-upload" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box sm:w-[80%] md:w-[70%] lg:w-11/12 max-w-5xl">
                    <label htmlFor="modal-megazine-upload" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <form onSubmit={handleForm} className='px-4 flex gap-12 items-end mt-8 text-neutral text-[14px] flex flex-col gap-4'>
                        <div className='w-full'>
                            <input onBlur={handleMegazineTitle} type="text" placeholder='হেডলাইন...' className='w-full border-b focus:outline-0 p-2' />
                            {errors.megazineTitleError && (
                                <p className="text-[13px] mt-1 text-[#FF0000]">{errors.megazineTitleError}</p>
                            )}
                        </div>
                        <div className='w-full'>
                            <input onBlur={handleMegazineQuantity} type="text" placeholder='Quantity' className='w-full border-b focus:outline-0 p-2' />
                            {errors.megazineQuantityError && (
                                <p className="text-[13px] mt-1 text-[#FF0000]">{errors.megazineQuantityError}</p>
                            )}
                        </div>
                        <div className='w-full'>
                            <input onBlur={handleMegazineUploadYear} type="text" placeholder='Year' className='w-full border-b focus:outline-0 p-2' />
                            {errors.megazineUploadYearError && (
                                <p className="text-[13px] mt-1 text-[#FF0000]">{errors.megazineUploadYearError}</p>
                            )}
                        </div>
                        <div className='w-full'>
                            <input onBlur={handleMegazineDriveLink} type="text" placeholder='Drive Link' className='w-full border-b focus:outline-0 p-2' />
                            {errors.megazineDriveLinkError && (
                                <p className="text-[13px] mt-1 text-[#FF0000]">{errors.megazineDriveLinkError}</p>
                            )}
                        </div>
                        <label htmlFor="image-upload-input" className="text-left w-full hidden">
                            <p className=''>{imageTwo ? imageTwo?.name : "Choose an image"}</p>
                        </label>
                        <div className='text-left w-full' onClick={handleClickTwo} style={{ cursor: "pointer" }}>
                            {imageTwo ? (
                                <img src={URL.createObjectURL(imageTwo)} alt="upload image" className="h-[300px] w-1/2 object-cover" />
                            ) : (
                                <div className='block w-full p-3 rounded-md text-neutral cursor-pointer flex items-center gap-2'>
                                    <MdAddPhotoAlternate className='text-[23px]' />
                                    <p className='text-[16px]'>ছবি যুক্ত করুন</p>
                                </div>
                            )}

                            <input
                                id="image-upload-input"
                                type="file"
                                onChange={handleMegazineCover}
                                ref={hiddenFileInputTwo}
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

export default MegazineUploadModal;