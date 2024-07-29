import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import QrScanner from "qr-scanner";

const QrReader = ({onError, onScan}) => {
  // QR States
  const scanner = useRef(null);
  const videoEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);


  // Success
  const onScanSuccess = (result) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    onScan(result?.data);
  };

  // Fail
  const onScanFail = (err) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);

   // onError(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });

      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
        scanner?.current?.stop();
        scanner?.current?.destroy();
        scanner.current = null;      
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className={styles.qrReader}>
      {/* QR */}
      <video ref={videoEl}></video>
    </div>
  );
};

export default QrReader;
