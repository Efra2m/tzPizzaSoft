import React, { MouseEvent } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div
      data-testid="modal-overlay"
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        data-testid="modal-content"
        className={styles.modal}
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <p>{message}</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default Modal;
