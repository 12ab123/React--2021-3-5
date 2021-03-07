import React,{Component} from 'react'


export default class Counter extends Component{


    //加法
    increment=()=>{
        let {value}=this.refs.selectNumber
        this.props.increment(value*1)
    }

    //减法
    decrement=()=>{
        let {value}=this.refs.selectNumber
        this.props.decrement(value*1)
    }

    incrementOdd=()=>{
        let {value}=this.refs.selectNumber
        if(this.props.count%2===1){
        this.props.increment(value*1)
        } 
    }

    incrementAsync=()=>{
        let {value}=this.refs.selectNumber
        this.props.incrementAsync(value*1,1000)
    }

    render(){
        return (
            <div>
                <h3>当前计数为{this.props.count}</h3>
                <select ref="selectNumber">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>&nbsp;
                <button onClick={this.increment}>+</button>&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;
                <button onClick={this.incrementOdd}>increment if add</button>&nbsp;
                <button onClick={this.incrementAsync}>increment async</button>&nbsp;

            </div>
        )
    }
}