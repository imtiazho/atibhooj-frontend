import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import megazineCover1 from '../../media/megazine-1.jpg';
import MegazineUploadModal from '../MegazineUploadModal/MegazineUploadModal';
import auth from '../../Firebase/Firebase.init';

const MegazineUpload = () => {
    const [modalOpen, setModalOpen] = useState(null);
    const [megazines, setMegazines] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/megazines")
            .then(res => res.json())
            .then(data => setMegazines(data))

    }, [])

    const handleMegazineQuantity = (megazineID) => {
        const targetedMegazine = megazines.find(eachMegazine => eachMegazine._id === megazineID);
        const newQuantity = parseInt(targetedMegazine?.downloadCount) + 1;
        fetch(`http://localhost:5000/megazinesquantity/${megazineID}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                downloadCount: newQuantity
            })
        })
    }


    return (
        <div className='m-5 p-5 rounded-lg shadow-lg flex flex-col gap-6 text-left' >
            <label onClick={() => setModalOpen(true)} htmlFor='modal-megazine-upload' className='btn btn-primary hover:bg-primary focus:outline-none hover:border-0 text-white'>Upload New Megazine</label>

            <div>
                <h1 className='text-neutral mb-3'>Here are some recent Megazine...</h1>
                <div className='text-neutral grid xl:grid-cols-2 grid-cols-1 gap-4'>
                    {
                        megazines?.slice(0, 4).map(eachMegazine => <div key={eachMegazine._id} className='grid grid-cols-6 items-center gap-4 border p-4 rounded-lg shadow-lg'>
                            <div className='col-span-2 overflow-hidden'>
                                <img className='rounded-lg' src={eachMegazine?.megazineCover} alt="" />
                            </div>
                            <div className='text-left flex flex-col gap-2 md:gap-4 col-span-4 p-4'>
                                <p className='text-[25px] md:text-[33px] font-bold mb-2'>{eachMegazine?.megazineTitle}</p>
                                <p className='bg-primary text-white px-4 py-2 rounded-full w-fit text-[13px] md:text-[15px]'>{eachMegazine?.downloadCount} downloads</p>
                                <div className='flex items-center gap-4'>
                                    <p className='text-[16px] md:text-[22px]'>সংখ্যাঃ {eachMegazine?.quantity}</p>
                                    <p className='text-[16px] md:text-[22px]'>মাসঃ {eachMegazine?.monthAndYear}</p>
                                </div>
                                {/* <p className='text-[20px]'>1002 Downloads</p> */}
                                <div onClick={() => handleMegazineQuantity(eachMegazine._id)}>
                                    <a target='_blank' href={eachMegazine?.megazineDrivelink} className='mt-4 flex items-center gap-2 bg-primary pl-2 pt-2 pr-4 pb-2 rounded-full w-fit'>
                                        <div className='bg-white text-[18px] w-[30px] h-[30px] flex justify-center items-center rounded-full'>
                                            <AiOutlineDownload />
                                        </div>
                                        <p className='text-white text-[13px] md:text-[15px]'>DOWNLOAD</p>
                                    </a>
                                    {/* <Link className='flex items-center gap-2 bg-secondary pl-2 pt-2 pr-4 pb-2 rounded-full'>
                                <div className='bg-white text-[18px] w-[30px] h-[30px] flex justify-center items-center rounded-full'>
                                    <BiDetail />
                                </div>
                                <p>DETAILS</p>
                            </Link> */}
                                </div>
                            </div>
                        </div>)
                    }

                </div>
            </div>
            {modalOpen && <MegazineUploadModal setModalOpen={setModalOpen} />}
        </div>
    );
};

export default MegazineUpload;