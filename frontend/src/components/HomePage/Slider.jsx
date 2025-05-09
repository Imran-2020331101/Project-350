import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TripCard from '../TripCard';

export default function Category({Packages}) {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      }
    ]
  };

  return (
    <section id="works" className="py-6 bg-gray-800 w-[90%]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Join a Trekking group</h2>
        <Slider {...settings}>
          {
            Packages.map((pack)=><TripCard key={pack.id} trip={pack}/>)
          }
        </Slider>
      </div>
    </section>
  );
}
