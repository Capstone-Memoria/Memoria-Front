interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`fixed inset-0 flex items-center justify-center z-50 ${open ? "block" : "hidden"}`}
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className={"absolute inset-0 bg-black opacity-50"} />
      {/* 모달 창 */}
      <div
        className={
          "relative text-center rounded-xl pt-10 pb-8 px-15 w-4/5 bg-white"
        }
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className={"text-xl font-bold"}>{title}</h2>}
        {description && <p className={"text-gray-600"}>{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
