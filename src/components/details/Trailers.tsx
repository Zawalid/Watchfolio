import { SwiperSlide } from 'swiper/react';
import Slider from '@/components/ui/slider';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from '@/components/ui/MorphingDialog';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

export default function Trailers({ videos }: { videos: Video[] }) {
  // Filter to only get trailers from YouTube
  const trailers = videos?.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');

  if (!trailers?.length) return null;

  return (
    <div className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>Trailers</h2>

      <div className='relative'>
        <Slider smartSlide={true} spaceBetween={16} className='trailers-slider'>
          {trailers.map((video) => (
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
                      className='h-full w-full object-cover'
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
                    <p className='text-xs text-gray-400'>{video.official ? 'Official' : 'Unofficial'} • YouTube</p>
                  </div>
                </MorphingDialogTrigger>
                <MorphingDialogContainer>
                  <MorphingDialogContent className='relative aspect-video max-h-[90vh] w-full max-w-[90vw] overflow-hidden rounded-xl bg-background'>
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                      title={video.name}
                      className='h-full w-full'
                      allowFullScreen
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    ></iframe>
                  </MorphingDialogContent>

                  <MorphingDialogClose />
                </MorphingDialogContainer>
              </MorphingDialog>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    </div>
  );
}
