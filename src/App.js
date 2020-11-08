import React from 'react';
import Home from './client/HomePage'
import Admin from './Admin/Admin'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'


function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
      <Route path='/' exact component={Home}/>
      <Route path="/admin" component={Admin}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
