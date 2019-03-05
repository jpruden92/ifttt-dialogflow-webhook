const EventEmitter = require('events');
const emitter = new EventEmitter();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

const getConfig = () => {
    return new Promise((resolve, reject) => {
        initConfigInNeeded().then(() => {
            const promises = [ _getIFTTTEventsUrl(), _getIntentsConnections(), _getCredentials() ];

            Promise.all(promises).then(arrayResults => {
                const [ iftttEventsUrl, intentsConnections, credentials ] = arrayResults;
                resolve({ iftttEventsUrl, intentsConnections, credentials });
            }).catch(() => {
                setTimeout(() => {
                    getConfig().then(config => {
                        resolve(config);
                    });
                }, 2000);
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

const _getIFTTTEventsUrl = () => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT ifttteventsurl FROM config WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            if (res.rows.length === 0) {
                const DEFAULT_VAL = '';
                resolve(DEFAULT_VAL);
            } else {
                resolve(res.rows[0].ifttteventsurl);
            }
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

            emitter.emit('config-updated');
            resolve();
        });
    });
}

const _getIntentsConnections = () => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT intentsconnections FROM config WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            if (res.rows.length === 0) {
                const DEFAULT_VAL = {};
                resolve(DEFAULT_VAL);
            } else {
                resolve(JSON.parse(res.rows[0].intentsconnections));
            }
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

            emitter.emit('config-updated');
            resolve();
        });
    });
}

const _getCredentials = () => {
    return new Promise((resolve, reject) => {
        client.query(`SELECT credentials FROM config WHERE id = 'default';`, (err, res) => {
            if (err) {
                console.error(err);
                reject();
            }

            if (res.rows.length === 0) {
                const DEFAULT_VAL = {
                    user: 'test',
                    password: 'test'
                };
                resolve(DEFAULT_VAL);
            } else {
                resolve(JSON.parse(res.rows[0].credentials));
            }
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

            emitter.emit('config-updated');
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