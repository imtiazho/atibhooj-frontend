import React, { useEffect, useState } from 'react';
import sliderPic1 from '../../media/Slider.jpg';
import sliderPic2 from '../../media/slider-2.jpg';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';


const TopBanner = () => {
    const [TopBanners, setTopBanners] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/allTopbanner")
            .then(res => res.json())
            .then(data => setTopBanners(data))
    }, [])
    return (
        <div className='my-8 w-[98%] md:w-[93%] mx-auto'>
            <Swiper
                spaceBetween={10}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                className='rounded-xl w-full'
            >
                {
                    TopBanners?.map(eachBanner => <SwiperSlide>
                        <img className='rounded-xl w-full md:h-[410px] h-[175px] sm:h-[300px] w-full object-cover' src={eachBanner?.topBanner} alt="" />
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
    );
};

export default TopBanner;