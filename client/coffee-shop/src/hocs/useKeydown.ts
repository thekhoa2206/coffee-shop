import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useKeydown = () => {
  const [stateKeydown, setStateKeydown] = useState<{
    key: string;
    id: string | null;
  }>({
    key: "",
    id: null,
  });

  useEffect(() => {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      let uuid = uuidv4();
      let tempKey = "";
      if (event.key === "F1") {
        event.preventDefault();
        tempKey = "F1";
      }
      if (event.key === "F2") {
        event.preventDefault();
        tempKey = "F2";
      }
      if (event.key === "F3") {
        event.preventDefault();
        tempKey = "F3";
      }
      if (event.key === "F4") {
        event.preventDefault();
        tempKey = "F4";
      }
      if (event.key === "F6") {
        event.preventDefault();
        tempKey = "F6";
      }
      if (event.key === "F7") {
        event.preventDefault();
        tempKey = "F7";
      }
      if (event.key === "F8") {
        event.preventDefault();
        tempKey = "F8";
      }
      if (event.key === "F9") {
        event.preventDefault();
        tempKey = "F9";
      }
      if (event.key === "F10") {
        event.preventDefault();
        tempKey = "F10";
      }
      if (event.altKey && event.key === "1") {
        event.preventDefault();
        tempKey = "Alt1";
      }
      if (event.altKey && event.key === "2") {
        event.preventDefault();
        tempKey = "Alt2";
      }
      if (event.altKey && event.key === "3") {
        event.preventDefault();
        tempKey = "Alt3";
      }
      if (event.altKey && event.key === "4") {
        event.preventDefault();
        tempKey = "Alt4";
      }
      if (event.altKey && event.key === "5") {
        event.preventDefault();
        tempKey = "Alt5";
      }
      // if (event.key === "Delete") {
      //   event.preventDefault();
      //   tempKey = "Delete";
      // }
      if (event.key === "Home") {
        event.preventDefault();
        tempKey = "Home";
      }
      if (event.key === "Escape") {
        event.preventDefault();
        tempKey = "Escape";
      }

      // các phím tắt chỉ dùng khi mở popup thanh toán(F7)
      let checkOpenPopupOrderPayment = document.getElementById("popup-payment-order");
      if (checkOpenPopupOrderPayment !== null) {
        if (event.code === "Space") {
          event.preventDefault();
          tempKey = "Space";
        }
        if (event.shiftKey && event.key === "X") {
          event.preventDefault();
          tempKey = "ShiftX";
        }
        if (event.shiftKey && event.key === "x") {
          event.preventDefault();
          tempKey = "Shiftx";
        }
      }
      if (tempKey) {
        setStateKeydown({ key: tempKey, id: uuid });
      }
    });
  }, []);

  return { stateKeydown };
};

export default useKeydown;
