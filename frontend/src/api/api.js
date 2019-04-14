import { get, post, put } from 'axios';

const config = {
    _protocol: 'http://',
    _dns: 'ec2-3-16-24-192.us-east-2.compute.amazonaws.com',
    _port: ':8000'
};
const url = `${config._protocol}${config._dns}${config._port}`;

export const fetchRuns = () => {
    return new Promise((resolve, reject) => {
        get(url + '/fetch-runs').then(res => {
            resolve(res.data);
        }).catch(reject);
    });
};

export const generateModel = (data, config) => {
    return new Promise((resolve, reject) => {
        post(url + '/generate-model', data, config).then(res => {
            resolve(res.data);
        }).catch(reject);
    });
};

export const fetchConfig = (config) => {
    return new Promise((resolve, reject) => {
        get(url + `/fetch-config?fileName=${config}`).then(res => {
            resolve(res.data);
        }).catch(reject);
    });
};

export const updateConfig = (config, logicalName, data) => {

    return new Promise((resolve, reject) => {
        put(url + `/update-config?config=${config}&logicalName=${logicalName}`, data).then(res => {
            resolve(res.data);
        }).catch(reject);
    });
}

export const downloadOutput = (file) => {
    return new Promise((resolve, reject) => {
        get(url + `/download-output?output=${file}`).then(res => {
            resolve(res.data);
        }).catch(reject);
    });
};