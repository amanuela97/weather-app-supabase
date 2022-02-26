const admin =  require('firebase-admin')
const functions = require('firebase-functions')
const nodemailer  = require('nodemailer')
const fetch = require('node-fetch')
const { createClient } = require('@supabase/supabase-js')


admin.initializeApp()
const url = functions.config().supabase.name
const key = functions.config().supabase.key
const supabase = createClient(url, key)
const APP_NAME = 'Weather-App'
const mailTransport  = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().mail.username,
    pass: functions.config().mail.password,
  }
})

// runs daily At 12:00 AM
exports.dailyEmailSupa = functions.pubsub.schedule('0 0 * * *').onRun(handleDailyTask)
// runs At 12:00 AM, on day 1 of the month
exports.monthlyEmailSupa = functions.pubsub.schedule('0 0 1 * *').onRun(handleMonthlyTask)

async function handleDailyTask(context) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('status, frequency, email, user_name, location')
      .match({ status: true, frequency: 'Daily' })
    if (error) throw error
    if (data.length === 0) return
    return await handleTask(data)
  } catch (error) {
    console.log(error)
  }
}

async function handleMonthlyTask(context) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('status, frequency, email, user_name, location')
      .match({ status: true, frequency: 'Monthly' })
    if (error) throw error
    if (data.length === 0) return
    return await handleTask(data)
  } catch (error) {
    console.log(error)
  }
}

async function handleTask(profiles) {
  const jobs = []

  profiles.forEach( async (profile) => {
    const { email , user_name: displayName , location } = profile
    // get_weather function defined in supabase dashboard
    const { data: weather, error } = await supabase.rpc('get_weather', { location })
    if(error || !weather){
      console.log(error?.message)
      return
    }
    const job = await sendEmail(email, displayName, weather)
    jobs.push(job)
  })

  return await Promise.all(jobs)
}

async function sendEmail(email, displayName, weather) {
  const mailOptions = {
    from: `👻 ${APP_NAME} ${functions.config().mail.username}`,
    to: email,
  }

  // The user subscribed to the weather updates.
  mailOptions.subject = 'Weather updates'
  mailOptions.text = `
    Hey ${displayName || ''}! Your weather update for tomorrow.\n
    address: ${weather?.address ? weather?.address : '-'} \n
    timezone: ${weather?.timezone ? weather?.timezone : '-' } \n
    datetime: ${weather?.days[0]?.datetime ? weather?.days[0]?.datetime  : '-'} \n
    temperature: ${weather?.days[0]?.temp ? weather?.days[0]?.temp : '-'}°C \n
    humidity:  ${weather?.days[0]?.humidity ? weather?.days[0]?.humidity : '-'}% \n
    precipitation:  ${weather?.days[0]?.precipprob ? weather?.days[0]?.precipprob : '-' }% \n
    wind: ${weather?.days[0]?.windspeed ? weather?.days[0]?.windspeed : '-'}m/s \n
    conditions: ${weather?.days[0]?.conditions ? weather?.days[0]?.conditions : '-'} \n
    `
  return await mailTransport.sendMail(mailOptions , (error, info) => {
    if (error) {
      return console.log(error.message)
    }
    console.log('Message sent: %s', info.messageId)
    functions.logger.log('New weather update sent to:', email)
  })
}


