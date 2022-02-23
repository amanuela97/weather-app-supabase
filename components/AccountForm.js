import { useState } from 'react'
import { Switch } from '@headlessui/react'
import Autocomplete from 'react-google-autocomplete'
import { useAuth } from '../utils/AuthUserContext'
import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material'


const AccountForm = () => {
  const { updateProfile, authUser } = useAuth()
  const [enabled, setEnabled] = useState( authUser?.status || false)
  const [location, setLocation] = useState(authUser?.location || '')
  const [frequency, setFrequency] = useState(authUser?.frequency || 'Monthly')


  const submit = async (event) => {
    event.preventDefault()
    if(!location || !frequency) {
      alert('Can not save with empty fields')
      return
    }
    const valid = await isLocationValid()
    if(valid){
      await updateProfile({
        frequency, location, status: enabled,
      })
    }else {
      alert('weather data for this location is not available, pick another location')
    }

  }


  const isLocationValid =  async () => {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/tomorrow?unitGroup=metric&key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&contentType=json`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if(data?.address){
        return true
      }
      return false
    } catch (error) {
      console.clear()
      return false
    }
  }


  return (
    <div className='sm:h-full lg:h-screen flex justify-center md:w-4/5 w-full mt-6 mb-6'>
      <div className='block rounded-lg bg-gray-100 w-5/6 text-center'>
        <label htmlFor="label" className="block mb-2 text-gray-700 font-medium text-xl mt-6"
        >Account Setting
        </label>
        <p className="w-full m-auto md:w-1/2">
            Your account settings will be used to tailor the app according to your configurations.
            Pick your city, and frequency to receive regular weather updates, and make sure to save your changes.
        </p>
        <hr className="my-6 dark:border-gray-600" />
        <div>
          <div>
            <label htmlFor="frequency">frequency:</label>
            <div className="flex justify-center">
              <div className="mb-3 w-96 md:w-96">
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={frequency}
                      label="Frequency"
                      onChange={({ target }) =>  setFrequency(target.value)}
                      defaultValue={frequency}
                    >
                      <MenuItem value={'Daily'}>Daily</MenuItem>
                      <MenuItem value={'Monthly'}>Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="city">City:</label>
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                setLocation(place?.formatted_address)
              }}
              onChange={({ target } ) => setLocation(target.value)}
              defaultValue={location}
              language='en'
              className='block border-2 border-gray-200 mb-5 w-full md:w-96 m-auto p-2'
            />
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <div className="py-4">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-gray-800' : 'bg-gray-200'}
          relative inline-flex flex-shrink-0 h-[38px] w-[74px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          </div>
          <button
            onClick={submit}
            className="inline-block px-6 py-2 mt-4 border-2 border-green-500 text-green-500 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
            save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountForm