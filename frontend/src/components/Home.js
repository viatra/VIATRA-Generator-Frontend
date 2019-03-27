import React, { Component } from 'react';

import Table from './Table.js';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

class Home extends Component {

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

        return (
            <div style={{ overflow: 'hidden' }}>
                <h1 style={{ textAlign: 'center', margin: '50px auto 25px' }}>
                    Graph Generator as a Service
                </h1>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" style={styles.generateModel}>
                        <Add/> &nbsp;
                        New Model
                    </Button>
                </div>

                <div style={styles.previousRuns}>
                    <h2 style={{ marginLeft: '15%' }} >Previous runs</h2>
                    <div style={{ overflowY: 'hidden'}}>
                        <Table />
                    </div>
                </div>

                <div style={styles.circle} />
                <div style={styles.circle2} />
            </div>
        )
    }
}

export default Home;
