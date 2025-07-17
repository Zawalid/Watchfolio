import { Modal as M, ModalContent, ModalProps } from '@heroui/react';
import { cn } from '@/utils';

interface Props extends ModalProps {
  children: React.ReactNode;
  disclosure: Disclosure;
}

const defaultClassNames = {
  wrapper: 'overflow-hidden',
  body: 'overflow-auto  py-6',
  backdrop: 'bg-black/50 backdrop-blur-[3px]',
  base: 'border-border backdrop-blur-xl bg-blur blur-bg text-[#a8b0d3] max-h-[90vh]',
  header: 'border-b-[1px] border-border',
  footer: 'border-t-[1px] border-border',
  closeButton: 'border border-transparent hover:border-white/10 hover:bg-white/5',
};

export function Modal({ children, disclosure, classNames = {}, ...props }: Props) {
  const { isOpen, onOpenChange } = disclosure;

  const mergedClassNames = {
    wrapper: cn(defaultClassNames.wrapper, classNames.wrapper),
    body: cn(defaultClassNames.body, classNames.body),
    backdrop: cn(defaultClassNames.backdrop, classNames.backdrop),
    base: cn(defaultClassNames.base, classNames.base),
    header: cn(defaultClassNames.header, classNames.header),
    footer: cn(defaultClassNames.footer, classNames.footer),
    closeButton: cn(defaultClassNames.closeButton, classNames.closeButton),
  };

  return (
    <M
      placement='center'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop='blur'
      classNames={mergedClassNames}
      {...props}
    >
      <ModalContent>{children}</ModalContent>
    </M>
  );
}
