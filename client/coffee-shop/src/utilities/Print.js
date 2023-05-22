export const Print = (iframeId, timeOutPrint) => {
  const ifmCommentPrint = document.getElementById(iframeId).contentWindow;
  setTimeout(() => {
    ifmCommentPrint.focus();
    // if (timeOutPrint === null || timeOutPrint === undefined)
    //   timeOutPrint = 0;
    // setTimeout(
    //   function () {
    //     ifmCommentPrint.print();
    //   },
    //   timeOutPrint);

    if (timeOutPrint && timeOutPrint > 0) {
      setTimeout(function () {
        ifmCommentPrint.print();
      }, timeOutPrint);
    } else {
      ifmCommentPrint.print();
    }

    ifmCommentPrint.close();
  }, 100);
  setTimeout(() => {
    document.activeElement.blur();
  }, 200);
};
