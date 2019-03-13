import React, { Component } from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
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
    
    getLines = code => {
        return code.split('\n');
    };

    render() {
        const { code } = this.state;

        console.log(this.getLines(code));
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
                    value={code}
					theme="github"
					onChange={this.onChange}
					name="UNIQUE_ID_OF_DIV"
					// annotations={[{ row: 1, type: 'error', text: 'Some error.' }]}
					editorProps={{ $blockScrolling: true }}
				/>,
            </div>
        )
    }
}

export default App;
