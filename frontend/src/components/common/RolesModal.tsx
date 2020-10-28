import React from "react";
import Modal from "react-bootstrap/esm/Modal";

type RolesModalProps = {
  show: boolean;
  onClose: () => void;
};

export default function RolesModal(props: RolesModalProps) {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Woohoo, you're reading this text in a modal! `.repeat(100)}
      </Modal.Body>
    </Modal>
  );
}
