import React, { Component } from 'react';
import fileDownload from 'js-file-download';
import { TextField, Button } from '@material-ui/core';
import { fetchConfig, updateConfig } from '../api/api.js';

import Loader from './Loader.js';

class Edit extends Component {

    state = {
        isLoading: false,
        configData: {
            epackage: '',
            number: '',
            runs: '',
            scope: {
                node: ''
            },
            vql: ''
        }
    }

    componentDidMount() {
        const { match } = this.props;

        fetchConfig(match.params.config).then(data => {
            console.log(data);
            this.setState({
                configData: data
            });
        });
    }

    handleInputChange = (input, value) => {
        const copy = this.state.configData;

        switch(input) {
            case 'number':
                copy.number = value;
                break;
            case 'runs':
                copy.runs = value;
                break;
            case 'node':
                copy.scope.node = value;
                break;
        }

        this.setState({
            configData: copy
        });
    }

    handleNewRun = () => {
        const { match, location } = this.props;
        const config = match.params.config;
        const logicalName = location.state.logicalName;

        this.setState({
            isLoading: true
        }, () => {
            updateConfig(config, logicalName, this.state.configData).then(data => {
                fileDownload(data, 'new_output.xmi');
                alert('Output successfully generated with new config! Download complete');

                this.setState({
                    isLoading: false
                });
            });
        })
        
    }

    render() {
        const styles = {
            input: {
                display: 'inline-block',
                margin: '12px auto',
                fontSize: 18
            },
            button: {
                width: 260,
                height: 75,
                margin: '12px auto',
                fontSize: 16,
                backgroundColor: '#9c27b0',
                color: 'white',
                borderRadius: 200
            },
            circle: {
                zIndex: -1,
                width: '45vw', 
                height: '45vw', 
                position: 'fixed',
                left: '-20vw',
                bottom: '-20vw',
                backgroundColor: '#9c27b0',
                borderRadius: '50%'
            },
            circle2: {
                zIndex: -1,
                width: '35vw', 
                height: '35vw', 
                position: 'fixed',
                top: '-16vw',
                right: '-16vw',
                backgroundColor: '#9c27b0',
                borderRadius: '50%'
            }
        }

        const { configData, isLoading } = this.state;

        console.log(this.props);
        return (
            <div>
                <h1 style={{ textAlign: 'center', margin: '25px auto' }}>Edit Config File</h1>
    
                {isLoading 
                    ? <div>
                        <Loader />
                        <p style={{ fontSize: 14, textAlign: 'center', color: 'gray' }}>
                            This may take a while... (1 - 2 mins)
                        </p>
                    </div>
                    : <div style={{ width: '45%', margin: '18px auto' }}>
                    <TextField 
                        fullWidth 
                        style={styles.input} 
                        label="Epackage" 
                        variant="outlined" 
                        value={configData.epackage} 
                        disabled 
                        />
                    <TextField 
                        fullWidth 
                        style={styles.input} 
                        label="VQL" 
                        variant="outlined"
                        value={configData.vql} 
                        disabled
                    />
                    <TextField 
                        fullWidth 
                        style={styles.input} 
                        label="Scope --> Node" 
                        variant="outlined" 
                        value={configData.scope.node}
                        onChange={(e) => this.handleInputChange('node', e.target.value)}
                    />
                    <TextField 
                        fullWidth 
                        style={styles.input} 
                        label="Ref Number" 
                        variant="outlined" 
                        value={configData.number}
                        onChange={(e) => this.handleInputChange('number', e.target.value)}
                    />
                    <TextField 
                        fullWidth 
                        style={styles.input} 
                        label="Number of runs" 
                        variant="outlined" 
                        value={configData.runs} 
                        onChange={(e) => this.handleInputChange('runs', e.target.value)}
                    />
    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={this.handleNewRun} style={styles.button} variant="contained">
                            Generate New Run
                        </Button>
                    </div>
                </div>
                }
                <div style={styles.circle} />
                <div style={styles.circle2} />
            </div>
        )
    }
}

export default Edit;
