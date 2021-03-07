import Counter from '../components/counter'
import {connect} from 'react-redux'
import {createIncrementAction,createDecrementAction,createIncrementAsyncAction} from '../redux/action_creators'


//此函数把状态作为参数传递给UI组件(完整)
// function mapStateToProps(state){
//     return {count:state}
// }

//简写
// let mapStateToProps=state=>({count:state})


//此函数把dispatch方法传过去(完整)
// function mapDispatchToProps(dispatch){
//     return {
//         increment:(value)=>{dispatch(createIncrementAction(value))},
//         decrement:(value)=>{dispatch(createDecrementAction(value))}
//     }
// }

//简写
// let mapDispatchToProps=dispatch=>({
//         increment:(value)=>{dispatch(createIncrementAction(value))},
//         decrement:(value)=>{dispatch(createDecrementAction(value))},
//     })

//完整和简写共同使用
// export default connect(mapStateToProps,mapDispatchToProps)(Counter)


//最终简写
export default connect(
        state=>({count:state}),
        {increment:createIncrementAction,decrement:createDecrementAction,incrementAsync:createIncrementAsyncAction}
    )(Counter)


/*
    按照之前的写法:
        如果connect的第二个参数传递的是: mapDispatchToProps
        那么UI组件接收到的increment是: (value)=>{dispatch(createIncrementAction(value))},
        那么UI组件接收到的decrement是: (value)=>{dispatch(createDecrementAction(value))},

    按照最终简写:
        如果connect的第二个参数传递得是: {increment:createIncrementAction,decrement:createDecrementAction}
        那么UI组件接收到的increment是: (value)=>{dispatch(createDecrementAction(value))},
        那么UI组件接收到的decrement是: (value)=>{dispatch(createDecrementAction(value))},
        也就是说: react-redux的connect对传递的参数进行了加工

        connect函数做了如下的事
        function connect(createDecrementAction){
            return (value)=>{dispatch(createDecrementAction(value))}
        }
*/