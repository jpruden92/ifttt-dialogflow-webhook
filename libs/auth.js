const auth = require('basic-auth');
const configController = require('./config.js');

module.exports = (request, response, next) => {
    const config = configController.getConfig();
    const admins = { [config.user]: { password: config.password } };

    const user = auth(request);

    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        response.set('WWW-Authenticate', 'Basic realm="example"');
        return response.status(401).send();
    }

    return next();
};