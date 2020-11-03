import React from "react";
import Modal from "react-bootstrap/esm/Modal";
import TF from "./TextTransformer";
import styles from "../../styles/common/RolesModal.module.scss";

type RolesModalProps = {
  show: boolean;
  onClose: () => void;
};

export default function RolesModal(props: RolesModalProps) {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>The Resistance Roles</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Classic Mode</h3>
        <p>
          <span className={styles.role}>
            <TF>{`{{success:Agent}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`The steadfast {{success:agents}} of the resistance collective must embark on missions to destroy ` +
                `the evil government empire and restore order to the world`}
            </TF>
          </span>
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
          <span className={styles.role}>
            <TF>{`{{fail:Spy}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`The government {{fail:spies}} have infiltrated the resistance collective and work ` +
                `secretly to sabotage the agents' missions`}
            </TF>
          </span>
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

        <h3>Assasins Mode</h3>
        <p>
          <span className={styles.role}>
            <TF>{`{{success:Captain}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`Although the resistance {{success:Captain}} has access to the spy master list, he must keep ` +
                `his identity secret, lest he gets assasinated`}
            </TF>
          </span>
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
          <span className={styles.role}>
            <TF>{`{{fail:Assasin}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`Sharpening his switch-knife blade, the {{fail:Assasin}} lurks in the shadows, ` +
                `waiting for the perfect moment to strike`}
            </TF>
          </span>
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
          <span className={styles.role}>
            <TF>{`{{fail:Intern}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`The foolish {{fail:Intern}} forgot his identification card at last week's spy meeting ` +
                `and now no longer knows who his teammates are`}
            </TF>
          </span>
          <ul>
            <li>
              <TF>
                {`The {{fail:Intern}} does not know who any of the spies are, ` +
                  `nor do any spies know who the {{fail:Intern}} is`}
              </TF>
            </li>
            <li>
              <TF>
                {`However, his identity is still known to the {{success:Captain}}`}
              </TF>
            </li>
            <li>
              <TF>
                {`The {{fail:Intern}} only appears in games with 7 or more people in assasins mode`}
              </TF>
            </li>
          </ul>
        </p>

        <h3>Custom Mode</h3>
        <p>
          <span className={styles.role}>
            <TF>{`{{success:Deputy}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`As the {{success:Captain}}'s most loyal assistant, the {{success:Deputy}} must assist with leading ` +
                `the resistance collective to victory`}
            </TF>
          </span>
          <ul>
            <li>
              <TF>
                {`The {{success:Deputy}} knows who the {{success:Captain}} is`}
              </TF>
            </li>
            <li>
              <TF>
                {`However the {{fail:Imposter}} will also appear as a {{success:Captain}} to the {{success:Deputy}}`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <span className={styles.role}>
            <TF>{`{{fail:Imposter}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`Apparently a military peaked cap and dollar-store moustache was enough to disguise the ` +
                `{{fail:Imposter}} as the {{success:Captain}}`}
            </TF>
          </span>
          <ul>
            <li>
              <TF>
                {`The {{fail:Imposter}} appears as the {{success:Captain}} to the {{success:Deputy}}`}
              </TF>
            </li>
          </ul>
        </p>
        <p>
          <span className={styles.role}>
            <TF>{`{{fail:Mole}}`}</TF>
          </span>
          <br />
          <span className={styles.flavorText}>
            <TF>
              {`Hidden deep within the spy network lies the {{fail:Mole}}, constantly on guard to keep their ` +
                `existence unknown`}
            </TF>
          </span>
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
