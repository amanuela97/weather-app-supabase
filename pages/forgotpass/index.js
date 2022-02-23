import Head from 'next/head'
import { useState } from 'react'
import { useAuth } from '../../utils/AuthUserContext'
import { email } from '../../utils/validation'
import { withPublic } from '../../utils/withAuth'
import Form from '../../components/Form'
import InputField from '../../components/InputField'




const Forgotpass = () => {
  const { reset } = useAuth()
  const [resetEmail, setResetEmail] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    // validate input
    const { error } =  email.validate(resetEmail)

    //set validation error and return
    if(error) {
      alert( error.details[0].message)
      return
    }
    await reset(resetEmail)
  }

  return (
    <div>
      <Head>
        <title>forgot password</title>
        <meta name="description" content="forgotpassword page" />
      </Head>
      <div className='h-screen'>
        <Form
          title={'Forgot your password?'}
          logo={'/appLogo.png'}
          submitTitle={'Send Password To Email'}
          onSubmit={onSubmit}
          forgotPass={false}
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
            value={resetEmail}
            onChange={({ target }) => setResetEmail(target.value.trim())}
          />
        </Form>
      </div>
    </div>
  )
}

export default withPublic(Forgotpass)