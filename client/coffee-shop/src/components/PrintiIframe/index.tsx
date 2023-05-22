import React, { useState } from "react";
import { createPortal } from "react-dom";


function PrintIframe(props: any) {
  const [contentRef, setContentRef] = useState<any>(null);
  const mountNode = contentRef && contentRef.contentWindow.document.body;
  return (
    <iframe
      id={props.iframeId}
      title="print-iframe"
      style={{ position: "absolute", top: "-9999px" }}
      ref={setContentRef}
    >
      {mountNode && createPortal(React.Children.only(props.children), mountNode)}
    </iframe>
  );
}

export default PrintIframe;
