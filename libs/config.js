const memjs = require('memjs');

const EventEmitter = require('events');
const emitter = new EventEmitter();

const mc = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
  failover: true,
  timeout: 1,
  keepAlive: true
})

const getConfig = () => {
    const promises = [ _getIFTTTEventsUrl(), _getIntentsConnections(), _getCredentials() ];

    return new Promise((resolve, reject) => {
        Promise.all(promises).then(arrayResults => {
            const [ iftttEventsUrl, intentsConnections, credentials ] = arrayResults;
            resolve({ iftttEventsUrl, intentsConnections, credentials });
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
        mc.get('iftttEventsUrl', (err, val) => {
            if (err) {
                console.error(err);
                reject();
            }

            if (!val) {
                const DEFAULT_VAL = '';
                resolve(DEFAULT_VAL);
            } else {
                resolve(val.toString());
            }
        })
    });
}

const _setIFTTTEventsUrl = value => {
    return new Promise((resolve, reject) => {
        mc.set('iftttEventsUrl', value, {expires:0}, (err, val) => {
            if (err) {
                console.error(err);
                reject();
            }

            emitter.emit('config-updated');
            resolve();
        })
    });
}

const _getIntentsConnections = () => {
    return new Promise((resolve, reject) => {
        mc.get('intentsConnections', (err, val) => {
            if (err) {
                console.error(err);
                reject();
            }

            if (!val) {
                const DEFAULT_VAL = {};
                resolve(DEFAULT_VAL);
            } else {
                resolve(JSON.parse(val));
            }
        })
    });
}

const _setIntentsConnections = value => {
    return new Promise((resolve, reject) => {
        mc.set('intentsConnections', JSON.stringify(value), {expires:0}, (err, val) => {
            if (err) {
                console.error(err);
                reject();
            }

            emitter.emit('config-updated');
            resolve();
        })
    });
}

const _getCredentials = () => {
    return new Promise((resolve, reject) => {
        mc.get('credentials', (err, val) => {
            if (err) {
                console.error(err);
                reject();
            }

            if (!val || !JSON.parse(val).user || !JSON.parse(val).password) {
                const DEFAULT_VAL = {
                    user: 'test',
                    password: 'test'
                };
                resolve(DEFAULT_VAL);
            } else {
                resolve(JSON.parse(val));
            }
        })
    });
}

const _setCredentials = value => {
    return new Promise((resolve, reject) => {
        console.info(value);
        mc.set('credentials', JSON.stringify(value), {expires:0}, (err, val) => {
            if (err) {
                console.error(err);
                reject();
            }

            emitter.emit('config-updated');
            resolve();
        })
    });
}

module.exports = {
    getConfig,
    setCredentials,
    setIntentsConnections,
    setIFTTTEventsUrl,
    events: emitter
}