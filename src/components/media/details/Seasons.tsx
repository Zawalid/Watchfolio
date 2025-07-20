import { SwiperSlide } from 'swiper/react';
import { Slider } from '@/components/ui/Slider';
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogTrigger,
} from '@/components/ui/MorphingDialog';
import { LazyImage } from '@/components/ui/LazyImage';
import SeasonDetails from './SeasonDetails';

export default function Seasons({ seasons, show }: { seasons: Season[]; show: TvShow }) {
  if (!seasons?.length) return null;

  // Remove specials (season 0) if there are other seasons
  const filteredSeasons = seasons.length > 1 ? seasons.filter((season) => season.season_number > 0) : seasons;

  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>Seasons</h2>
      <div className='relative'>
        <Slider spaceBetween={16} className='seasons-slider'>
          {filteredSeasons.map((season) => (
            <SwiperSlide key={season.id} className='w-[200px]!'>
              <MorphingDialog
                transition={{
                  duration: 0.3,
                  ease: 'easeInOut',
                }}
              >
                <MorphingDialogTrigger className='group w-full overflow-hidden rounded-lg'>
                  <div className='relative aspect-2/3 w-full'>
                    <LazyImage
                      src={
                        season.poster_path
                          ? `http://image.tmdb.org/t/p/w500${season.poster_path}`
                          : '/images/placeholder.png'
                      }
                      alt={`${show.name}: ${season.name}`}
                      className='size-full object-cover transition-transform group-hover:scale-105'
                    />
                    <div className='absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4'>
                      <p className='text-lg font-medium text-white'>{season.name}</p>
                      <p className='text-sm text-gray-300'>{season.episode_count} Episodes</p>
                    </div>
                  </div>
                </MorphingDialogTrigger>

                <MorphingDialogContainer>
                  <SeasonDetails season={season} show={show} />
                  <MorphingDialogClose />
                </MorphingDialogContainer>
              </MorphingDialog>
            </SwiperSlide>
          ))}
        </Slider>
      </div>
    </section>
  );
}
