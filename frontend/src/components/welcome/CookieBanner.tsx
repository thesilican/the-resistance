import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import Util from "../../util";

export default function CookieBanner() {
  const shown = window.localStorage.getItem(
    "has the user viewed this page before?"
  );
  const [show, setShow] = useState(
    () => shown === null && Util.getUserAgent() !== "safari"
  );
  const handleButtonClick = () => {
    window.localStorage.setItem("has the user viewed this page before?", "yes");
    setShow(false);
  };

  return (
    <Alert show={show} variant="dark">
      <Alert.Heading>This website doesn't use cookies</Alert.Heading>
      <div className="d-flex justify-content-end">
        <Button onClick={handleButtonClick} variant="outline-light">
          Cool
        </Button>
      </div>
    </Alert>
  );
}
