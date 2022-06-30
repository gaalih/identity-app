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
                      type="text"
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
                        <img src="https://placeimg.com/192/192/people" />
                      </div>
                    </div>
                    <div className="my-3">
                      <label className="block">
                        <span className="sr-only">Choose File</span>
                        <input
                          type="file"
                          className="text-sm text-grey-500
                          file:mr-5 file:py-2 file:px-6
                          file:rounded-full file:border-0
                          file:text-sm file:font-medium
                          file:bg-slate-300 file:text-grey-300
                          hover:file:cursor-pointer hover:file:bg-slate-200
                          hover:file:text-grey-700 "
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-1/3"></div>
                  <div className="w-4/6">
                    <button
                      className="shadow w-2/4 bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                      type="submit"
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
