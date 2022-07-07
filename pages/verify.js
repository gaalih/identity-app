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
  const [getID, setID] = useState("");
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
    // console.log("param : " + result);
    // console.log("error kode : " + result.errorCode);
    // console.log("ver result : " + result.verificationResult);
    // const url =
    //   ;
    const response = await fetch(
      "https://api.infobip.com/bots/webhook/" +
        sessionid +
        "?resultparam=" +
        resultParam +
        ""
    );
    // const jsonData = await response.json();
    // console.log(jsonData.serviceException);
    // setR
    // return jsonData;
  };

  const checkInput = () => {
    if (getID != "" && getImage != "") {
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
    let responsePostData = "";
    let countdown = 4000; //delay
    try {
      result = await response.json();
      result.result.sessionid = sessionid;
      switch (result.result.verificationResult) {
        case true:
          responsePostData = "success";
          // setResponseServer("success");
          // botDataSend = sendToBot(result.result);
          countdown = 2000;
          break;
        case false:
          responsePostData = "success";
          // sukses, tapi verificationResult nya false
          // setResponseServer("Failed.");
          // setResponseServer("success");
          // botDataSend = sendToBot(result.result);
          countdown = 2000;
          break;
        default:
          const errMsg = result.result.errorMessage.split(":")[0];
          responsePostData = "Failed: " + errMsg.toLowerCase();
          // setResponseServer("Failed: " + errMsg.toLowerCase());
          break;
      }
    } catch (err) {
      const errorMsg =
        "Error! " + response.status + " | " + response.statusText;
      result = errorMsg;
      // setResponseServer(errorMsg);
      responsePostData = errorMsg;
    }

    // console.log(responsePostData);
    // if (responsePostData == "success") {
    //   sendToBot(result.result);
    // } else {
    //   console.log("Error.");
    // }
    setResponseServer(responsePostData);

    console.log(responsePostData);
    console.log(getResponseServer);


    setTimeout(async () => {
      // if (isMobile) {
      //   window.location.href = "https://wa.me/447860099299?text&app";
      // } else {
      //   window.open("location", "_self", "");
      //   window.top.close();
      //   // window.close();
      // }
      // if (getResponseServer == "success") {
      //   window.location.href = "https://wa.me/447860099299?text&app";
      // }
      // console.log(getResponseServer);
      await sendToBot(result.result);

      // if (responsePostData == "success") {
        window.location.href = "https://wa.me/447860099299?text&app";
      // }
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
          <Webcam ref={webcamRef}/>
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
    if (getInputStatus === true) {
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
        <Modal.Body className="pt-5">
          {error == true ? (
            <Text className="flex justify-center items-center text-orange-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1 sm:h-4 sm:w-4 sm:mr-1 md:h-6 md:w-6 md:mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
              </svg>
              {getInputStatus}
            </Text>
          ) : (
            <Text className="text-blue-500">
              Are you sure to process the data?
            </Text>
          )}
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
            <Button
              auto
              onClick={closeHandler}
              className="bg-orange-400 hover:bg-orange-300"
            >
              OK
            </Button>
          ) : (
            <Button
              auto
              onClick={submitForm}
              className="bg-blue-400 hover:bg-blue-300"
            >
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
        <Modal.Body className="pt-5">
          <Text className="text-center">{msg}</Text>
          <Spacer y={0.1} />
          <div className="flex items-center justify-center">
            {getResponseServer == "" ? (
              <div className="p-3">
                <span className="flex h-10 w-10">
                  <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-10 w-10 bg-sky-500"></span>
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
      <Container xs={10} md={6} lg={6}>
        <Card>
          <Card.Body className="overflow-hidden px-5 md:px-10">
            <Grid.Container gap={1.3} justify="center">
              <Grid xs={12} md={12} lg={12}>
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
              </Grid>
              <Grid xs={12} md={12} lg={12}>
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
              </Grid>
            </Grid.Container>
            {/* <Spacer y={1.2} /> */}
            {/* <hr className="bg-gray-200 h-0.5 rounded-sm" /> */}
            {/* <Spacer y={0.5} /> */}

            <Grid.Container gap={1.3} justify="center">
              <Grid xs={12} md={12} lg={12}>
                <Text color="primary" className="pl-2">
                  Photo Selfie
                </Text>
              </Grid>
              <Grid xs={5} sm={6} lg={6} className="md:px-5">
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
              <Grid xs={7} sm={6} lg={6} className="md:px-4">
                <div className="w-full">
                  <button
                    className="bg-blue-500 text-xs sm:text-xs md:text-sm hover:bg-blue-400 flex justify-center items-center px-6 py-2 rounded-sm border-0 font-medium text-white w-full text-center"
                    onClick={handlerPhoto}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 sm:h-4 sm:w-4 sm:mr-1 md:h-6 md:w-6 md:mr-2"
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

                  <label
                    htmlFor="file"
                    // for="file"
                    className="bg-blue-500 text-xs sm:text-xs md:text-sm hover:bg-blue-400 flex justify-center items-center px-6 py-2 rounded-sm border-0 font-medium text-white w-full text-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 sm:h-4 sm:w-4 sm:mr-0.5 md:h-6 md:w-6 md:mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                    </svg>
                    Choose a file
                  </label>
                  {getImageValid == "" ? (
                    ""
                  ) : (
                    <p className="text-center text-xs mt-3 bg-red-500 py-2 text-white">
                      Invalid image. Please try again
                    </p>
                  )}
                </div>
              </Grid>
            </Grid.Container>
            <Spacer y={1} />
            <Grid.Container gap={0} justify="right" className="px-2">
              <Grid xs={12} sm={5} lg={5}>
                <Button
                  className="bg-blue-500 hover:bg-blue-400 rounded-sm h-14 w-full text-xs md:text-sm "
                  size="lg"
                  shadow
                  auto
                  onPress={checkInput}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 sm:h-4 sm:w-4 sm:mr-0.5 md:h-6 md:w-6 md:mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Send Data
                </Button>
              </Grid>
            </Grid.Container>
          </Card.Body>
        </Card>
        <ModalSelfie />
        <ModalConfirm />
        <ModalLoading />
      </Container>
    </div>
  );
}
