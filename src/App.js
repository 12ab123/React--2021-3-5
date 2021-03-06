import React,{Component} from 'react'
import {Route,Switch} from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Admin from './pages/Admin/Admin.jsx'

export default class App extends Component{
  render(){
    return (
      <div className="app">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/admin" component={Admin}/>
        </Switch>
      </div>
    )
  }
}