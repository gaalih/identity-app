import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
// import UserImage from "../public/user.svg";
// import Axios from "axios";
import { useRouter } from "next/router";
import UserImage from "./img/user.svg";
import Webcam from "react-webcam";
import { isMobile } from "react-device-detect";
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
  const sessionid = !query.session_id ? "" : query.session_id;
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
  const [getInputStatus, setInputStatus] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [getResponseServer, setResponseServer] = useState("");
  const handlerPhoto = () => setPhotoVisible(true);

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
        console.log("Invalid file extension");
      }
    }
  };

  const sendToBot = async (result) => {
    let resultParam =
      result.errorCode != 1000 ? "other" : result.verificationResult;
    const url =
      "https://api.infobip.com/bots/webhook/" +
      sessionid +
      "?resultparam=" +
      resultParam +
      "";
    const response = await fetch(url);
  };

  const checkInput = () => {
    if (getID != null && getImage != null) {
      setInputStatus(true);
    } else {
      if (sessionid != "" && phone != "") {
        setInputStatus("Input must be filled. Check your data again");
      } else {
        setInputStatus("Invalid session or phone number.");
      }
    }
    setConfirmVisible(true);
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
    let countdown = 4000;
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
          // sukses, tapi verificationResult nya false
          // setResponseServer("Failed.");
          setResponseServer("success");
          sendToBot(result.result);
          break;
        default:
          const errMsg = result.result.errorMessage.split(":")[0];
          setResponseServer("Failed: " + errMsg.toLowerCase());
          break;
      }
    } catch (err) {
      const errorMsg =
        "Error! " + response.status + " | " + response.statusText;
      result = errorMsg;
      setResponseServer(errorMsg);
    }

    setTimeout(() => {
      if (isMobile) {
        window.location.href = "https://wa.me/447860099299?text&app";
      } else {
        window.open("location", "_self", "");
        window.top.close();
        // window.close();
      }

      closeHandler();
    }, countdown);
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
    let error = false;
    if (getInputStatus == true) {
      error = false;
    } else {
      error = true;
    }
    return (
      <Modal
        blur
        preventClose
        aria-labelledby="modal-title"
        open={confirmVisible}
        onClose={closeHandler}
        className="mx-5"
      >
        <Modal.Body>
          <Text>
            {error == true ? (
              <Text>{getInputStatus}</Text>
            ) : (
              <Text>Are you sure to process the data?</Text>
            )}
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onClick={closeHandler}
            className={error == true ? "hidden" : "block"}
          >
            Cancel
          </Button>
          {error == true ? (
            <Button auto onClick={closeHandler} className="bg-blue-400">
              OK
            </Button>
          ) : (
            <Button auto onClick={submitForm} className="bg-blue-400">
              Yes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  const ModalLoading = () => {
    let msg = "";
    if (getResponseServer == "") {
      msg = "Processing data";
    } else if (getResponseServer == "success") {
      msg = "Successful";
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
        className="mx-5"
      >
        <Modal.Body>
          <Text className="text-center">{msg}</Text>
          <Spacer y={0.1} />
          <div className="flex items-center justify-center">
            {getResponseServer == "" ? (
              // <Loading size="xl" />
              // <svg
              //   className="animate-spin h-20 w-20 text-blue-500 text-center stroke-2"
              //   xmlns="http://www.w3.org/2000/svg"
              //   fill="none"
              //   viewBox="0 0 24 24"
              // >
              //   <circle
              //     className="opacity-25"
              //     cx="12"
              //     cy="12"
              //     r="10"
              //     stroke="currentColor"
              //   ></circle>
              //   <path
              //     className="opacity-75"
              //     fill="currentColor"
              //     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              //   ></path>
              // </svg>
              <div className="p-3">
                <span class="flex h-10 w-10">
                  <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-sky-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
                </span>
              </div>
            ) : getResponseServer == "success" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 m-0 text-green-500 text-center stroke-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-red-500 text-center stroke-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            {/* css={{ px: "$15", py: "$10" }} */}
            <Card.Body className="px-7 py-7 sm:px-5 sm:py-7 md:px-11">
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
              <Grid.Container
                gap={1}
                justify="center"
                // css={{ px: "$10", py: "$10" }}
              >
                <Grid
                  xs={5}
                  sm={6}
                  lg={6}
                  // css={{ py: "$1" }}
                >
                  {/* <div className="w-full md:w-full h-full m-3 mx-20 md:mx-3 sm:ml-2 sm:mt-2 md:ml-20 md:mt-3"> */}
                  <div className="w-full">
                    <Image
                      width={150}
                      height={150}
                      src={!getImage ? UserImage : getImage}
                      alt="Default Image"
                      layout="responsive"
                      className="transition ease-in-out delay-200"
                    />
                  </div>
                </Grid>
                <Grid xs={7} sm={6} lg={6}>
                  {/* <div className="w-full h-full m-3 mx-10 md:mx-3 sm:mr-2 sm:mt-2 md:mr-20 md:mt-3"> */}
                  <div className="w-full">
                    <button
                      class="bg-blue-500 text-xs sm:text-xs md:text-sm hover:bg-blue-400 flex justify-center items-center px-6 py-2 rounded-sm border-0 font-medium text-white w-full text-center"
                      onClick={handlerPhoto}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1 sm:h-4 sm:w-4 sm:mr-1 md:h-6 md:w-6 md:mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Take A Selfie
                    </button>
                    <p className="text-center text-blue-500 py-[0.2em] md:py-2">
                      or
                    </p>
                    <input
                      onChange={changeImage}
                      type="file"
                      name="image"
                      id="file"
                      className="inputfile"
                      ref={uploadRef}
                    />
                    <label for="file">Choose a file</label>
                    {getImageValid == "" ? (
                      ""
                    ) : (
                      <p className="text-center text-xs mt-3 bg-red-500 py-2 text-white">
                        Invalid image. Please try again
                      </p>
                      // <Text>
                      // </Text>
                    )}
                  </div>
                </Grid>
              </Grid.Container>
            </Card.Body>
            <span className="h-[4.5rem] md:h-16"></span>
            {/* <Spacer y={4} /> */}
            <Card.Footer
              // isBlurred
              css={{
                px: "$15",
                pb: "$10",
                // py: "$10",
                position: "absolute",
                // bgBlur: "#ffffff66",
                // borderTop:
                //   "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
                bottom: 0,
                zIndex: 1,
              }}
            >
              <div className="flex w-full justify-end">
                <Button
                  className="bg-blue-500 hover:bg-blue-400 rounded-sm h-14 w-full md:w-2/5"
                  size="lg"
                  shadow
                  auto
                  onPress={checkInput}
                >
                  Send Data
                </Button>
              </div>
              {/* <Row>
                <Col></Col>
                <Col>
                  <Row justify="flex-end">
                    <Button
                      className="bg-blue-500 hover:bg-blue-400 rounded-sm"
                      size="lg"
                      shadow
                      auto
                      onPress={checkInput}
                    >
                      Send Data
                    </Button>
                  </Row>
                </Col>
              </Row> */}
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
