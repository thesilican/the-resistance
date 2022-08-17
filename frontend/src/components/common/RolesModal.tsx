import Modal from "react-bootstrap/esm/Modal";
import s from "./RolesModal.module.scss";
import { TFail, TRole, TSuccess } from "./TextFormat";

type RolesModalProps = {
  hideFullRulesLink?: boolean;
  show: boolean;
  onClose: () => void;
};

export default function RolesModal(props: RolesModalProps) {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>The Resistance Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body className={s.body}>
        <h1 className={s.header}>Classic</h1>
        <span>
          <TRole role="agent" />{" "}
        </span>
        <span>Knows only themself</span>
        <span>
          <TRole role="spy" />{" "}
        </span>
        <span>
          Knows other <TFail>spies</TFail>
        </span>
        <h1 className={s.header}>Assassins Mode</h1>
        <span>
          <TRole role="captain" />
        </span>
        <span>
          Knows other <TFail>spies</TFail>
        </span>
        <span>
          <TRole role="deputy" />
        </span>
        <span>
          Knows the <TRole role="captain" />
        </span>
        <span>
          <TRole role="assassin" />
        </span>
        <span>
          Attempts to assassinate the <TRole role="captain" /> if the{" "}
          <TSuccess>agents</TSuccess> would win
        </span>
        <span>
          <TRole role="imposter" />
        </span>
        <span>
          Appears as <TRole role="captain" /> to the <TRole role="deputy" />
        </span>
        <h1 className={s.header}>Custom Mode</h1>
        <span>
          <TRole role="intern" />
        </span>
        <span>
          Role is unknown to other <TFail>spies</TFail>, does not know other{" "}
          <TFail>spies</TFail>
        </span>
        <span>
          <TRole role="mole" />
        </span>
        <span>
          Role is unknown to the <TRole role="captain" />
        </span>
      </Modal.Body>
    </Modal>
  );
}
