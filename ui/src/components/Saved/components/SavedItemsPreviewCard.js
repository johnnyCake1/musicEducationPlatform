import React from 'react';
import './SavedItemsPreviewCard.css';

const SavedItemsPreviewCard = ({ imageSrc, title, description, updatedAt }) => {
  return (
    <div className="saved-items-preview-card">
      <div className="image-container">
        <img src={imageSrc} alt={title} />
      </div>
      <div className="details-container">
        <h3>{title}</h3>
        <p className="description">{description}</p>
        <p className="updated-at">Last updated: {updatedAt}</p>
      </div>
    </div>
  );
};

export default SavedItemsPreviewCard;
