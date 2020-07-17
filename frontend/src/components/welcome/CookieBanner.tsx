import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";

type CookieBannerProps = {};

export default function CookieBanner({}: CookieBannerProps) {
  const shown = window.localStorage.getItem(
    "has the user viewed this page before?"
  );
  const [show, setShow] = useState(shown === null);
  useEffect(() => {
    window.localStorage.setItem("has the user viewed this page before?", "yes");
  }, []);

  return (
    <>
      <Alert show={show} variant="dark">
        <Alert.Heading>This website doesn't use cookies</Alert.Heading>
        <div className="d-flex justify-content-end">
          <Button onClick={() => setShow(false)} variant="outline-light">
            Cool
          </Button>
        </div>
      </Alert>
    </>
  );
}
