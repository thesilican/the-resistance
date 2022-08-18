import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import RolesModal from "../common/RolesModal";
import { TFail, TRole, TSuccess } from "../common/TextFormat";
import s from "./HowToPlayView.module.scss";

export default function HowToPlayView() {
  const [rolesShown, setRolesShown] = useState(false);
  return (
    <div className={s.HowToPlayView}>
      <Link className={s.back} to="..">
        Return to homepage
      </Link>
      <RolesModal
        show={rolesShown}
        onClose={() => setRolesShown(false)}
        hideFullRulesLink
      />
      <Container>
        <Row>
          <Col xs={0} lg={1} />
          <Col xs={12} lg={10}>
            <h1 className={s.title}>The Resistance</h1>
            <h2>Classic Mode</h2>
            <p>
              In The Resistance, players are in one of two teams &ndash; the{" "}
              <TSuccess>agents</TSuccess> or the <TFail>spies</TFail>. All{" "}
              <TFail>spies</TFail> know the identities of all other{" "}
              <TFail>spies</TFail>, but <TSuccess>agents</TSuccess> only know
              their own identity.
            </p>
            <p>
              Each round, players select and vote for a team of people to go on
              a mission. If everyone on the team is an{" "}
              <TSuccess>agent</TSuccess>, then the mission will{" "}
              <TSuccess>succeed</TSuccess>. However, if there are any{" "}
              <TFail>spies</TFail> on the team, then they can cause the mission
              to <TFail>fail</TFail>.
            </p>
            <p>
              The <TSuccess>agents</TSuccess> win if 3 missions are completed{" "}
              <TSuccess>successfully</TSuccess>, and the <TFail>spies</TFail>{" "}
              win if 3 missions <TFail>fail</TFail>.
            </p>
            <p>
              Playing Classic mode is equivalent to playing the board game
              version of The Resistance.
            </p>
            <h2>Assassins Mode</h2>
            <p>
              In Assassins mode, there are three additional roles added to the
              game.
            </p>
            <p>
              One player on the <TSuccess>agent</TSuccess> team is the{" "}
              <TRole role="captain" />. The <TRole role="captain" /> knows the
              identities of all <TFail>spies</TFail>, and can use this
              information to their advantage. However, they must be careful not
              to expose themselves, otherwise they may be assassinated!
            </p>
            <p>
              One player on the <TFail>spy</TFail> team is the{" "}
              <TRole role="assassin" />. At the end of the game, if the{" "}
              <TSuccess>agents</TSuccess> would win, the{" "}
              <TRole role="assassin" /> may choose a player to assassinate. If
              that player is the <TRole role="captain" />, then the{" "}
              <TFail>spies</TFail> win instead.
            </p>
            <p>
              In games with 7 or more players, another player on the{" "}
              <TFail>spy</TFail> team is the <TRole role="intern" />. New to the
              spy collective, the <TRole role="intern" /> does not know the
              identities of the other <TFail>spies</TFail>, nor do any spies
              know the identity of the <TRole role="intern" />, thus he must be
              careful not to step on the shoes of the other spies.
            </p>
            <p>
              Playing Assassins mode is equivalent to playing with Merlin,
              Assassin, and Oberon from Avalon.
            </p>
            <h2>Custom Mode</h2>
            <p>
              In Custom mode, three more roles are available in the game,
              equivalent to the remaining roles from Avalon.
            </p>
            <p>
              The <TRole role="deputy" /> knows the identity of the{" "}
              <TRole role="captain" />, equivalent to Percival in Avalon.
            </p>
            <p>
              The <TRole role="imposter" /> appears as <TRole role="captain" />{" "}
              to the <TRole role="deputy" />, equivalent to Morgana in Avalon.
            </p>
            <p>
              The <TRole role="mole" /> mole is hidden from{" "}
              <TRole role="captain" />, equivalent to Mordred in Avalon.
            </p>
            <h2>Video Tutorial</h2>
            <p>
              For a more thorough explaination, the following video explains the
              full rules of The Resistance / Avalon
            </p>
            <iframe
              className={s.video}
              width="560"
              height="315"
              src="https://www.youtube.com/embed/MpZYDpIM2dQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Col>
          <Col xs={0} lg={1} />
        </Row>
      </Container>
    </div>
  );
}
