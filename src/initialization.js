/*
*
* Модуль начальной инициализации перед рендерингом приложения
 */
import config from '@/config'
import Api from '@/api'
import account from '@/store/modules/account'

Api.setBaseUrl(config.API_URL)
Api.setAccessToken(account.state.accessToken)
Api.setRefreshToken(account.state.refreshToken)
