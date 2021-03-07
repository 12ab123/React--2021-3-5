import {createStore,applyMiddleware} from 'redux'           //从redux中引入createStore,用于创建最核心的store对象
import reducer from './reducers/index'
import thunk from 'redux-thunk'                             //使用redux异步编程
import {composeWithDevTools} from 'redux-devtools-extension'        //引入redux-devtools-extension,用于支持redux开发者调试工具的运行

//store保存所有组件的状态
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))
