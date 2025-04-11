import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';
import { SwiperEvents, Swiper as SwiperType } from 'swiper/types';
import { Navigation, A11y, Keyboard, Mousewheel, Autoplay, FreeMode } from 'swiper/modules';
import { LEFT_ARROW_ICON, RIGHT_ARROW_ICON } from './Icons';
import { useRef, useState, useEffect } from 'react';

// ------------- Types & Interfaces -------------
export interface SliderProps extends Omit<SwiperProps, 'navigation' | 'modules'> {
  children: React.ReactNode;
  navigationIds?: { prev: string; next: string };
  className?: string;
  showNavigation?: boolean;
  customNavigationButtons?: {
    prev?: React.ReactNode;
    next?: React.ReactNode;
  };
  navigationClassName?: string;
  smartSlide?: boolean;
}

// ------------- Component -------------
function Slider({
  children,
  navigationIds = { prev: 'prev', next: 'next' },
  className = '',
  spaceBetween = 20,
  slidesPerView = 'auto',
  speed = 1500,
  showNavigation = true,
  customNavigationButtons,
  navigationClassName = 'absolute top-1/2 z-10 flex w-full -translate-y-1/2 justify-between',
  smartSlide = false,
  ...restProps
}: SliderProps) {
  // ------------- State & Refs -------------
  const swiperRef = useRef<{ swiper: SwiperType }>(null);
  const [disabledButtons, setDisabledButtons] = useState({ prev: false, next: false });
  const [allContentVisible, setAllContentVisible] = useState(false);

  // ------------- Effects -------------
  // Calculate visibility and button states
  useEffect(() => {
    if (!swiperRef.current?.swiper) return;
    const swiper = swiperRef.current.swiper;

    const updateButtonStates = () => {
      // Get total width of all slides including spacing
      const slidesWidth =
        Array.from(swiper.slides).reduce((total, slide: HTMLElement) => {
          return total + slide.offsetWidth;
        }, 0) +
        (swiper.slides.length - 1) * +spaceBetween;

      const containerWidth = swiper.width;
      const isAllVisible = slidesWidth <= containerWidth;

      setAllContentVisible(isAllVisible);

      // If all content fits in the container, disable both buttons
      if (isAllVisible) {
        setDisabledButtons({ prev: true, next: true });
        return;
      }

      // Otherwise, check beginning/end positions
      setDisabledButtons({ prev: swiper.isBeginning, next: swiper.isEnd });
    };

    // Initial check
    updateButtonStates();

    // Monitor for changes
    const events = ['resize', 'slideChange', 'update', 'afterInit', 'transitionEnd', 'observerUpdate'];
    events.forEach((event) => swiper.on(event as keyof SwiperEvents, updateButtonStates));

    // Cleanup
    return () => {
      events.forEach((event) => swiper.off(event as keyof SwiperEvents, updateButtonStates));
    };
  }, [spaceBetween, children]);

  // ------------- Handlers & Helpers -------------
  // Custom multi-slide navigation
  const handleNavigation = (direction: 'next' | 'prev') => {
    // Guard clauses
    if (!swiperRef.current?.swiper || !smartSlide || allContentVisible) return;
    if (direction === 'prev' && disabledButtons.prev) return;
    if (direction === 'next' && disabledButtons.next) return;

    const swiper = swiperRef.current.swiper;
    const containerWidth = swiper.width;
    const currentOffset = swiper.translate;
    const slideWidths = swiper.slides.map((slide: HTMLElement) => slide.offsetWidth + Number(spaceBetween));

    let totalWidth = 0;

    if (direction === 'next') {
      // Navigate forward by approximately one container width
      for (let i = swiper.activeIndex; i < swiper.slides.length; i++) {
        totalWidth += slideWidths[i];
        if (totalWidth > containerWidth) {
          swiper.slideTo(i, speed);
          return;
        }
      }
      // Fallback to last slide
      swiper.slideTo(swiper.slides.length - 1, speed);
    } else {
      // Navigate backward by approximately one container width
      // First, find the first visible slide
      let visibleIndex = swiper.activeIndex;
      for (let i = 0; i < swiper.slides.length; i++) {
        if (swiper.slidesGrid[i] >= Math.abs(currentOffset)) {
          visibleIndex = Math.max(0, i - 1);
          break;
        }
      }

      // Then calculate backward navigation
      totalWidth = 0;
      for (let i = visibleIndex; i >= 0; i--) {
        totalWidth += slideWidths[i];
        if (totalWidth > containerWidth) {
          swiper.slideTo(Math.max(0, i), speed);
          return;
        }
      }
      // Fallback to first slide
      swiper.slideTo(0, speed);
    }
  };

  // Generate button classes based on disabled state
  const getButtonClass = (isDisabled: boolean) => {
    return `top-0 grid h-10 w-10 place-content-center rounded-full border border-border bg-blur text-sm text-white backdrop-blur-2xl transition-all duration-300 ${
      isDisabled ? 'scale-0' : 'cursor-pointer'
    }`;
  };

  // ------------- Render -------------
  return (
    <Swiper
      ref={swiperRef}
      className={`relative ${className}`}
      modules={[Navigation, A11y, Keyboard, Mousewheel, Autoplay, FreeMode]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      centeredSlides={false}
      navigation={
        showNavigation && !smartSlide
          ? {
              nextEl: `#${navigationIds.next}`,
              prevEl: `#${navigationIds.prev}`,
              disabledClass: 'opacity-50 cursor-not-allowed',
            }
          : false
      }
      mousewheel={{ forceToAxis: true }}
      freeMode={true}
      speed={speed}
      keyboard={{ enabled: true, onlyInViewport: true }}
      grabCursor={true}
      {...restProps}
    >
      {/* Navigation Buttons */}
      {showNavigation && (
        <div className={navigationClassName}>
          <button
            id={navigationIds.prev}
            className={getButtonClass(disabledButtons.prev)}
            onClick={smartSlide ? () => handleNavigation('prev') : undefined}
            disabled={disabledButtons.prev}
            aria-disabled={disabledButtons.prev}
            aria-label='Previous slides'
          >
            {customNavigationButtons?.prev || LEFT_ARROW_ICON}
          </button>
          <button
            id={navigationIds.next}
            className={getButtonClass(disabledButtons.next)}
            onClick={smartSlide ? () => handleNavigation('next') : undefined}
            disabled={disabledButtons.next}
            aria-disabled={disabledButtons.next}
            aria-label='Next slides'
          >
            {customNavigationButtons?.next || RIGHT_ARROW_ICON}
          </button>
        </div>
      )}

      {/* Slider Content */}
      {children}
    </Swiper>
  );
}

Slider.Slide = SwiperSlide;

export default Slider;
