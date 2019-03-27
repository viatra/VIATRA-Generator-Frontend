import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/Home.js';

import './css/App.css';

class App extends Component {

    render() {

        return (
            <div style={{ overflow: 'hidden' }}>
                <Route exact path="/" component={Home} />
				<Route path="/edit" component={null} />
            </div>
        )
    }
}

export default App;
