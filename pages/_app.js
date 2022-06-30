import "../styles/global.css";

function App({ Component, pageProps }) {
  return (
    <div>
      <nav className="navbar mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabindex="0" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabindex="0"
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Homepage</a>
              </li>
              <li>
                <a>Portfolio</a>
              </li>
              <li>
                <a>About</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          {/* <p className="font-bold">Form Identity</p> */}
        </div>
        <div className="navbar-end">
          <a className="btn">Logo</a>
        </div>
      </nav>
      <div className="container mx-auto mt-5">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default App;
