import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
// import UserImage from "../public/user.svg";
// import Axios from "axios";
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
  Text,
  Button,
  Row,
  Col,
  Modal,
  Loading,
} from "@nextui-org/react";

export default function App() {
  const { query } = useRouter();
  const sessionid = !query.sessionid ? "" : query.sessionid;
  const phone = !query.phone ? "" : query.phone;

  const [getImage, setImage] = useState("");
  const [getID, setID] = useState();
  const [getImageValid, setImageValid] = useState("");

  const phoneRef = useRef();
  const idCardRef = useRef();
  const uploadRef = useRef();

  const webcamRef = useRef();
  const capture = useCallback(() => {
    closeHandler();
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    uploadRef.current.value = "";
  }, [webcamRef, setImage]);

  // modal variable
  const [photoVisible, setPhotoVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [getResponseServer, setResponseServer] = useState("");
  const handlerPhoto = () => setPhotoVisible(true);
  const handlerConfirm = () => setConfirmVisible(true);

  const closeHandler = () => {
    setPhotoVisible(false);
    setConfirmVisible(false);
    setLoadingVisible(false);
  };
  // end modal variable

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
      if (fileName != "") {
        setImageValid("Not valid");
        setImage("");
        console.log("File Extension Not Valid");
      }
    }
  };

  const sendToBot = async (result) => {
    const verificationResult =
      result.verificationResult == true ? "OK" : "FAIL";
    const url =
      "https://api.infobip.com/bots/webhook/" +
      result.sessionid +
      "?resultparam=" +
      verificationResult +
      "";
    const response = await fetch(url);
    const responseData = await response.json();
    console.log(responseData);
    // try {
    //   switch (responseData.serviceException.errorCode) {
    //     case 40401:
    //       setResponseServer(
    //         "Error! " +
    //           responseData.serviceException.errorCode +
    //           " | " +
    //           responseData.serviceException.message
    //       );

    //       break;
    //     default:
    //       setResponseServer("success");
    //       break;
    //   }
    // } catch (err) {
    //   const errorMsg =
    //     "Error! " + response.status + " | " + response.statusText;
    //   setResponseServer(errorMsg);
    // }
  };

  const submitForm = async () => {
    closeHandler();
    setLoadingVisible(true);
    setResponseServer("");
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

    let result = "";
    let countdown = 5000;
    try {
      result = await response.json();
      result.result.sessionid = sessionid;
      switch (result.result.verificationResult) {
        case true:
          setResponseServer("success");
          sendToBot(result.result);
          countdown = 2000;
          break;
        case false:
          setResponseServer("Failed.");
          sendToBot(result.result);
          break;
        default:
          setResponseServer("Something Wrong");
          break;
      }
    } catch (err) {
      const errorMsg =
        "Error! " + response.status + " | " + response.statusText;
      setResponseServer(errorMsg);
    }

    setTimeout(() => {
      closeHandler();
    }, countdown);

    // setTimeout(() => closeHandler(), 3000);

    // const data = await response.json();
  };

  const ModalSelfie = () => {
    return (
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={photoVisible}
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

  const ModalConfirm = () => {
    return (
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={confirmVisible}
        onClose={closeHandler}
      >
        <Modal.Body>
          <Text>Are You Sure to Process Data?</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button auto onClick={submitForm} className="bg-blue-400">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const ModalLoading = () => {
    let msg = "";
    if (getResponseServer == "") {
      msg = "Processing Data";
    } else if (getResponseServer == "success") {
      msg = "Successfull";
    } else {
      msg = getResponseServer;
    }
    return (
      <Modal
        blur
        aria-labelledby="modal-title"
        open={loadingVisible}
        onClose={closeHandler}
        preventClose
      >
        <Modal.Body>
          <Text className="text-center">{msg}</Text>
          <Spacer y={0.2} />
          <div class="flex items-center justify-center">
            {getResponseServer == "" ? (
              <Loading size="lg" />
            ) : getResponseServer == "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-green-500 text-center stroke-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-20 w-20 text-red-500 text-center stroke-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <Spacer y={0.2} />
        </Modal.Body>
      </Modal>
    );
  };

  return (
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
                          onClick={handlerPhoto}
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
                      onPress={handlerConfirm}
                    >
                      Send Data
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
          <ModalSelfie />
          <ModalConfirm />
          <ModalLoading />
        </Grid>
      </Grid.Container>
    </div>
  );
}
