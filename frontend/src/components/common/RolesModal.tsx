import React from "react";
import Modal from "react-bootstrap/esm/Modal";
import TF from "./TextTransformer";

type RolesModalProps = {
  show: boolean;
  onClose: () => void;
};

// Helper
const I = ({ children }: { children: React.ReactNode }) => (
  <span className="font-italic">{children}</span>
);

export default function RolesModal(props: RolesModalProps) {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>The Resistance Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Classic Mode</h4>
        <p>
          <TF>{`{{success:Agent}}`}</TF>
          <br />
          <I>
            <TF>{`The {{success:Agent}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>{`{{success:Agents}} do not know the role of any other players`}</TF>
            </li>
            <li>
              <TF>
                {`All players on the ` +
                  `{{success:agent}} team win if 3 missions are completed successfully`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <TF>{`{{fail:Spy}}`}</TF>
          <br />
          <I>
            <TF>{`The {{fail:Spy}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>{`{{fail:Spies}} know who all the other spies are`}</TF>
            </li>
            <li>
              <TF>
                {`All players on the ` +
                  `{{fail:spy}} team win if 3 missions fail`}
              </TF>
            </li>
          </ul>
        </p>

        <h4>Assasins Mode</h4>
        <p>
          <TF>{`{{success:Captain}}`}</TF>
          <br />
          <I>
            <TF>{`The {{success:Captain}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>{`The {{success:Captain}} knows who all the spies are`}</TF>
            </li>
            <li>
              <TF>
                {`However he must keep his identity a secret, otherwise the {{fail:Assasin}}` +
                  ` may assasinate him at the end of the game`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <TF>{`{{fail:Assasin}}`}</TF>
          <br />
          <I>
            <TF>{`The {{fail:Assasin}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>
                {`At the end of the game, if the agents win, ` +
                  `the {{fail:Assasin}} may select one player to assasinate`}
              </TF>
            </li>
            <li>
              <TF>
                {`If that player is the {{success:Captain}}, then the spies win instead`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <TF>{`{{fail:Intern}}`}</TF>
          <br />
          <I>
            <TF>{`The {{fail:Intern}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>
                {`The {{fail:Intern}} does not know who any of the spies are, ` +
                  `nor do any spies know who the {{fail:Intern}} is`}
              </TF>
            </li>
            <li>
              <TF>
                {`The {{fail:Intern}} only appears in games with 7 or more people in assasins mode`}
              </TF>
            </li>
          </ul>
        </p>

        <h4>Custom Mode</h4>
        <p>
          <TF>{`{{success:Deputy}}`}</TF>
          <br />
          <I>
            <TF>{`The {{success:Deputy}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>
                {`The {{success:Deputy}} knows who the {{success:Captain}} and {{fail:Imposter}} are, ` +
                  `but does not know who is who`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <TF>{`{{fail:Imposter}}`}</TF>
          <br />
          <I>
            <TF>{`The {{fail:Imposter}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>
                {`The {{fail:Imposter}} appears as the {{success:Captain}} to the {{success:Deputy}}`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <TF>{`{{fail:Mole}}`}</TF>
          <br />
          <I>
            <TF>{`The {{fail:Mole}} (insert flavour text here...)`}</TF>
          </I>
          <ul>
            <li>
              <TF>
                {`The {{fail:Mole}} is unknown to the {{success:Captain}}, but is still known to other spies`}
              </TF>
            </li>
          </ul>
        </p>
      </Modal.Body>
    </Modal>
  );
}
