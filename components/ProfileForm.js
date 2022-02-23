import Modal from './Modal'
import { useState } from 'react'
import { UpdateProfileschema } from '../utils/validation'
import { useAuth } from '../utils/AuthUserContext'
import InputField from './InputField'



const ProfileForm = () => {
  const { authUser: user, updateProfile, deleteAccount, updatePassword, uploadAvatar } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [deletedUser, setDeletedUser] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [file, setFile] = useState(null)


  const submit = async (event) => {
    event.preventDefault()
    const { error } = UpdateProfileschema.validate({ displayName ,email })
    if(error) {
      alert({ type: 'error', message: error.details[0].message })
      return
    }
    //
    await updateProfile({
      user_name: displayName,
      email,
    })
  }



  const deleteUser = async (setShowModal) => {
    if(deletedUser === user.displayName){
      setShowModal(false)
      await deleteAccount()
    }
  }

  const changePassword = async (setShowModal) => {
    setShowModal(false)
    await updatePassword(newPassword)
  }


  const changeProfile = async (setShowModal) => {
    if(!file) {
      alert('no file selected')
      return
    }
    const fileType = file['type']
    const validImageTypes = ['image/jpeg', 'image/png']
    if (!validImageTypes.includes(fileType)) {
      alert('invalid file type')
      return
    }
    setShowModal(false)
    await uploadAvatar(file)
  }


  return (
    <div className='sm:h-full lg:h-screen flex justify-center md:w-4/5 w-full mt-6  mb-6'>
      <div className='block rounded-lg bg-gray-100 w-5/6 text-center'>
        <label htmlFor="label" className="block mb-2 text-gray-700 font-medium text-xl mt-6"
        >Photo
        </label>
        <Modal
          type={'link'}
          title={'Change Profile Picture'}
          func={changeProfile}
        >
          <div className='justify-center border-black border-2'>
            <input type="file" onChange={({ target }) => setFile(target.files[0])} />
          </div>
        </Modal>
        <hr className="my-6 dark:border-gray-600" />
        <form onSubmit={submit}>
          <div className='mb-4'>
            <label htmlFor="exampleFormControlInput1" className="block mb-4  mt-6 text-gray-700 font-medium text-lg"
            >DisplayName</label
            >
            <input
              type="text"
              className="
            w-2/3
            md:w-1/2
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
              id="exampleFormControlInput1"
              placeholder="displayName"
              value={displayName}
              onChange={({ target }) => setDisplayName(target.value)}
            />
          </div>
          <div className='mb-6'>
            <label htmlFor="exampleFormControlInput1" className="block mb-4 mt-4 text-gray-700 font-medium text-lg"
            >Email</label
            >
            <input
              type="text"
              className="
            w-2/3
            md:w-1/2
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
            "
              id="exampleFormControlInput2"
              placeholder="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
          </div>
          {<button
            type="submit"
            className="inline-block px-6 py-2 mt-4 border-2 border-green-500 text-green-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
            Save
          </button>}
        </form>
        <hr className="my-6 dark:border-gray-600" />
        <div >
          <Modal
            type={'password'}
            title={'Change Password'}
            func={changePassword}
          >
            <InputField
              id="changepass"
              name="password"
              type="password"
              required={true}
              placeholder="new password"
              htmlFor="password"
              label="New password"
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value.trim())}
            />
          </Modal>
          <Modal
            type={'delete'}
            title={'Delete Account Confirmation'}
            func={deleteUser}
          >
            <InputField
              id="deleteUser"
              name="username"
              type="username"
              required={true}
              placeholder={user?.displayName || 'name'}
              htmlFor="deleteUser"
              label="Enter displayName"
              value={deletedUser}
              onChange={({ target }) => setDeletedUser(target.value.trim())}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}


export default ProfileForm