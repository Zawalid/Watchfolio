import { useState } from 'react';
import { placeholder } from '@/utils/shimmer-placeholder';

type LazyImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export default function LazyImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.png',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(true);
    setHasError(true);
  };

  const actualSrc = hasError ? fallbackSrc : src;

  return (
    <div className='relative size-full'>
      {/* Shimmer placeholder */}
      {!isLoaded && (
        <div
          className='absolute inset-0 z-0'
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover' }}
        />
      )}

      {/* Actual image */}
      <img
        src={actualSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}
