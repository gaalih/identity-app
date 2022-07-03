import React from "react";
import Image from "next/image";
import UserImage from "../img/user.svg";
import {
  Grid,
  Card,
  Input,
  Spacer,
  //   Image,
  Text,
  Button,
  Row,
  Col,
} from "@nextui-org/react";

export const FormIdentity = () => {
  const CameraIcon = ({
    fill = "currentColor",
    filled,
    size,
    height,
    width,
    label,
    ...props
  }) => {
    return (
      <svg
        width={size || width || 24}
        height={size || height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.44 6.236c.04.07.11.12.2.12 2.4 0 4.36 1.958 4.36 4.355v5.934A4.368 4.368 0 0117.64 21H6.36A4.361 4.361 0 012 16.645V10.71a4.361 4.361 0 014.36-4.355c.08 0 .16-.04.19-.12l.06-.12.106-.222a97.79 97.79 0 01.714-1.486C7.89 3.51 8.67 3.01 9.64 3h4.71c.97.01 1.76.51 2.22 1.408.157.315.397.822.629 1.31l.141.299.1.22zm-.73 3.836c0 .5.4.9.9.9s.91-.4.91-.9-.41-.909-.91-.909-.9.41-.9.91zm-6.44 1.548c.47-.47 1.08-.719 1.73-.719.65 0 1.26.25 1.72.71.46.459.71 1.068.71 1.717A2.438 2.438 0 0112 15.756c-.65 0-1.26-.25-1.72-.71a2.408 2.408 0 01-.71-1.717v-.01c-.01-.63.24-1.24.7-1.699zm4.5 4.485a3.91 3.91 0 01-2.77 1.15 3.921 3.921 0 01-3.93-3.926 3.865 3.865 0 011.14-2.767A3.921 3.921 0 0112 9.402c1.05 0 2.04.41 2.78 1.15.74.749 1.15 1.738 1.15 2.777a3.958 3.958 0 01-1.16 2.776z"
          fill={fill}
        />
      </svg>
    );
  };

  const changeImage = (e) => {
    let file = e.target.files[0];
    let fileName = e.target.value;
    const fileTypeAllowed = ["jpg", "jpeg", "png"];
    let fileExtension = fileName.split(".").pop();
    console.log(fileExtension);
    if (fileTypeAllowed.indexOf(fileExtension) > -1) {
      getBase64(file)
        .then((result) => {
          console.log("Kode base64 Dari File Tersebut Adalah: ", result);
          setImageValid("");
          setImage(result);
        })
        .catch((err) => {
          console.log("Error Load ", err);
        });
    } else {
      setImageValid("Tidak valid");
      setImage(UserImage);
      console.log("File Extension tidak valid");
    }
  };
  return (
    <Card>
      <Card.Body css={{ px: "$15", py: "$10" }}>
        <form action="">
          <Input
            readOnly
            fullWidth
            size="md"
            label="Phone Number"
            placeholder="Read only"
            initialValue="readOnly"
            color="primary"
          />
          <Spacer y={0.5} />
          <Input
            bordered
            fullWidth
            size="md"
            label="ID Card Number"
            placeholder="Primary"
            color="primary"
          />
          <Spacer y={1} />
          <hr className="bg-gray-200 h-0.5 rounded-sm" />
          <Spacer y={0.5} />
          <Text color="primary">Photo Selfie</Text>
          <div className="p-5">
            <Row>
              <Col></Col>
              <Col className="mx-5 my-2">
                <Image
                  width={150}
                  height={150}
                  // maxDelay={1000}
                  src={UserImage}
                  // src="http://www.deelay.me/10000/https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true"
                  alt="Default Image"
                />
              </Col>
              <Col>
                <Button
                  icon={<CameraIcon fill="currentColor" />}
                  className="bg-blue-500 hover:bg-blue-400"
                  size="md"
                  auto
                >
                  Take A Selfie
                </Button>
                <Text className="ml-14" css={{ py: "$2" }}>
                  or
                </Text>
                <input
                  onChange={changeImage}
                  type="file"
                  name="image"
                  className="text-sm text-grey-500
                          file:mr-5 file:py-2 file:px-6
                          file:rounded-xl file:border-0
                          file:text-sm file:font-medium
                          file:bg-blue-500 file:text-white
                          hover:file:cursor-pointer hover:file:bg-blue-400
                          hover:file:text-grey-700 "
                />
              </Col>
            </Row>
          </div>
          {/* <Spacer y={1} /> */}
        </form>
      </Card.Body>
      <Spacer y={5} />
      <Card.Footer
        isBlurred
        css={{
          px: "$15",
          py: "$10",
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Col></Col>
          <Col>
            <Row justify="flex-end">
              <Button
                className="bg-blue-500 hover:bg-blue-400"
                size="lg"
                shadow
                auto
              >
                Send Data
              </Button>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};
