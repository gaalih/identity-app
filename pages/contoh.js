import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
// import UserImage from "../public/user.svg";
import Axios from "axios";
import { useRouter } from "next/router";
import UserImage from "./img/user.svg";
import { CameraIcon } from "../elements/CameraIcon";
import Webcam from "react-webcam";
import {
  Container,
  Grid,
  Card,
  Input,
  Spacer,
  //   Image,
  Text,
  Button,
  Row,
  Col,
  Modal,
} from "@nextui-org/react";

export default function App() {
  const { query } = useRouter();
  const sessionid = !query.sessionid ? "" : query.sessionid;
  const phone = !query.phone ? "" : query.phone;
  //   const [getSessionID, setSessionID] = useState(sessionid);
  //   const [getPhoneNumber, setPhoneNumber] = useState(phone);

  const [getImage, setImage] = useState("");
  const [getID, setID] = useState();
  const [getImageValid, setImageValid] = useState("");

  const phoneRef = useRef();
  const idCardRef = useRef();
  const uploadRef = useRef();

  //   alert("session ID : ", query);

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
    if (fileTypeAllowed.indexOf(fileExtension) > -1) {
      getBase64(file)
        .then((result) => {
          setImageValid("");
          setImage(result);
        })
        .catch((err) => {
          console.log("Error Load ", err);
        });
    } else {
      setImageValid("Tidak valid");
      setImage("");
      console.log("File Extension tidak valid");
    }
  };

  //   const submitForm = () => {
  //     Axios({
  //       method: "POST",
  //       url: "https://sandbox.cdi-systems.com:8443/eKYC_MW/request",
  //       data: {
  //         firstName: "Fred",
  //         lastName: "Flintstone",
  //       },
  //     });
  //   };
  //   const submitForm = () => {
  //     const url = " https://sandbox.cdi-systems.com:8443/eKYC_MW/request";
  //     Axios.post(url, {
  //       transactionId: "sadadasdadad-" + Date.now(),
  //       component: "WEB",
  //       customer_Id: "ekyc_customer_1",
  //       digital_Id: getID,
  //       requestType: "verify",
  //       NIK: getID,
  //       device_Id: "9885037442",
  //       app_Version: "1.0",
  //       sdk_Version: "1.0",
  //       faceThreshold: "6",
  //       passiveLiveness: "false",
  //       liveness: false,
  //       localVerification: true,
  //       isVerifyWithImage: false,
  //       verifyIdCardFaceImage: false,
  //       biometrics: [
  //         {
  //           position: "F",
  //           image: getImage,
  //           template: null,
  //           type: "Face",
  //         },
  //       ],
  //     })
  //       .then(function (response) {
  //         console.log(response);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   };

  const submitForm = async () => {
    // const url = "https://sandbox.cdi-systems.com:8443/eKYC_MW/request";
    // const response = await fetch(url, {
    const response = await fetch("/api/identity/send", {
      method: "POST",
      body: JSON.stringify({
        sessionid: sessionid,
        phone: phone,
        id: getID,
        image: getImage,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const webcamRef = useRef();
  //   const [imgSrc, setImgSrc] = useState();
  const capture = useCallback(() => {
    closeHandler();
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    uploadRef.current.value = "";
  }, [webcamRef, setImage]);
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  const ModalSelfie = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Take Your
            <Text b size={18}>
              Photo
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button auto onClick={capture} className="bg-blue-400">
            Take Your Photo
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    // <div className="-mt-8">
    // <div className="-mt-5">
    <div>
      <Grid.Container gap={0} justify="center">
        <Grid xs={10} md={6} lg={6}>
          <Card>
            <Card.Body css={{ px: "$15", py: "$10" }}>
              <form action="">
                <Input
                  readOnly
                  fullWidth
                  type="number"
                  size="md"
                  label="Phone Number"
                  value={!query.phone ? "Number Not Found" : query.phone}
                  color="primary"
                  ref={phoneRef}
                />
                <Spacer y={0.5} />
                <Input
                  bordered
                  fullWidth
                  size="md"
                  type="number"
                  label="ID Card Number"
                  placeholder="Your ID Card Number"
                  color="primary"
                  onKeyUp={(e) => setID(e.target.value)}
                />
                <Spacer y={1} />
                <hr className="bg-gray-200 h-0.5 rounded-sm" />
                <Spacer y={0.5} />
                <Text color="primary" className="pl-2">
                  Photo Selfie
                </Text>

                <div className="p-5">
                  <Container>
                    <Row gap={0}>
                      <Col span={1}></Col>
                      <Col span={4} className="shadow-lg shadow-slate-100">
                        <Image
                          width={150}
                          height={150}
                          src={!getImage ? UserImage : getImage}
                          alt="Default Image"
                          layout="responsive"
                          className="transition ease-in-out delay-200"
                        />
                      </Col>
                      <Col span={1}></Col>
                      <Col span={5}>
                        <Button
                          auto
                          icon={<CameraIcon fill="currentColor" />}
                          className="bg-blue-500 hover:bg-blue-400 w-full rounded-sm"
                          size="md"
                          // color="gradient"
                          onClick={handler}
                        >
                          Take A Selfie
                        </Button>
                        <Text
                          color="primary"
                          className="text-center"
                          css={{ py: "$1" }}
                        >
                          or
                        </Text>
                        <input
                          onChange={changeImage}
                          type="file"
                          name="image"
                          id="file"
                          class="inputfile"
                          ref={uploadRef}
                        />
                        <label for="file">Choose a file</label>
                        {getImageValid == "" ? (
                          ""
                        ) : (
                          <Text className="text-center text-xs mt-2 bg-red-500 py-1 text-white">
                            Image Not Valid. Please Try Again
                          </Text>
                        )}
                      </Col>
                      <Col span={1}></Col>
                    </Row>
                  </Container>
                </div>
              </form>
            </Card.Body>
            <Spacer y={2.8} />
            <Card.Footer
              isBlurred
              css={{
                px: "$15",
                pb: "$10",
                // py: "$10",
                position: "absolute",
                bgBlur: "#ffffff66",
                borderTop:
                  "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                bottom: 0,
                zIndex: 1,
              }}
            >
              <Row>
                <Col></Col>
                <Col>
                  <Row justify="flex-end">
                    <Button
                      className="bg-blue-500 hover:bg-blue-400 rounded-sm"
                      size="lg"
                      shadow
                      auto
                      onPress={submitForm}
                    >
                      Send Data
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
          <ModalSelfie />
        </Grid>
      </Grid.Container>
    </div>
  );
}
