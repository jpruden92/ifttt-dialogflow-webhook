const fs = require('fs');

const EventEmitter = require('events');
const emitter = new EventEmitter();

const CONFIG_PATH = '../config.json';
const config = require(CONFIG_PATH);

const getConfig = () => {
    return config;
}

const setCredentials = (user, password) => {
    config.user = user;
    config.password = password;

    return new Promise((resolve, reject) => {
        _saveConfig().then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const setIntentsConnections = intentsConnections => {
    config.intents = intentsConnections;

    return new Promise((resolve, reject) => {
        _saveConfig().then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const setIFTTTEventsUrl = IFTTTEventsUrl => {
    config.trigger_url = IFTTTEventsUrl;

    return new Promise((resolve, reject) => {
        _saveConfig().then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const _saveConfig = () => {
    emitter.emit('config-updated', 'hello world');

    return new Promise((resolve, reject) => {
        fs.writeFile(`${__dirname}/${CONFIG_PATH}`, JSON.stringify(config, null, 2), err => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            resolve();
        }); 
    });
}

module.exports = {
    getConfig,
    setCredentials,
    setIntentsConnections,
    setIFTTTEventsUrl,
    events: emitter
}