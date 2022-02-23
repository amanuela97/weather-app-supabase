import Head from 'next/head'
import { useState } from 'react'
import { useAuth } from '../utils/AuthUserContext'
import { Loginschema } from '../utils/validation'
import { withPublic } from '../utils/withAuth'
import Form from '../components/Form'
import InputField from '../components/InputField'



function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { handleLogin, signInWithGoogle } = useAuth()

  const onSubmit = async event => {
    event.preventDefault()

    // validate input
    const { error } = Loginschema.validate({
      email,
      password,
    })

    //set validation error and return
    if(error) {
      alert(error.details[0].message)
      return
    }
    await handleLogin(email, password)
  }


  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login page" />
      </Head>
      <div className='h-screen sm:h-full'>
        <Form
          title={'Sign in to your account'}
          subtitle={'Dont have an account?'}
          href={'/register'}
          hrefName={'Sign Up'}
          logo={'/appLogo.png'}
          submitTitle={'Sign In'}
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
        </Form>
      </div>
    </div>
  )
}

export default withPublic(Login)