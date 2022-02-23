import { withProtected } from '../utils/withAuth'
import ProfileCards from '../components/ProfileCards'
import Spinner from '../components/Spinner'
import { useAuth } from '../utils/AuthUserContext'


function Profile() {
  const { authUser, loading } = useAuth()


  if(loading) return <Spinner/>

  return (
    <div className='flex justify-center items-center'>
      <ProfileCards
        displayName={authUser?.displayName}
        email={authUser?.email}
        photoURL={authUser?.photoURL}

      />
    </div>
  )
}

export default withProtected(Profile)