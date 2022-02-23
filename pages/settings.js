import { useEffect, useState } from 'react'
import SideNav from '../components/SideNav'
import ProfileForm from '../components/ProfileForm'
import AccountForm from '../components/AccountForm'
import { withProtected } from '../utils/withAuth'
import Spinner from '../components/Spinner'
import { useAuth } from '../utils/AuthUserContext'


const Settings = () => {
  const { loading } = useAuth()
  const [selected, setSelected] = useState('profile')

  useEffect(() => {
    async function changeTab(){
      setSelected(localStorage.getItem('selectedSideNav') ? localStorage.getItem('selectedSideNav') : 'profile')
    }
    return changeTab()
  }, [])

  if(loading) return <Spinner/>

  return (
    <div className='flex flex-col md:flex-row'>
      <SideNav
        selected={selected}
        setSelected={setSelected}
      />
      {(selected === 'profile') && <ProfileForm />}
      {(selected === 'account') && <AccountForm />}
    </div>
  )
}

export default withProtected(Settings)