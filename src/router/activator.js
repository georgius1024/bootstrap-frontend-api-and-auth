import config from '@/config'
import Api from '@/api'
import store from '@/store'

async function activator (code) {
  Api.setBaseUrl(config.API_URL)
  try {
    const response = await Api.get('auth/once/' + code)
    const user = response.data
    const auth = response.auth
    store.commit('account/login', { user, auth })
    return true
  } catch (error) {
    return false
  }
}
export default activator
