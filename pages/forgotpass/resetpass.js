import Head from 'next/head'
import { useState } from 'react'
import { useAuth } from '../../utils/AuthUserContext'
import { password } from '../../utils/validation'
import Form from '../../components/Form'
import InputField from '../../components/InputField'
import { useRouter } from 'next/router'





const Resetpass = () => {
  const { updatePassword } = useAuth()
  const router = useRouter()
  const [resetPassword, setResetPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    // validate input
    const { error } =  password.validate(resetPassword)

    //set validation error and return
    if(error) {
      alert( error.details[0].message)
      return
    }
    await updatePassword(resetPassword)
    router.push('/login')
  }

  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="reset password page" />
      </Head>
      <div className='h-screen'>
        <Form
          title={'Change your password?'}
          logo={'/appLogo.png'}
          submitTitle={'Change Password'}
          onSubmit={onSubmit}
          forgotPass={false}
        >
          <InputField
            id="reset-password"
            name="password"
            type="password"
            autoComplete="password"
            required={true}
            placeholder="new password"
            htmlFor="email-address"
            label='Password'
            value={resetPassword}
            onChange={({ target }) => setResetPassword(target.value.trim())}
          />
        </Form>
      </div>
    </div>
  )
}

export default Resetpass