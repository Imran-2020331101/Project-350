import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TripCard from '../TripCard';
import { Link } from 'react-router-dom';

export default function Category({Packages}) {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    // arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          // arrows: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          // arrows: false
        }
      }
    ]
  };

  return (
    <section id="works" className="py-6 bg-gray-900 w-[90%]">
      <div className="container mx-auto text-center">
        <Slider {...settings}>
          {
            Packages.map((pack)=>
            <Link key={pack.id} to={`/group/${pack.id}`}>
              <TripCard  trip={pack}/>
            </Link>)
          }
        </Slider>
      </div>
    </section>
  );
}
