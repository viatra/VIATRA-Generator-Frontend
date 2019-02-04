import React, { Component } from 'react';
import AceEditor from 'react-ace';
import ace from 'brace';
import 'brace/mode/java';
import 'brace/theme/github';

import './css/App.css';

class App extends Component {

    state = {
        code: '// code'
    };

	onChange = (newValue) => {
		this.setState({
            code: newValue
        });
	};

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

				<AceEditor
                    style={{ width: '100%' }}
					mode="javascript"
                    value={this.state.code}
					theme="github"
					onChange={this.onChange}
					name="UNIQUE_ID_OF_DIV"
					editorProps={{$blockScrolling: true}}
				/>,
            </div>
        )
    }
}

export default App;
