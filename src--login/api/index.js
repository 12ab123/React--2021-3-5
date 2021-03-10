//配置项目中所有的请求
//项目中所有的请求从这里发出
import {BASE_URL} from '../config/index'

import myAxios from './myAxios'


//发起登录请求

export const reqLogin=(values)=> myAxios.post(`${BASE_URL}/login`,values)
