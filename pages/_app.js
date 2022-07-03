import "../styles/global.css";
import { NextUIProvider } from "@nextui-org/react";
// import Navbar from "./Navbar";
import Navigation from "./Navigation";

function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      {/* <Navbar /> */}
      <Navigation />
      <div className="container mx-auto mt-5">
        <Component {...pageProps} />
      </div>
    </NextUIProvider>
  );
}

export default App;
