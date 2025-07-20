import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Tooltip } from '@heroui/react';
import {
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Film,
  Tv,
  Layers,
  User,
  Settings,
  Home,
  Users,
  Tv2Icon,
} from 'lucide-react';

const footerLinks = [
  {
    title: 'Discover',
    links: [
      { label: 'Home', href: '/home', icon: <Home className='size-4' /> },
      { label: 'Movies', href: '/movies', icon: <Film className='size-4' /> },
      { label: 'TV Shows', href: '/tv', icon: <Tv className='size-4' /> },
      { label: 'Collections', href: '/collections', icon: <Layers className='size-4' /> },
      { label: 'Celebrities', href: '/celebrities', icon: <Users className='size-4' /> },
      { label: 'Networks', href: '/networks', icon: <Tv2Icon className='size-4' /> },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Library', href: '/library', icon: <User className='size-4' /> },
      { label: 'Favorites', href: '/library/favorites', icon: <User className='size-4' /> },
      { label: 'Settings', href: '/settings', icon: <Settings className='size-4' /> },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/legal/terms-of-service', icon: null },
      { label: 'Privacy Policy', href: '/legal/privacy-policy', icon: null },
    ],
  },
];

const socialLinks = [
  { icon: <Github className='size-4' />, href: 'https://github.com/zawalid', label: 'GitHub' },
  { icon: <Linkedin className='size-4' />, href: 'https://www.linkedin.com/in/zakan-walid/', label: 'Linkedin' },
  { icon: <Twitter className='size-4' />, href: 'https://x.com/Zawaalid', label: 'X' },
  { icon: <Instagram className='size-4' />, href: 'https://www.instagram.com/walidzakan/', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className='mt-auto border-t border-white/10 bg-black/30 backdrop-blur-lg'>
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-12'>
          {/* Logo and Tagline */}
          <div className='md:col-span-4'>
            <Link to='/' className='flex w-fit items-center space-x-3'>
              <img src='/images/logo.svg' alt='Watchfolio' className='h-10 w-auto' />
              <span className='heading gradient text-2xl'>Watchfolio</span>
            </Link>
            <p className='text-Grey-400 mt-4 max-w-xs text-sm'>
              Your universe of movies and TV shows. Track, discover, and remember your journey through the world of
              entertainment.
            </p>
          </div>

          {/* Links */}
          <div className='grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3'>
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className='text-sm font-semibold tracking-wider text-white uppercase'>{section.title}</h3>
                <ul className='mt-4 space-y-3'>
                  {section.links.map((link) => (
                    <li key={link.label} className='group relative w-fit'>
                      <motion.div whileHover={{ x: 4 }}>
                        <Link
                          to={link.href}
                          className='text-Grey-400 hover:text-Primary-300 flex items-center gap-2 transition-colors duration-300'
                        >
                          {link.icon && <span className='opacity-60'>{link.icon}</span>}
                          {link.label}
                        </Link>
                        <span className='bg-Primary-400 absolute -bottom-0.5 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full'></span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row'>
          <p className='text-Grey-500 text-sm'>&copy; {new Date().getFullYear()} Watchfolio. All Rights Reserved.</p>

          <div className='flex items-center gap-3'>
            <p className='text-Grey-500 text-sm'>Data provided by</p>
            <a href='https://www.themoviedb.org/' target='_blank' rel='noopener noreferrer'>
              <img
                src='https://files.readme.io/29c6fee-blue_short.svg'
                alt='TMDB'
                className='h-3 w-auto transition-opacity hover:opacity-80'
              />
            </a>
          </div>

          <div className='flex items-center gap-3'>
            <p className='text-Grey-500 text-sm'>Made by</p>
            <Tooltip
              content={
                <div className='flex flex-col gap-2.5 py-1.5'>
                  <img
                    src='https://avatars.githubusercontent.com/u/114166197?v=4'
                    alt='Walid Zakan'
                    className='h-36 w-full rounded-md object-cover'
                  />
                  <div className='space-y-2.5'>
                    <div className='text-center'>
                      <h2 className='text-lg font-semibold text-white'>Walid Zakan</h2>
                      <h4 className='text-xs font-medium text-gray-400'>Full Stack Developer</h4>
                    </div>
                    <div className='flex justify-center gap-3 border-t border-white/10 pt-2'>
                      {socialLinks.map((social) => (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          aria-label={social.label}
                          whileHover={{ scale: 1.2, y: -3 }}
                          className='text-Grey-400 transition-colors duration-300 hover:text-white'
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              <button className='heading gradient font-semibold text-base italic'>Walid Zakan</button>
            </Tooltip>
          </div>
        </div>
      </div>
    </footer>
  );
}

