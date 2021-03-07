import counterReducer from './counter_reducer'
import personReducer from './person_reducer'
import {combineReducers} from 'redux'           //引入汇总方法


/*
    combineReducers接收一个对象作为参数
    store保存了所有组件的状态,是一个对象,格式为:
        {
            key1:xxxx,
            key2:xxxxx,
            key3:xxxxx
        }
    对象中的key就是store中保存该状态的key
    对象中的value就是store保存该状态的value
*/
export default combineReducers({
    count:counterReducer,
    person:personReducer
})