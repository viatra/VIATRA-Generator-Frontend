import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import fileDownload from 'js-file-download';
import { mockData } from '../api/mock.js';

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
        axios.get('http://localhost:8000/fetch-runs').then(res => {
            if(res.data.length === 0) {
                return;
            }

            const fullData = [...res.data.results, ...mockData]
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
        formData.append('generator_inputs', [...files]);
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
                axios.post('http://localhost:8000/generate-model', formData, config).then(res => {
                    fileDownload(res.data, 'model_generated.xmi');
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
        axios.get(`http://localhost:8000/download-output?output=${file}`).then(res => {
            fileDownload(res.data, file);
            alert('Download complete!');
        });
    }



    render() {
        const styles = {
            generateModel: {
                backgroundColor: '#9c27b0',
                width: 150,
                height: 60,
                color: 'white',
                fontSize: 14,
                borderRadius: 200,
                margin: '15px auto'
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
                backgroundColor: '#9c27b0',
                borderRadius: '50%'
            },
            circle2: {
                zIndex: -1,
                width: '20vw', 
                height: '20vw', 
                position: 'fixed',
                top: '15vw',
                left: '-8vw',
                backgroundColor: '#9c27b0',
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
                    ? <Loader /> 
                    : <div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <input name="generator_inputs" onChange={this.selectFiles} type="file" multiple />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button 
                                onClick={this.generateModel} 
                                variant="contained" 
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
