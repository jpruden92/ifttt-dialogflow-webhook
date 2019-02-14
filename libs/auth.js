const auth = require('basic-auth');
const configController = require('./config.js');

let credentials = {
    user: '',
    password: ''
};

let initiated = false;

configController.getConfig().then(config => {
    credentials = config.credentials;
    initiated = true;

    configController.events.on('config-updated', () => {
        configController.getConfig().then(config => {
            credentials = config.credentials;
        });
    });
});


module.exports = (request, response, next) => {
    if (!initiated) res.send('Your configuration is being deploying. Return to this page in few minutes.');

    const admins = { [credentials.user]: { password: credentials.password } };

    const user = auth(request);

    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        response.set('WWW-Authenticate', 'Basic realm="example"');
        return response.status(401).send();
    }

    return next();
};