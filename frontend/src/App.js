import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home.js';
import Edit from './components/Edit.js'

import './css/App.css';

class App extends Component {

    render() {

        return (
            <div>
                <Route exact path="/" component={Home} />
				<Route path="/edit/:config" component={Edit} />
            </div>
        )
    }
}

export default App;
