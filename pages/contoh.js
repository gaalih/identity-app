import { React, useState } from "react";
import Image from "next/image";
// import UserImage from "../public/user.svg";
import { useRouter } from "next/router";
import UserImage from "./img/user.svg";
import { CameraIcon } from "./elements/CameraIcon";
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

export default function App() {
  const [getImage, setImage] = useState("");
  const [getImageValid, setImageValid] = useState("");
  const { query } = useRouter();

  let getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
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

  const CardItem = () => {
    return (
      <Card>
        <Card.Body css={{ px: "$15", py: "$10" }}>
          <form action="">
            <Input
              readOnly
              fullWidth
              size="md"
              label="Phone Number"
              value={query.phone}
              initialValue="Number Not Found"
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
                    src={!getImage ? UserImage : getImage}
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
              {getImageValid == "" ? (
                ""
              ) : (
                <small className="mt-2 text-red-600">
                  <i>Image Format Not Valid</i>
                </small>
              )}
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

  return (
    <div className="-mt-8">
      <Grid.Container gap={2} justify="center">
        <Grid xs={10} md={6} lg={6}>
          <CardItem />
        </Grid>
      </Grid.Container>
    </div>
  );
}
