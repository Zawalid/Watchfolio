import { Slider } from '@/components/ui/slider';
import { LazyImage } from '@/components/ui/LazyImage';
import { Link } from 'react-router';
import { slugify } from '@/utils';

export default function Cast({ cast }: { cast: Person[] }) {
  if (!cast?.length) return null; // TODO: Handle empty cast array

  return (
    <section className='py-6'>
      <h2 className='mb-4 text-2xl font-semibold text-white'>Main Cast</h2>
      <div className='relative'>
        <Slider>
          {cast?.map((member) => (
            <Slider.Slide key={member.id} className='group w-[100px]!'>
              <Link to={`/celebrities/${member.id}-${slugify(member.name)}`}>
                <div className='aspect-square overflow-hidden rounded-full'>
                  <LazyImage
                    src={
                      member.profile_path
                        ? `http://image.tmdb.org/t/p/original${member.profile_path}`
                        : '/images/placeholder.png'
                    }
                    alt={member.name}
                    className='size-full object-cover transition-transform duration-300 group-hover:scale-110'
                  />
                </div>
                <div className='mt-2 text-center'>
                  <p className='text font-medium text-white'>{member.name}</p>
                  <p className='text-sm text-gray-400'>{member.character}</p>
                </div>
              </Link>
            </Slider.Slide>
          ))}
        </Slider>
      </div>
    </section>
  );
}
