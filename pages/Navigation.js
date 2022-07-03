import React from "react";
import { Image, Text } from "@nextui-org/react";

function Navigation() {
  return (
    <div>
      <div className="grid justify-items-stretch w-full max-h-16">
        <div className="justify-self-end">
          {/* <Image
            src="https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true"
            objectFit="fill"
            className="max-h-16"
            width={200}
          /> */}
          <div className="bg-blue-500 w-56 h-16 max-h-16 py-3 text-center">
            <Text className="text-2xl text-white font-medium">Logo</Text>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
