const EventEmitter = require('events');
const emitter = new EventEmitter();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

let config = null;

const _updateConfig = () => {
    return new Promise((resolve, reject) => {
        initConfigInNeeded().then(() => {
            _getConfig().then(_config => {
                config = _config;
                resolve();
            });
        });
    });
}

const checkIfConfigExist = tableName => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${tableName}'`, (err, res) => {
            if (err) return resolve(false);
            resolve(res.rows.length > 0);
        });
    });
}

const initConfigInNeeded = () => {
    return new Promise((resolve, reject) => {
        checkIfConfigExist('config').then(configExist => {
            if (!configExist) {
                client.query(`CREATE TABLE config ( id varchar(255), credentials text, iftttEventsUrl varchar(255), intentsConnections text )`, (err, res) => {
                    if (err) {
                        console.error(err);
                        resolve();
                        return;
                    }

                    client.query(`INSERT INTO config (id, credentials, iftttEventsUrl, intentsConnections) VALUES ('default', '{ "user": "test", "password": "test" }', '', '{}')`, (err, res) => {
                        if (err) {
                            console.error(err);
                            resolve();
                            return;
                        }

                        resolve();
                    });
                });
            } else {
                resolve();
            }
        });
    });
}

const setCredentials = (user, password) => {
    return new Promise((resolve, reject) => {
        _setCredentials({
            user, password
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const setIntentsConnections = intentsConnections => {
    return new Promise((resolve, reject) => {
        _setIntentsConnections(intentsConnections).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const setIFTTTEventsUrl = IFTTTEventsUrl => {
    return new Promise((resolve, reject) => {
        _setIFTTTEventsUrl(IFTTTEventsUrl).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

const _getConfig = () => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM config WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            const _config = res.rows[0];

            resolve({
                iftttEventsUrl: _config.ifttteventsurl,
                intentsConnections: JSON.parse(_config.intentsconnections),
                credentials: JSON.parse(_config.credentials)
            });
        });
    });
}

const _setIFTTTEventsUrl = value => {
    return new Promise((resolve, reject) => {
        client.query(`UPDATE config SET ifttteventsurl = '${value}' WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            _updateConfig().then(() => {
                emitter.emit('config-updated');
                resolve();
            });
        });
    });
}

const _setIntentsConnections = value => {
    return new Promise((resolve, reject) => {
        client.query(`UPDATE config SET intentsconnections = '${JSON.stringify(value)}' WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            _updateConfig().then(() => {
                emitter.emit('config-updated');
                resolve();
            });
        });
    });
}

const _setCredentials = value => {
    return new Promise((resolve, reject) => {
        client.query(`UPDATE config SET credentials = '${JSON.stringify(value)}' WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            _updateConfig().then(() => {
                emitter.emit('config-updated');
                resolve();
            });
        });
    });
}

const getConfig = () => {
    return new Promise((resolve, reject) => {
        if (!config) {
            _updateConfig().then(() => {
                resolve(config);
            });
        } else {
            resolve(config);
        }
    });
}

getConfig().then(currentConfig => {
    emitter.emit('initiated', currentConfig);
});

module.exports = {
    getConfig,
    setCredentials,
    setIntentsConnections,
    setIFTTTEventsUrl,
    events: emitter
}