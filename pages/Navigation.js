import Image from "next/image";
import React from "react";
import ImgLogo from "../public/XL-Axiata-Logo.svg";

function Navigation() {
  return (
    <di>
      <div className="grid justify-items-stretch w-full max-h-16">
        <div className="justify-self-end max-h-16 pr-5">
          <Image src={ImgLogo} className="max-h-16" width={200} height={70} />
        </div>
      </div>
    </di>
  );
}

export default Navigation;
