import React from 'react';
import Home from './client/HomePage'
import Admin from './Admin/Admin'
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import EachDay from './Admin/EachDay'
import Languages from './Admin/Languages'


function App() {
  return (
    <Router>
    <div className="App">
      <Switch>
      <Route path='/' exact component={Home}/>
      <Route path="/admin/:lang" exact component={Admin}/>
      <Route path="/admin" exact component={Languages} />
      <Route path='/admin/:lang/day:id' exact component={EachDay}/>
      </Switch>
    </div>
    </Router>
  );
}

export default App;
