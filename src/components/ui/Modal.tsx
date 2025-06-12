import { Modal as M, ModalContent, ModalProps } from '@heroui/modal';
import { cn } from '@/utils';

interface Props extends ModalProps {
  children: React.ReactNode;
  disclosure: Disclosure;
}

const defaultClassNames = {
  wrapper: 'overflow-hidden',
  body: 'max-h-[90vh] overflow-auto bg-blur py-6',
  backdrop: 'bg-black/50 backdrop-blur-[3px]',
  base: 'border-border blur-bg text-[#a8b0d3]',
  header: 'bg-blur border-b-[1px] border-border',
  footer: 'bg-blur border-t-[1px] border-border',
};

export default function Modal({ children, disclosure, classNames = {}, ...props }: Props) {
  const { isOpen, onOpenChange } = disclosure;


  const mergedClassNames = {
    wrapper: cn(defaultClassNames.wrapper, classNames.wrapper),
    body: cn(defaultClassNames.body, classNames.body),
    backdrop: cn(defaultClassNames.backdrop, classNames.backdrop),
    base: cn(defaultClassNames.base, classNames.base),
    header: cn(defaultClassNames.header, classNames.header),
    footer: cn(defaultClassNames.footer, classNames.footer),
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
