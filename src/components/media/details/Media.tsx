import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab } from '@heroui/react';
import { TABS_CLASSNAMES } from '@/styles/heroui';
import { Video, Image } from 'lucide-react';
import { SwiperSlide } from 'swiper/react';
import { Slider } from '@/components/ui/Slider';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from '@/components/ui/MorphingDialog';
import { LazyImage } from '@/components/ui/LazyImage';
import { getTmdbImage } from '@/utils/media';

interface MediaProps {
  videos: Video[];
  images?: Images;
  mediaTitle: string;
}

export default function Media({ videos, images, mediaTitle }: MediaProps) {
  const [selectedTab, setSelectedTab] = useState<'videos' | 'images'>('videos');

  // Check if we have any content
  const hasVideos = videos && videos.length > 0;
  const hasImages = images && (images.backdrops?.length || images.posters?.length || images.logos?.length);

  if (!hasVideos && !hasImages) return null;

  const renderVideos = () => {
    if (!hasVideos) {
      return (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='mb-4 rounded-full bg-gray-800/50 p-4'>
            <Video className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-white'>No videos available</h3>
          <p className='text-gray-400'>There are no videos for this {mediaTitle.toLowerCase()} yet.</p>
        </div>
      );
    }

    return (
      <div className='relative'>
        <Slider spaceBetween={16} className='videos-slider'>
          {videos.map((video) => (
            <SwiperSlide key={video.id} className='w-[430px]!'>
              <MorphingDialog
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <MorphingDialogTrigger className='group w-full overflow-hidden rounded-lg'>
                  <div className='relative aspect-video w-full'>
                    <img
                      src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                      alt={video.name}
                      className='size-full object-cover'
                    />
                    <div className='absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:bg-black/50'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='h-6 w-6'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className='p-2'>
                    <p className='line-clamp-1 text-sm font-medium text-white'>{video.name}</p>
                    <p className='text-xs text-gray-400'>
                      {video.official ? 'Official' : 'Unofficial'} • {video.type} • YouTube
                    </p>
                  </div>
                </MorphingDialogTrigger>
                <MorphingDialogContainer>
                  <MorphingDialogContent className='relative aspect-video max-h-[85vh] w-full max-w-[85vw] overflow-hidden rounded-xl'>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                      title={video.name}
                      className='size-full'
                      allowFullScreen
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    />
                  </MorphingDialogContent>
                  <MorphingDialogClose />
                </MorphingDialogContainer>
              </MorphingDialog>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    );
  };

  const renderImages = () => {
    if (!hasImages) {
      return (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='mb-4 rounded-full bg-gray-800/50 p-4'>
            <Image className='h-8 w-8 text-gray-400' />
          </div>
          <h3 className='mb-2 text-lg font-semibold text-white'>No images available</h3>
          <p className='text-gray-400'>There are no images for this {mediaTitle.toLowerCase()} yet.</p>
        </div>
      );
    }

    // Get all images
    const allImages = [
      ...(images.backdrops || []).map((img) => ({ ...img, type: 'backdrop' })),
      ...(images.posters || []).map((img) => ({ ...img, type: 'poster' })),
      ...(images.logos || []).map((img) => ({ ...img, type: 'logo' })),
    ];

    return (
      <div className='relative'>
        <Slider spaceBetween={16} className='images-slider'>
          {allImages.map((image, index) => (
            <SwiperSlide key={`${image.file_path}-${index}`} className='w-[430px]!'>
              <MorphingDialog
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <MorphingDialogTrigger className='group w-full overflow-hidden rounded-lg'>
                  <div className='relative aspect-video w-full'>
                    <LazyImage
                      src={getTmdbImage(image, 'w500')}
                      alt={`${mediaTitle} ${image.type}`}
                      className='size-full object-cover'
                    />
                  </div>
                  <div className='p-2'>
                    <p className='line-clamp-1 text-sm font-medium text-white capitalize'>{image.type}</p>
                    <p className='text-xs text-gray-400'>
                      {image.width}×{image.height}
                    </p>
                  </div>
                </MorphingDialogTrigger>
                <MorphingDialogContainer>
                  <MorphingDialogContent className='relative aspect-video max-h-[85vh] w-full max-w-[85vw] overflow-hidden rounded-xl'>
                    <img
                      src={getTmdbImage(image, 'original')}
                      alt={`${mediaTitle} ${image.type}`}
                      className='object-contain'
                    />
                  </MorphingDialogContent>
                  <MorphingDialogClose />
                </MorphingDialogContainer>
              </MorphingDialog>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    );
  };

  const getTabContent = () => {
    switch (selectedTab) {
      case 'videos':
        return renderVideos();
      case 'images':
        return renderImages();
      default:
        return null;
    }
  };

  return (
    <section className='py-6'>
      <div className='mb-6'>
        <div className='flex items-center justify-between gap-5'>
          <h2 className='text-2xl font-semibold text-white'>Media</h2>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as 'videos' | 'images')}
            classNames={TABS_CLASSNAMES}
          >
            <Tab
              key='videos'
              title={
                <div className='flex items-center gap-2'>
                  <Video className='size-4' />
                  <span>Videos</span>
                  {hasVideos && (
                    <span className='flex min-w-6 items-center justify-center rounded-full border border-white/5 bg-white/10 p-1 text-xs font-medium text-white'>
                      {videos.length}
                    </span>
                  )}
                </div>
              }
            />
            <Tab
              key='images'
              title={
                <div className='flex items-center gap-2'>
                  <Image className='size-4' />
                  <span>Images</span>
                  {hasImages && (
                    <span className='flex min-w-6 items-center justify-center rounded-full border border-white/5 bg-white/10 p-1 text-xs font-medium text-white'>
                      {(images.backdrops?.length || 0) + (images.posters?.length || 0) + (images.logos?.length || 0)}
                    </span>
                  )}
                </div>
              }
            />
          </Tabs>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {getTabContent()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
