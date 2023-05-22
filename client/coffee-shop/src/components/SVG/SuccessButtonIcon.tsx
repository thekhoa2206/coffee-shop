import { SvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

function SuccessButton(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M12 0C5.38406 0 0 5.38406 0 12C0 18.6159 5.38406 24 12 24C18.6159 24 24 18.6159 24 12C24 5.38406 18.6159 0 12 0ZM18.0825 9.4575L11.5828 15.9572C11.3878 16.1522 11.1309 16.2497 10.8759 16.2497C10.62 16.2497 10.3641 16.1522 10.1691 15.9572L6.91875 12.7069C6.52875 12.3169 6.52875 11.6841 6.91875 11.2922C7.30875 10.9003 7.94156 10.9022 8.33344 11.2922L10.8759 13.8347L16.6688 8.04187C17.0588 7.65188 17.6916 7.65188 18.0834 8.04187C18.4753 8.43188 18.4725 9.06563 18.0825 9.4575Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default SuccessButton;
