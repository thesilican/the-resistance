import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Util from "../../util";

export default function SafariBanner() {
  const [show, setShow] = useState(() => Util.getUserAgent() === "safari");
  const handleButtonClick = () => {
    setShow(false);
  };

  return (
    <Alert show={show} variant="danger">
      <Alert.Heading>Safari is not supported</Alert.Heading>
      <div className="d-flex flex-column align-items-end">
        <span className="mb-3">
          This website is known to have issues while using Safari.
          <br />
          Please try another web browser, like Google Chrome
        </span>
        <Button onClick={handleButtonClick} variant="outline-light">
          Aww ok
        </Button>
      </div>
    </Alert>
  );
}
