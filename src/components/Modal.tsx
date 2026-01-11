import { FC, ReactNode } from "react";
import "../styles/Modal.css";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  title?: string;
}

const Modal: FC<ModalProps> = ({
  children,
  onClose,
  showCloseButton = false,
  title,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
        {title && <h1 className="modal-title">{title}</h1>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
