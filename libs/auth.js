const auth = require('basic-auth');
const configController = require('./config.js');

let credentials = {
    user: '',
    password: ''
};

configController.getConfig().then(config => {
    console.info(config);
    credentials = config.credentials;

    configController.events.on('config-updated', () => {
        configController.getConfig().then(config => {
            credentials = config.credentials;
        });
    });
});


module.exports = (request, response, next) => {
    const admins = { [credentials.user]: { password: credentials.password } };

    const user = auth(request);

    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        response.set('WWW-Authenticate', 'Basic realm="example"');
        return response.status(401).send();
    }

    return next();
};