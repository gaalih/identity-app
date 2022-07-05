async function send(req, res) {
  // Rest of the API logic
  if (req.method === "GET") {
    res.status(200).json("Not Available");
  } else if (req.method === "POST") {
    const form = req.body;
    let imageCode = form.image;
    // imageCode = imageCode.substring(imageCode.search(",") + 1);
    imageCode = imageCode.split(",")[1];
    // res.json({ message: "Hello Everyone!" + "-" + imageCode });

    const formData = {
      transactionId: form.sessionid + "-" + Date.now(),
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
          image: imageCode,
          template: null,
          type: "Face",
        },
      ],
    };
    // res.json(formData);

    try {
      const response = await fetch(
        // "https://sandbox.cdi-systems.com:8443/eKYC_MW/request",
        "https://949ca44c-0e92-4b8e-97f6-db4802130f03.mock.pstmn.io/verify",
        {
          method: "POST",
          body: JSON.stringify(formData),
          // headers: {
          //   "Content-Type": "application/json",
          //   "Access-Control-Allow-Origin": "*",
          // },
        }
      );
      const result = await response.json();
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ error: "failed to load data" });
    }

    // res.json({ message: "Not Error!" + "-" + res.status });

    // const data = await response.json();
    // res.json(res.status);
    // res.json(data);
  }
}

export default send;
