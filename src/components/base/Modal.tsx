import { AnimatePresence, motion } from "motion/react";

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
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className={"fixed inset-0 flex items-center justify-center z-80"}
            onClick={onClose}
          >
            {/* 배경 오버레이 */}
            <motion.div
              className={"absolute inset-0 bg-black opacity-50 z-80"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* 모달 창 */}
            <motion.div
              className={
                "relative text-center rounded-xl pt-10 pb-8 px-12 w-4/5 bg-white z-90"
              }
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {title && <h2 className={"text-xl font-bold"}>{title}</h2>}
              {description && (
                <p
                  className={"text-gray-600"}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {description}
                </p>
              )}
              <div className={""}>{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
