// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabaseAdmin } from '../../../utils/supabaseClient'

export default async function handler (req, res) {
  if(req.method === 'DELETE'){
    try {
      const { userId } = req.query
      const { error } = await supabaseAdmin.auth.api.deleteUser(userId)
      if (error) {
        res.status(500).json({ error: error.error_description || error.message })
      }else {
        res.status(200).json({ response: 'deleted' })
      }
    } catch (error) {
      res.status(500).json({ error: error.error_description || error.message })
    }
  }
}
