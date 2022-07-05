import "../styles/global.css";
import { NextUIProvider } from "@nextui-org/react";
// import Navbar from "./Navbar";
import Navigation from "./Navigation";

function App({ Component, pageProps }) {
  const close = () => {
    // window.open("about:blank", "_self");
    window.close();
    // close();
  };
  return (
    <NextUIProvider>
      {/* <Navbar /> */}
      <Navigation />
      <div className="container mx-auto mt-1">
        <Component {...pageProps} />
        <button onClick={close}>keluar</button>
      </div>
    </NextUIProvider>
  );
}

export default App;
