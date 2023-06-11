import React from 'react';
import './PictureTile.css';

function PictureTile({ images }) {
  return (
    <div className="PictureTile">
      <div className="PictureTile-row">
        <div className="PictureTile-image">
          <img src={images[0]} alt="tile 1" />
        </div>
        <div className="PictureTile-image">
          <img src={images[1]} alt="tile 2" />
        </div>
      </div>
      <div className="PictureTile-row">
        <div className="PictureTile-image">
          <img src={images[2]} alt="tile 3" />
        </div>
        <div className="PictureTile-image">
          <img src={images[3]} alt="tile 4" />
        </div>
      </div>
    </div>
  );
}

export default PictureTile;
