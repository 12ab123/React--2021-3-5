
let initState=0         //设置初始化状态

export default function operaCount(preState=initState,action){
    //根据action的type和date决定如何操作状态
    const {type,data}=action
    let newState
    switch (type){
        case 'increment':
            newState=preState+data
            return newState
        case 'decrement':
            newState=preState-data
            return newState
        default:
            return preState
    }
}

/*
    规则:
        1. 在reducer中不能修改传递过来的参数
*/