'use client';

import React, { useState } from 'react';
import Lightbox from '../Lightbox';
import styles from './ClickableImage.module.css';

type ClickableImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const ClickableImage: React.FC<ClickableImageProps> = ({ src, alt, width, height }) => {
  const [showLightbox, setShowLightbox] = useState(false);

  const attachment = {
    url: src,
    type: 'image',
    width: width || 1600,
    height: height || 900,
  };

  return (
    <>
      <div className={styles.imageContainer}>
        <img
          src={src}
          alt={alt}
          className={styles.clickableImage}
          onClick={() => setShowLightbox(true)}
        />
        <div className={styles.zoomIndicator}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          Click to zoom
        </div>
      </div>
      {showLightbox && (
        <Lightbox
          attachments={[attachment]}
          startingIndex={0}
          close={() => setShowLightbox(false)}
        />
      )}
    </>
  );
};

export default ClickableImage;
