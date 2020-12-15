import React from 'react';
import Home from './client/HomePage'
import Admin from './Admin/Admin'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import EachDay from './Admin/EachDay'


function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
      <Route path='/' exact component={Home}/>
      <Route path="/admin" exact component={Admin}/>
      <Route path='/admin/day:id' component={EachDay}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
