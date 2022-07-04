import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import UserImage from "../public/user.svg";
// import Link from "next/link";
import { useRouter } from "next/router";
import { render } from "react-dom";
import Webcam from "react-webcam";

function Formidentity() {
  const [getImage, setImage] = useState("");
  const [getImageValid, setImageValid] = useState("");
  const webcamRef = useRef();
  const phoneRef = useRef();
  const idCardRef = useRef();
  const [imgSrc, setImgSrc] = useState();

  let getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        // console.log("Called", reader);
        baseURL = reader.result;
        // console.log(baseURL);
        resolve(baseURL);
      };
      // console.log(fileInfo);
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

  const confirmDialog = async (event) => {
    event.preventDefault();
    // alert('')
    alert(`So your name is ${event.target.NIK.value}?`);
    return (
      <div class="fixed z-50 card w-96 bg-neutral text-neutral-content">
        <div class="card-body items-center text-center">
          <h2 class="card-title">Cookies!</h2>
          <p>We are using cookies for no reason.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Accept</button>
            <button class="btn btn-ghost">Deny</button>
          </div>
        </div>
      </div>
    );
  };
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://949ca44c-0e92-4b8e-97f6-db4802130f03.mock.pstmn.io/verify`, {
        method: 'POST'
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
    
  } 
  const { query } = useRouter();
  return (
    <div id="form-identity">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-start-2 col-span-4">
          <div className="card rounded card-side bg-base-100 shadow-xl shadow-slate-200">
            <div className="card-body mx-auto">
              <form
                action="https://sandbox.cdi-systems.com:8443/eKYC_MW/request"
                method="post"
                enctype="multipart/form-data"
                onSubmit={confirmDialog}
                className="mx-auto w-3/5"
              >
                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <label
                      className="block text-gray-500 font-bold text-left mb-1 pr-4"
                      for="inline-full-name"
                    >
                      Phone Number
                    </label>
                  </div>
                  <div className="w-4/6">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="inline-full-name"
                      ref={phoneRef}
                      type="number"
                      value={query.phone}
                      readOnly="true"
                      disabled
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <label
                      className="block text-gray-500 font-bold text-left mb-1 mb-0 pr-4"
                      for="inline-full-name"
                    >
                      ID Card Number
                    </label>
                  </div>
                  <div className="w-4/6">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="inline-full-name"
                      ref={idCardRef}
                      type="text"
                      name="NIK"
                      required
                    />
                  </div>
                </div>
                <hr />
                <br />
                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <label
                      className="block text-gray-500 font-bold text-left mb-1 mb-0 pr-4"
                      for="inline-full-name"
                    >
                      Photo Selfie
                    </label>
                  </div>
                  <div className="w-4/6">
                    <div className="avatar">
                      <div className="w-24 mask mask-squircle">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                      />
                      <label onClick={capture}>Capture photo</label>
                      </div>
                    </div>
                    <div className="my-3">
                      <label className="block">
                        <span className="sr-only">Choose File</span>
                        <Image
                          src={!imgSrc ? UserImage : imgSrc}
                          width={100}
                          height={100}
                        />
                        <input
                          onChange={changeImage}
                          type="file"
                          name="image"
                          className="text-sm text-grey-500
                          file:mr-5 file:py-2 file:px-6
                          file:rounded-full file:border-0
                          file:text-sm file:font-medium
                          file:bg-slate-300 file:text-grey-300
                          hover:file:cursor-pointer hover:file:bg-slate-200
                          hover:file:text-grey-700 "
                        />
                      </label>

                      {getImageValid == "" ? (
                        ""
                      ) : (
                        <small className="mt-2 text-red-600">
                          <i>Image Format Not Valid</i>
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/3"></div>
                  <div className="w-4/6">
                    <button
                      className="shadow w-2/4 bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                      onClick={submit}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Formidentity;
