import React from "react";

function Formidentity() {
  return (
    <div id="form-identity">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-start-2 col-span-4">
          <div className="card rounded card-side bg-base-100 shadow-xl shadow-slate-200">
            <div className="card-body mx-auto">
              <form action="" className="mx-auto w-3/5">
                <div className="flex items-center mb-6">
                  <div className="w-1/3">
                    <label
                      className="block text-gray-500 font-bold text-left mb-1 mb-0 pr-4"
                      for="inline-full-name"
                    >
                      Phone Number
                    </label>
                  </div>
                  <div className="w-4/6">
                    <input
                      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                      id="inline-full-name"
                      type="number"
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
                      type="text"
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
                    <div className="flex items-center">
                      <div className="avatar">
                        <div className="w-24 mask mask-squircle">
                          <img src="https://placeimg.com/192/192/people" />
                        </div>
                      </div>
                      <div className="mx-6">
                        <button className="btn btn-circle btn-outline">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/3"></div>
                  <div className="w-4/6">
                    <button
                      className="shadow w-2/4 bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                      type="button"
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
