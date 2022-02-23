import Head from 'next/head'
import { useState } from 'react'
import { useAuth } from '../utils/AuthUserContext'
import { Registerschema } from '../utils/validation'
import { withPublic } from '../utils/withAuth'
import Form from '../components/Form'
import InputField from '../components/InputField'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setconfirmPassword] = useState('')
  const { handleSignup, signInWithGoogle } = useAuth()

  const onSubmit = async event => {
    event.preventDefault()
    // validate input
    const { error } = Registerschema.validate({
      email,
      password,
      confirmPassword
    })
    //set validation error and return
    if(error) {
      alert(error.details[0].message.toString())
      return
    }
    await handleSignup(email, password)
  }

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register" />
      </Head>
      <div className='h-screen sm:h-full'>
        <Form
          title={'Create your account'}
          subtitle={'Already have an account?'}
          href={'/login'}
          hrefName={'Sign In'}
          logo={'/appLogo.png'}
          submitTitle={'Sign Up'}
          onSubmit={onSubmit}
          googleSignIn={signInWithGoogle}
          forgotPass={true}
        >
          <InputField
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required={true}
            placeholder="Email address"
            htmlFor="email-address"
            label='Email address'
            value={email}
            onChange={({ target }) => setEmail(target.value.trim())}
          />
          <InputField
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required={true}
            placeholder="Password"
            htmlFor="password"
            label='Password'
            value={password}
            onChange={({ target }) => setPassword(target.value.trim())}
          />
          <InputField
            id="confirm-Password"
            name="confirmPassword"
            type="password"
            autoComplete="current-password"
            required={true}
            placeholder="confirmPassword"
            htmlFor="confirm-Password"
            label='confirm-Password'
            value={confirmPassword}
            onChange={({ target }) => setconfirmPassword(target.value.trim())}
          />
        </Form>
      </div>
    </div>
  )
}

export default withPublic(Register)