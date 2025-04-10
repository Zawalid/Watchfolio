import { Modal as M, ModalContent, ModalProps } from "@heroui/modal";

interface Props extends ModalProps {
  children: React.ReactNode;
  disclosure: disclosure;
}

export default function Modal({ children, disclosure, ...props }: Props) {
  const { isOpen, onOpenChange } = disclosure;

  return (
    <M
      placement='center'
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop='blur'
      classNames={{
        body: 'py-6',
        backdrop: 'bg-black/50 backdrop-blur-[3px]',
        base: 'border-border blur-bg text-[#a8b0d3]',
        header: 'border-b-[1px] border-border',
        footer: 'border-t-[1px] border-border',
      }}
      {...props}
    >
      <ModalContent>{children}</ModalContent>
    </M>
  );
}
