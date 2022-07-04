import { React, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
// import UserImage from "../public/user.svg";
import { useRouter } from "next/router";
import UserImage from "./img/user.svg";
import { CameraIcon } from "../elements/CameraIcon";
import Webcam from "react-webcam";
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
  Modal,
} from "@nextui-org/react";

export default function App() {
  const [getImage, setImage] = useState("");
  const [getImageValid, setImageValid] = useState("");
  const { query } = useRouter();
  const phoneRef = useRef();
  const idCardRef = useRef();

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
      setImage(UserImage);
      console.log("File Extension tidak valid");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const d = new Date();
    let time = d.getTime();
    let transaction_id = query.session_id + '-' + time
    let selfie_image = getImage.substring(getImage.search(',') + 1);
    try {
      const res = await fetch(`https://sandbox.cdi-systems.com:8443/eKYC_MW/request`, {
        method: 'POST',
        headers : {
          'Content-Type' : 'multipart/form-data'
        },
        body : `{
          "transactionId": "`+transaction_id+`",
          "component": "MOBILE",
          "customer_Id":"ekyc_customer_1",
          "digital_Id":"`+phoneRef.current.value+`",
          "requestType": "verify",
          "NIK": "`+idCardRef.current.value+`",
          "device_Id": "9885037442",
          "app_Version": "1.0",
          "sdk_Version": "1.0",
          "faceThreshold": "6",
          "passiveLiveness":"false",
          "liveness": false,
          "localVerification": true,
          "isVerifyWithImage":false,
          "verifyIdCardFaceImage":false,
          "biometrics": [
          {
          "position": "F",
          "image": "`+selfie_image+`",
          "template": null,
          "type": "Face"
          }
          ]
         }` 
      });
      const data = await res.json();
      if (data.errorCode == 1000) {
        try {
          const res = await fetch(`https://api.infobip.com/bots/webhook/`+query.session_id + `?resultparam=OK`, {
            headers : {
              'Content-Type' : 'multipart/form-data'
            } 
          });

          window.open("about:blank", "_self");
          window.close();
        } catch (err) {
          console.log(err);
        }
      } else {
        alert('Failed to enroll. Please retry')
      }
    } catch (err) {
      console.log(err);
      alert('Failed to enroll. Please retry')
    } 
  } 

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
              ref={phoneRef}
            />
            <Spacer y={0.5} />
            <Input
              bordered
              fullWidth
              size="md"
              label="ID Card Number"
              placeholder="Your ID Card Number"
              color="primary"
              ref={idCardRef}
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
                    onClick={handler}
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
                    id="file"
                    class="inputfile"
                  />
                  <label for="file">Choose a file</label>
                </Col>
                <Col></Col>
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
                  onClick={submit}
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

  const webcamRef = useRef();
  //   const [imgSrc, setImgSrc] = useState();
  const capture = useCallback(() => {
    closeHandler();
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
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
    <div className="-mt-8">
      <Grid.Container gap={2} justify="center">
        <Grid xs={10} md={6} lg={6}>
          <CardItem />
          <ModalSelfie />
        </Grid>
      </Grid.Container>
    </div>
  );
}
