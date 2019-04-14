import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import fileDownload from 'js-file-download';
import { mockData } from '../api/mock.js';
import { fetchRuns, generateModel, downloadOutput } from '../api/api.js';

import Table from './Table.js';
import Loader from './Loader.js';

class Home extends Component {
    state = {
        isLoading: false,
        data: [],
        selectedValues: [],
        files: []
    }

    componentDidMount() {
        fetchRuns().then(data => {
            if(data.length === 0) {
                return;
            }

            const fullData = [...data.results, ...mockData]
            const selected = fullData.map(() => 0);

            this.setState({
                data: fullData,
                selectedValues: selected
            })
        })
    }

    selectFiles = (e) => {
        console.log(e.target.files);
        this.setState({
            files: e.target.files
        })
    }

    generateModel = () => {
        const { files } = this.state;
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('generator_inputs', file)
        });
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded' 
            }
        };

        if (files.length < 4) {
            alert('Needs to have 4 inputs to generate a model');
        } else {
            this.setState({
                isLoading: true
            }, () => {
                generateModel(formData, config).then(data => {
                    fileDownload(data, 'model_generated.xmi');
                    alert('File successfully downloaded');
                    this.setState({ isLoading: false });
                });
            }); 
        }
    }

    handleSelectChange = (index, e) => {
        const copy = this.state.selectedValues;
        copy[index] = e.target.value;

        this.setState({
            selectedValues: copy
        });
    }

    handleDownloadRunOutput = (file) => {
        downloadOutput(file).then(data => {
            fileDownload(data, file);
            alert('Download complete!');
        });
    }



    render() {
        const styles = {
            container: { 
                width: '35%',
                padding: 18,
                margin: '8px auto', 
                background: 'white',
            },
            generateModel: {
                backgroundColor: 'white',
                width: 150,
                height: 60,
                color: 'black',
                fontSize: 14,
                borderRadius: 200,
                margin: '25px auto 8px'
            },
            previousRuns: {
                margin: '55px auto 0'
            },

            circle: {
                zIndex: -1,
                width: '50vw', 
                height: '50vw', 
                position: 'fixed',
                bottom: '-15vw',
                right: '-15vw',
                backgroundColor: '#00897b',
                borderRadius: '50%'
            },
            circle2: {
                zIndex: -1,
                width: '20vw', 
                height: '20vw', 
                position: 'fixed',
                top: '15vw',
                left: '-8vw',
                backgroundColor: '#00897b',
                borderRadius: '50%'
            }
        }

        const { data, selectedValues, isLoading } = this.state;
        return (
            <div style={{ overflow: 'hidden' }}>
                <h1 style={{ textAlign: 'center', margin: '50px auto 25px' }}>
                    Graph Generator as a Service
                </h1>
                {isLoading 
                    ? <div>
                        <Loader />
                        <p style={{ fontSize: 14, textAlign: 'center', color: 'gray' }}>
                            This may take a while... (1 - 2 mins)
                        </p>
                    </div>
                    : <div style={styles.container}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <input 
                                name="generator_inputs" 
                                onChange={this.selectFiles} 
                                type="file" 
                                multiple 
                            />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button 
                                onClick={this.generateModel} 
                                variant="flat" 
                                style={styles.generateModel}
                            >
                                <Add/> &nbsp;
                                New Model
                            </Button>
                        </div>
                    </div>
                } 

                <div style={styles.previousRuns}>
                    <h2 style={{ marginLeft: '15%' }} >Previous runs</h2>
                    <div style={{ overflowY: 'hidden'}}>
                        <Table
                            history={this.props.history}
                            data={data} 
                            selectedValues={selectedValues}
                            handleSelectChange={this.handleSelectChange}
                            handleDownload={this.handleDownloadRunOutput}
                        />
                    </div>
                </div>

                <div style={styles.circle} />
                <div style={styles.circle2} />
            </div>
        )
    }
}

export default Home;
