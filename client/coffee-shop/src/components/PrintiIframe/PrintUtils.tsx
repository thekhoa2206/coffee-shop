import DOMPurify from "dompurify";
import React from "react";

export const PrintUtilsConfigurator = () => {
  return <iframe title="printIframe" id="printIframe" style={{ position: "absolute", width: 0, height: 0 }} />;
};

const PrintUtils = {
  print(htmlContent: string) {
    const contentWindow = (document.getElementById("printIframe") as HTMLIFrameElement).contentWindow;
    let resolve: any;
    const resultPromise = new Promise((resolutionFunc) => {
      resolve = resolutionFunc;
    });
    if (contentWindow) {
      contentWindow.document.body.innerHTML = DOMPurify.sanitize(htmlContent);
      contentWindow.addEventListener("afterprint", (e) => resolve(e), {
        once: true,
      });
      contentWindow.focus();
      setTimeout(() => {
        contentWindow.print();
        (document?.activeElement as any)?.blur?.();
      }, 50);
    }
    return resultPromise;
  },
};

export default PrintUtils;
