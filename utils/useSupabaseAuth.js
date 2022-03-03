import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'


const formatAuthUser = (user) => ({
  uid: user.id || null,
  email: user.email || null,
  providerId: user.identities[0].provider || null,
})

export default function useSupabaseAuth() {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)


  const authStateChanged = async (authState) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    let formattedUser = formatAuthUser(authState)
    setAuthUser(formattedUser)
    await getProfile()
    setLoading(false)
  }

  const clear = () => {
    localStorage.clear()
    setAuthUser(null)
    setLoading(false)
  }

  const handleLogin = async (email, password) => {
    try {
      const { error } = await supabase.auth.signIn({ email, password })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const handleSignup = async (email, password) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signIn({
        provider: 'google',
      })
      if (error) throw error
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const signOut = async () => await supabase.auth.signOut()

  const getProfile = async () => {
    try {
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select('user_name, avatar_url, location, frequency, status')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setAuthUser(state => ({
          ...state,
          displayName: data.user_name,
          photoURL: data.avatar_url,
          location: data.location,
          frequency: data.frequency,
          status: data.status,
        }
        ))
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const updateProfile = async ({ user_name, email, avatar_url, location, frequency, status }) => {
    try {
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        user_name,
        email,
        avatar_url,
        location,
        frequency,
        status,
        updated_at: new Date(),
      }

      for (const [key, value] of Object.entries(updates)) {
        if(value === undefined || value === null){
          delete updates[key]
        }
      }

      let { error, data } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }else {
        setAuthUser(state => ({
          ...state,
          displayName: data[0].user_name,
          photoURL: data[0].avatar_url,
          email: data[0].email,
          location: data[0].location,
          frequency: data[0].frequency,
          status: data[0].status,
        }))
        alert('successfully updated')
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const deleteAccount = async () => {
    try {
      const { data:list } = await supabase.storage.from('avatars').list(`${authUser.uid}`)
      const filesToRemove = list.map((x) => `${authUser.uid}/${x.name}`)
      const { error } = await supabase.storage.from('avatars').remove(filesToRemove)

      if(error) throw error

      const response = await fetch(`/api/delete/${authUser.uid}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if(data?.error) {
        alert(data?.error)
      }else {
        clear()
      }
    } catch (error) {
      alert(error)
    }

  }

  const reset = async (email) => {
    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgotpass/resetpass`
      })
      if (error){
        throw error
      } else {
        alert('reset request sent to email')
      }
    } catch (error) {
      alert(error.error_description || error.message)
    }
  }

  const updatePassword = async (password) => {
    const { error } = await supabase.auth.update({ password })
    if (error) alert(error.message)
    else alert('Your password has been updated')
  }

  async function uploadAvatar(file) {
    try {
      setLoading(true)
      const fileName = authUser.displayName
      const fileExt = file.name.split('.').pop()
      const filePath = `${authUser.uid}/${fileName}.${fileExt}`
      let { error, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        })

      if(error) throw error
      await update(data, filePath)

    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const update = async (data, filePath) => {
    if(data?.Key){
      const { publicURL, error } = supabase
        .storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (error) {
        throw error
      }else {
        await updateProfile({ avatar_url: publicURL })
      }
    }
  }


  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session()
    authStateChanged(session?.user)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        clear()
      }else if (event === 'SIGNED_IN') {
        authStateChanged(session?.user ?? null)
      }
    })
    return () => {
      authListener?.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return {
    authUser,
    loading,
    handleLogin,
    handleSignup,
    signInWithGoogle,
    signOut,
    getProfile,
    updateProfile,
    deleteAccount,
    reset,
    updatePassword,
    uploadAvatar
  }
}