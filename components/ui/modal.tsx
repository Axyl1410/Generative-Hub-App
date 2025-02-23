import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type?: "modal" | "sidebar";
  [key: string]: unknown;
}

const Modal: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  type = "modal",
  ...props
}) => {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isOpen = false;
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen &&
        (type === "modal" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            {...props}
          >
            <div
              className="flex h-full w-full items-center justify-center bg-black/80 backdrop-blur-md"
              onClick={handleBackdropClick}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="relative mx-4 flex items-center justify-center rounded border bg-background-light p-8 text-text shadow-lg dark:bg-black dark:text-white md:max-w-[60vw]"
              >
                <button
                  onClick={onClose}
                  className="absolute right-1 top-1 flex aspect-square text-center text-4xl"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                {children}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-40 bg-black/80 px-5 backdrop-blur-md"
            {...props}
          >
            <div
              className="!container mt-[80px] flex h-full max-h-[calc(100vh-80px)] w-full justify-end pb-3.5"
              onClick={handleBackdropClick}
            >
              <motion.div
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  ease: "easeOut",
                }}
                className="relative flex h-fit w-[250px] items-center justify-center rounded bg-background-light shadow-lg dark:bg-background-dark"
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        ))}
    </AnimatePresence>,
    document.body
  );
};

Modal.displayName = "Dialog";

export default dynamic(() => Promise.resolve(React.memo(Modal)), {
  ssr: false,
});
