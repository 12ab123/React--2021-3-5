
//创建action

//创建一个同步的action用于增加
export const createIncrementAction = value=> ({type:'increment',data:value})

//创建一个同步的action用于减
export const createDecrementAction = value=> ({type:'decrement',data:value})

//创建一个异步的action用于增加
export const createIncrementAsyncAction = (value,delay)=> {
    return (dispatch)=>{
        setTimeout(() => {
            dispatch(createIncrementAction(value))
        }, delay);
    }
}
