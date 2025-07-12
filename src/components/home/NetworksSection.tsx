import { Button } from '@heroui/button';
import { ArrowRight, Tv } from 'lucide-react';
import { Link } from 'react-router';
import { Slider } from '@/components/ui/slider';
import { NETWORKS } from '@/utils/constants/TMDB';

export default function NetworksSection() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Primary-500 to-Secondary-500 shadow-Primary-500/20 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Tv className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <h2 className='text-2xl font-bold text-white'>Popular Networks</h2>
            <p className='text-Grey-400 mt-1 text-sm'>Discover trending content from top streaming platforms</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/networks'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          View All
        </Button>
      </div>

      <Slider autoplay>
        {NETWORKS.slice(0, 12).map((network) => (
          <Slider.Slide key={network.id} className='group w-[250px] sm:w-[300px]!'>
            <Link
              to={`/networks/${network.slug}`}
              className='hover:bg-blur grid aspect-video place-content-center rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 '
            >
              <img
                src={network.logo}
                alt={network.name}
                className='h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:invert'
              />
            </Link>
          </Slider.Slide>
        ))}
      </Slider>
    </div>
  );
}
