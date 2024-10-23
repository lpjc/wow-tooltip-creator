// LazyLoadImage.js
import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function LazyLoadImage({ src, alt, className, onClick, loading }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoaded(false); // Reset loaded state when loading is triggered
    }
  }, [loading]);

  return (
    <div className={`image-wrapper ${className}`} onClick={onClick}>
      {!loaded && (
        <Skeleton width={64} height={64} className="skeleton-loader" />
      )}
      <img
        src={src}
        alt={alt}
        className={`actual-image ${loaded ? 'visible' : 'hidden'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default LazyLoadImage;
