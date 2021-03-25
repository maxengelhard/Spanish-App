import React from 'react';
import Home from './client/HomePage'
import Admin from './Admin/Admin'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import EachDay from './Admin/EachDay'
import Languages from './Admin/Languages'
import Login from './client/Login'
import Signup from './client/SignUp'
import Dashboard from './client/Dashboard/Dashboard';
import Profile from './client/Profile'
import PageNotFound from './client/PageNotFound'
import EachLesson from './client/Dashboard/EachLesson';


function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
      <Route path='/' exact component={Home}/>
      <Route path="/admin/:lang" exact component={Admin}/>
      <Route path="/admin" exact component={Languages} />
      <Route path='/admin/:lang/day:id' exact component={EachDay}/>
      <Route path='/login' exact component={Login}/>
      <Route path='/signup' exact component={Signup}/>
      <Route path='/dashboard' exact component={Dashboard}/>
      <Route path='/profile/:id' exact component={Profile} />
      <Route path='/dashboard/es/:day' exact component={EachLesson} />
      <Route component={PageNotFound} />
      </Switch>
    </div>
    </Router>
  );
}

export default App;
