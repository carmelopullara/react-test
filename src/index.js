import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Search from './components/Search';
import Results from './components/Results';
import './index.css';

const NotFound = () => (
  <p>Not found</p>
);

const Root = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Search} />
        <Route exact path="/repo/:owner/:name" component={Results} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
