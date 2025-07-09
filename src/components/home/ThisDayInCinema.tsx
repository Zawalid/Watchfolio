import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@heroui/button';
import { Link } from 'react-router';

interface CinemaEvent {
  type: 'release' | 'birthday' | 'award' | 'trivia';
  title: string;
  description: string;
  year?: number;
  image?: string;
  category?: string;
}

// Mock data - in a real app, this would come from an API
const getCinemaEvents = (): CinemaEvent[] => {
  // In a real implementation, we'd use the date to fetch relevant events
  // const month = date.getMonth() + 1;
  // const day = date.getDate();

  // Mock events for demonstration
  const events: CinemaEvent[] = [
    {
      type: 'release',
      title: 'The Godfather',
      description: "Francis Ford Coppola's masterpiece premiered",
      year: 1972,
      category: 'Classic Drama',
    },
    {
      type: 'birthday',
      title: 'Morgan Freeman',
      description: 'Legendary actor known for his distinctive voice',
      year: 1937,
      category: 'Actor',
    },
    {
      type: 'award',
      title: 'Academy Awards Ceremony',
      description: 'The 45th Academy Awards were held',
      year: 1973,
      category: 'Awards',
    },
    {
      type: 'trivia',
      title: 'Box Office Record',
      description: 'Star Wars became the highest-grossing film of all time',
      year: 1977,
      category: 'Milestone',
    },
  ];

  return events.slice(0, 3); // Show 3 events
};

const eventIcons = {
  release: Calendar,
  birthday: Star,
  award: Award,
  trivia: Clock,
};

const eventGradients = {
  release: 'from-Primary-500 to-Secondary-500',
  birthday: 'from-Tertiary-500 to-Primary-500',
  award: 'from-Warning-500 to-Error-500',
  trivia: 'from-Success-500 to-Secondary-500',
};

export default function ThisDayInCinema() {
  const currentDate = new Date();
  const [events, setEvents] = useState<CinemaEvent[]>([]);

  useEffect(() => {
    setEvents(getCinemaEvents());
  }, [currentDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='from-Warning-500 to-Primary-500 shadow-Warning-500/25 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
            <Calendar className='h-6 w-6 text-white drop-shadow-sm' />
          </div>

          <div>
            <div className='flex items-center gap-3'>
              <h2 className='text-2xl font-bold text-white'>This Day in Cinema</h2>
              <div className='border-Warning-500/30 bg-Warning-500/10 text-Warning-300 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm'>
                <Clock className='h-3 w-3' />
                <span>{formatDate(currentDate)}</span>
              </div>
            </div>
            <p className='text-Grey-400 mt-1 text-sm'>Celebrating cinema history and memorable moments from this day</p>
          </div>
        </div>

        <Button
          as={Link}
          to='/discover'
          size='sm'
          className='button-secondary! text-xs!'
          endContent={<ArrowRight className='h-4 w-4' />}
        >
          Discover More
        </Button>
      </div>

      {/* Events Timeline */}
      <div className='space-y-4'>
        {events.map((event, index) => {
          const IconComponent = eventIcons[event.type];
          const gradient = eventGradients[event.type];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className='group relative'
            >
              <div className='bg-blur flex gap-4 rounded-xl border border-white/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/5'>
                {/* Event Icon */}
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <IconComponent className='h-6 w-6 text-white drop-shadow-sm' />
                </div>

                {/* Event Content */}
                <div className='flex-1 space-y-2'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='group-hover:text-Primary-300 text-lg font-bold text-white transition-colors'>
                        {event.title}
                      </h3>
                      <p className='text-Grey-300 text-sm leading-relaxed'>{event.description}</p>
                    </div>

                    {event.year && (
                      <div className='flex flex-col items-end text-right'>
                        <div className='text-Primary-400 text-2xl font-bold'>{event.year}</div>
                        {event.category && <div className='text-Grey-400 mt-1 text-xs'>{event.category}</div>}
                      </div>
                    )}
                  </div>

                  {/* Event Type Badge */}
                  <div className='flex items-center gap-2'>
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                        event.type === 'release'
                          ? 'border-Primary-500/30 bg-Primary-500/10 text-Primary-300'
                          : event.type === 'birthday'
                            ? 'border-Tertiary-500/30 bg-Tertiary-500/10 text-Tertiary-300'
                            : event.type === 'award'
                              ? 'border-Warning-500/30 bg-Warning-500/10 text-Warning-300'
                              : 'border-Success-500/30 bg-Success-500/10 text-Success-300'
                      }`}
                    >
                      <IconComponent className='h-3 w-3' />
                      <span className='capitalize'>{event.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline connector (except for last item) */}
              {index < events.length - 1 && (
                <div className='from-Grey-600 mt-2 ml-6 h-4 w-0.5 bg-gradient-to-b to-transparent' />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Fun Fact Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className='border-Success-500/20 bg-Success-500/5 rounded-xl border p-4 text-center'
      >
        <div className='flex items-center justify-center gap-2 text-sm'>
          <Star className='text-Success-400 h-4 w-4' />
          <span className='text-Grey-300'>
            Did you know? The first movie theater opened on {formatDate(new Date(1905, 5, 19))} in 1905!
          </span>
        </div>
      </motion.div>
    </div>
  );
}
