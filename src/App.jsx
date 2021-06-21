import React from 'react'
import './App.css'
import {BrowserRouter as Router,
Switch,
Route} from 'react-router-dom'
import routes from '../src/router'
function App() {
  return (
    <div className="App">
        <Router>
          <Switch>
            {
                routes.map(route => <Route exact key={route.path} path={route.path}>
                  <route.component />
                </Route>)
            }
          </Switch>
        </Router>
    </div>
  )
}

export default App
