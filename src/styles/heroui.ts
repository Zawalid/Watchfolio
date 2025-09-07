export const SELECT_CLASSNAMES = {
  trigger: 'bg-white/5 border-2 border-white/5 w-full min-w-54 backdrop-blur-md hover:bg-white/10!',
  popoverContent: 'text-white/80 backdrop-blur-xl bg-blur blur-bg   border border-white/5',
  selectorIcon: 'text-Grey-600',
  listbox:
    '[&_li[data-hover=true]]:bg-white/5! [&_li[data-selected=true]]:text-white [&_li[data-selected=true]]:bg-Primary-400! [&_li[data-selected=true]]:font-medium',
};

export const DROPDOWN_CLASSNAMES = {
  base: 'min-w-64',
  content: 'backdrop-blur-xl bg-blur blur-bg  [&_kbd:first-child]:ml-5  text-white/80 border border-white/5',
};

export const AVATAR_CLASSNAMES = {
  base: 'bg-transparent ring-Primary-500/50 hover:ring-Primary-400/70 shadow-[0_0_30px_rgba(139,92,246,0.5)] ring-2 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.7)]',
  img: 'hover:scale-105 transition-transform duration-300',
};

export const TABS_CLASSNAMES = {
  tabList: 'bg-white/5 border border-white/5 backdrop-blur-md  p-1',
  tab: 'text-white/70 hover:text-white transition-colors duration-200 data-[selected=true]:text-white',
  cursor: 'bg-white/10! shadow-none!',
};

export const DRAWER_CLASSNAMES = {
  base: 'backdrop-blur-xl bg-blur blur-bg',
  wrapper: 'z-50',
  backdrop: 'bg-black/50 backdrop-blur-[3px]',
};
