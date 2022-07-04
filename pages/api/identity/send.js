async function send(req, res) {
  // Rest of the API logic
  // res.json({ message: "Hello Everyone!" + "-" + form.id });
  if (req.method === "GET") {
    res.status(200).json("Not Available");
  } else if (req.method === "POST") {
    const form = req.body;
    const formData = {
      transactionId: form.sessionid + Date.now(),
      component: "WEB",
      customer_Id: "ekyc_customer_1",
      digital_Id: form.id,
      requestType: "verify",
      NIK: form.id,
      device_Id: "9885037442",
      app_Version: "1.0",
      sdk_Version: "1.0",
      faceThreshold: "6",
      passiveLiveness: "false",
      liveness: false,
      localVerification: true,
      isVerifyWithImage: false,
      verifyIdCardFaceImage: false,
      biometrics: [
        {
          position: "F",
          image: form.image,
          template: null,
          type: "Face",
        },
      ],
    };

    const response = await fetch(
      "https://sandbox.cdi-systems.com:8443/eKYC_MW/request",
      {
        method: "POST",
        body: JSON.stringify(formData),
        // headers: {
        //   "Content-Type": "application/json",
        //   "Access-Control-Allow-Origin": "*",
        // },
      }
    );
    const data = await response.json();
    res.json(data);
  }
}

export default send;
