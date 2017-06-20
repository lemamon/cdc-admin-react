import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthBox from './Auth';
import Home from './Home';
import BookBox from './Book'
import './index.css';
import { Route, BrowserRouter, Switch} from 'react-router-dom';

ReactDOM.render(
  (
    <BrowserRouter>
      <App>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/auth' component={AuthBox}/>
          <Route path='/book' component={BookBox}/>
        </Switch>  
      </App>
    </BrowserRouter>  
  ),
  document.getElementById('root')
);
