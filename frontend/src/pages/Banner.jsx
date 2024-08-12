import React from 'react';
import Banner1 from '../assets/banner.png';
import Banner2 from '../assets/bannerb.png';

import './components/Banner.css';

const Banner = () => {
  return (
    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={Banner1} className="d-block w-100 banner-image" alt="Banner 1" />
        </div>
        <div className="carousel-item">
          <img src={Banner2} className="d-block w-100 banner-image" alt="Banner 2" />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Banner;
