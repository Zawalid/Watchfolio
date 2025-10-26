import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import {
  Download as DownloadIcon,
  Github,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Cloud,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { APP_VERSION, GITHUB_URL, PLATFORM_DOWNLOADS } from '@/config/downloads';
import { usePageTitle } from '@/hooks/usePageTitle';
import { AppleIcon, WindowsIcon, LinuxIcon, DebianIcon, AndroidIcon } from '@/components/ui/Icons';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  if (platform.includes('mac') || userAgent.includes('mac')) return 'macos';
  if (platform.includes('win') || userAgent.includes('win')) return 'windows';
  if (platform.includes('linux') || userAgent.includes('linux') || userAgent.includes('x11')) return 'linux';

  return 'unknown';
}

interface DownloadOption {
  title: string;
  description: string;
  platforms: {
    name: string;
    label: string;
    downloadUrl: string;
    fileType: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
  color: string;
  available: boolean;
}

const downloadOptions: DownloadOption[] = [
  {
    title: 'Desktop App',
    description: 'Native desktop application with system integration and offline support',
    color: 'from-Primary-500 to-Secondary-500',
    available: true,
    platforms: [
      {
        name: 'macOS',
        label: 'macOS (Apple Silicon)',
        downloadUrl: PLATFORM_DOWNLOADS.macOS.appleSilicon.url,
        fileType: 'DMG',
        icon: AppleIcon,
      },
      {
        name: 'macOS',
        label: 'macOS (Intel)',
        downloadUrl: PLATFORM_DOWNLOADS.macOS.intel.url,
        fileType: 'DMG',
        icon: AppleIcon,
      },
      {
        name: 'Windows',
        label: 'Windows',
        downloadUrl: PLATFORM_DOWNLOADS.windows.url,
        fileType: 'EXE',
        icon: WindowsIcon,
      },
      {
        name: 'Linux',
        label: 'Linux (Debian/Ubuntu)',
        downloadUrl: PLATFORM_DOWNLOADS.linux.deb.url,
        fileType: 'DEB',
        icon: DebianIcon,
      },
      {
        name: 'Linux',
        label: 'Linux (AppImage)',
        downloadUrl: PLATFORM_DOWNLOADS.linux.appImage.url,
        fileType: 'AppImage',
        icon: LinuxIcon,
      },
    ],
  },
  {
    title: 'Mobile App',
    description: 'Native mobile experience with push notifications and quick actions',
    color: 'from-Tertiary-500 to-Warning-500',
    available: false,
    platforms: [
      {
        name: 'iOS',
        label: 'iOS (Coming Soon)',
        downloadUrl: '#',
        fileType: 'App Store',
        icon: AppleIcon,
      },
      {
        name: 'Android',
        label: 'Android (Coming Soon)',
        downloadUrl: '#',
        fileType: 'APK',
        icon: AndroidIcon,
      },
    ],
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Native performance with instant startup',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure',
  },
  {
    icon: Cloud,
    title: 'Auto Updates',
    description: 'Always get the latest features',
  },
];

export default function Download() {
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>('unknown');
  usePageTitle('Download App');

  useEffect(() => {
    setDetectedPlatform(detectPlatform());
  }, []);

  const getPrimaryDownloadUrl = (): string => {
    const desktopOption = downloadOptions.find((opt) => opt.available);
    if (!desktopOption) return '#';

    switch (detectedPlatform) {
      case 'macos':
        return (
          desktopOption.platforms.find((p) => p.name === 'macOS' && p.label.includes('Apple Silicon'))?.downloadUrl ||
          '#'
        );
      case 'windows':
        return desktopOption.platforms.find((p) => p.name === 'Windows')?.downloadUrl || '#';
      case 'linux':
        return desktopOption.platforms.find((p) => p.name === 'Linux' && p.fileType === 'DEB')?.downloadUrl || '#';
      default:
        return desktopOption.platforms[0]?.downloadUrl || '#';
    }
  };

  const getPlatformLabel = (): string => {
    switch (detectedPlatform) {
      case 'macos':
        return 'Download for macOS';
      case 'windows':
        return 'Download for Windows';
      case 'linux':
        return 'Download for Linux';
      default:
        return 'Download Now';
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden'>
      <motion.div variants={containerVariants} initial='hidden' animate='visible'>
        <section className='flex min-h-[80vh] items-center justify-center px-4 pt-16 sm:px-6 sm:pt-20'>
          <div className='mx-auto max-w-5xl text-center'>
            <motion.div variants={itemVariants} className='space-y-4 sm:space-y-6'>
              <motion.div
                variants={itemVariants}
                className='border-Primary-500/30 bg-Primary-500/10 text-Primary-300 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm'
              >
                <Sparkles className='h-3 w-3 sm:h-4 sm:w-4' />
                <span>Download Watchfolio</span>
                <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4' />
              </motion.div>

              <motion.div variants={itemVariants} className='space-y-3 sm:space-y-4'>
                <h1 className='heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl'>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    Your Watchlist,
                  </motion.span>
                  <br />
                  <motion.span
                    className='gradient inline!'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Everywhere You Go
                  </motion.span>
                </h1>

                <motion.p
                  variants={itemVariants}
                  className='text-Grey-400 mx-auto max-w-2xl text-sm leading-relaxed sm:text-base lg:text-lg'
                >
                  Experience Watchfolio natively on your device with blazing-fast performance, offline support, and
                  seamless sync across all platforms.
                </motion.p>
              </motion.div>

              <motion.div variants={itemVariants} className='flex flex-col items-center justify-center gap-3 pt-2'>
                <Button
                  as='a'
                  href={getPrimaryDownloadUrl()}
                  size='lg'
                  className='button-primary! w-full px-8! sm:w-auto sm:px-10!'
                  startContent={<DownloadIcon className='h-4 w-4 sm:h-5 sm:w-5' />}
                >
                  {getPlatformLabel()}
                </Button>
                <p className='text-Grey-400 text-xs sm:text-sm'>
                  Version {APP_VERSION} • Free and Open Source •{' '}
                  <a
                    href={GITHUB_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-Primary-400 hover:text-Primary-300 inline-flex items-center gap-1 transition-colors'
                  >
                    <Github className='h-3 w-3' />
                    View on GitHub
                  </a>
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className='mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-3'>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={cardVariants}
                  custom={index}
                  className='rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6'
                >
                  <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${downloadOptions[0].color} sm:h-12 sm:w-12`}>
                    <feature.icon className='h-5 w-5 text-white sm:h-6 sm:w-6' />
                  </div>
                  <h3 className='mb-1 text-sm font-semibold text-white sm:mb-2 sm:text-base'>{feature.title}</h3>
                  <p className='text-Grey-400 text-xs sm:text-sm'>{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className='px-4 py-12 sm:px-6 sm:py-16'>
          <div className='mx-auto max-w-6xl'>
            <motion.div
              variants={itemVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              className='mb-8 space-y-2 text-center sm:mb-12 sm:space-y-3'
            >
              <h2 className='heading text-2xl sm:text-3xl lg:text-4xl'>
                Choose Your
                <span className='gradient'> Platform</span>
              </h2>
              <p className='text-Grey-400 mx-auto max-w-2xl text-sm sm:text-base'>
                Download Watchfolio for your device and start tracking your entertainment journey
              </p>
            </motion.div>

            <div className='space-y-6 sm:space-y-8'>
              {downloadOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  variants={cardVariants}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1 }}
                  className='relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl'
                >
                  <div className='p-6 sm:p-8'>
                    <div className='mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='flex items-center gap-4'>
                        <div>
                          <h3 className='text-lg font-bold text-white sm:text-xl'>{option.title}</h3>
                          <p className='text-Grey-400 text-sm sm:text-base'>{option.description}</p>
                        </div>
                      </div>
                      {!option.available && (
                        <div className='bg-Warning-500/20 text-Warning-400 rounded-full px-3 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm'>
                          Coming Soon
                        </div>
                      )}
                    </div>

                    <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                      {option.platforms.map((platform) => (
                        <motion.div
                          key={platform.label}
                          whileHover={option.available ? { scale: 1.02 } : undefined}
                          whileTap={option.available ? { scale: 0.98 } : undefined}
                          className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 transition-all ${
                            option.available
                              ? 'cursor-pointer hover:border-white/20 hover:bg-white/10'
                              : 'cursor-not-allowed opacity-60'
                          }`}
                          onClick={() => {
                            if (option.available && platform.downloadUrl !== '#') {
                              window.location.href = platform.downloadUrl;
                            }
                          }}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              {platform.icon && (
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
                                  <platform.icon className='h-4 w-4 text-white' />
                                </div>
                              )}
                              <div>
                                <div className='text-sm font-semibold text-white'>{platform.label}</div>
                                <div className='text-Grey-400 text-xs'>{platform.fileType}</div>
                              </div>
                            </div>
                            {option.available ? (
                              <DownloadIcon className='text-Grey-400 group-hover:text-Primary-400 h-5 w-5 transition-colors' />
                            ) : (
                              <div className='text-Grey-500 text-xs'>Soon</div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {option.available && (
                      <div className='mt-4 flex items-start gap-2 rounded-lg bg-white/5 p-3'>
                        <CheckCircle className='text-Success-400 mt-0.5 h-4 w-4 shrink-0' />
                        <p className='text-Grey-300 text-xs sm:text-sm'>
                          All desktop apps include automatic updates, offline support, and native system integration
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className='px-4 py-12 sm:px-6 sm:py-16'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              className='relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center backdrop-blur-xl sm:rounded-3xl sm:p-12'
            >
              <div className='from-Primary-500/20 to-Secondary-500/20 absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-3xl' />
              <div className='from-Tertiary-500/20 to-Success-500/20 absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-3xl' />

              <motion.div variants={containerVariants} className='relative space-y-6'>
                <motion.div variants={itemVariants} className='space-y-3'>
                  <h3 className='heading text-2xl sm:text-3xl lg:text-4xl'>Open Source & Free Forever</h3>
                  <p className='text-Grey-300 mx-auto max-w-2xl text-sm leading-relaxed sm:text-base lg:text-lg'>
                    Watchfolio is built in the open with transparency and community at its core. View the source code,
                    contribute, or build your own version.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
                  <Button
                    as='a'
                    href={GITHUB_URL}
                    target='_blank'
                    rel='noopener noreferrer'
                    size='lg'
                    className='button-primary! w-full px-8! sm:w-auto'
                    startContent={<Github className='h-4 w-4 sm:h-5 sm:w-5' />}
                  >
                    View on GitHub
                  </Button>
                  <Button
                    as={Link}
                    to='/'
                    size='lg'
                    className='button-secondary! w-full bg-transparent! px-8! sm:w-auto'
                  >
                    Back to Home
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
