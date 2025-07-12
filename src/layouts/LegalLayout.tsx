import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { cn } from '@/utils';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
  sections: Section[];
}

export default function LegalLayout({ title, lastUpdated, children, sections }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -75% 0px' } // Trigger when section is in the upper quarter of the viewport
    );

    const elements = sections.map(sec => document.getElementById(sec.id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el!));

    return () => elements.forEach((el) => observer.unobserve(el!));
  }, [sections]);

  return (
    <div className='mx-auto grid max-w-6xl grid-cols-1 gap-16 py-12 lg:grid-cols-4'>
      {/* Sticky Sidebar */}
      <aside className='top-28 h-fit lg:sticky lg:col-span-1'>
        <div className='space-y-2'>
          {sections.map((section) => (
            <li key={section.id} className='list-none'>
              <a
                href={`#${section.id}`}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
                  activeSection === section.id ? 'text-white' : 'text-Grey-400 hover:bg-white/5 hover:text-white'
                )}
              >
                {activeSection === section.id && (
                  <motion.div layoutId='legal-sidebar-indicator' className='absolute inset-0 rounded-lg bg-white/10' />
                )}
                <span className='relative z-10'>{section.title}</span>
              </a>
            </li>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className='lg:col-span-3'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className='space-y-8'>
            <div className='flex items-center gap-3'>
              <div className='from-Success-400 to-Primary-400 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br'>
                <Shield className='size-7 text-white' />
              </div>
              <div>
                <h1 className='heading gradient'>{title}</h1>
                <p className='text-Grey-400 mt-1 text-sm'>Last Updated: {lastUpdated}</p>
              </div>
            </div>
            <div className='prose-custom'>{children}</div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
