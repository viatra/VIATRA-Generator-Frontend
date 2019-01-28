import React, { Component } from 'react';
import './css/App.css';

class App extends Component {

    render() {
        return (
            <div>
                <div className="row app-bar">
                    <p className="app-bar-title">Viatra</p>
                </div>

                <div className="title-wrapper">
                    <p className="title">Hello,</p>
                    <p className="subtitle">Welcome to the Viatra frontend project</p>
                </div>
            </div>
        )
    }
}

export default App;