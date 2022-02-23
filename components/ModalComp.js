

import React from 'react'
import propTypes from 'prop-types'


const ModalComp = ({ type , children, title, setShowModal, func }) => {


  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
      >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                {title}
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="my-4 text-blueGray-500 text-lg leading-relaxed">
                {children}
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                    Close
              </button>
              <button
                className={`text-white  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 
                    ${type === 'password' ? 'bg-blue-500 active:bg-blue-500' : type === 'delete' ? 'bg-red-500 active:bg-red-500' : 'bg-green-500 active:bg-green-500'}`}
                type="button"
                onClick={() => func(setShowModal)}
              >
                {type === 'delete' ? 'Delete Account' : (type === 'password' ? 'Change Password' : ( type === 're-auth' ? 'Authenticate' :'Save'))}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

ModalComp.propTypes = {
  title: propTypes.string.isRequired,
  type: propTypes.string.isRequired,
  children: propTypes.any.isRequired,
  func: propTypes.func.isRequired,
  setShowModal: propTypes.func.isRequired
}

export default ModalComp