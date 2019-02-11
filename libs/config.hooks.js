const configController = require('./config');

const init = expressApp => {
    expressApp.get('/config', (req, res) => {
        res.send(configController.getConfig());
    });

    expressApp.post('/config/credentials', (req, res) => {
        const { user, password } = req.body;

        configController.setCredentials(user, password).then(() => {
            res.send(true);
        }).catch(err => {
            res.send(err);
        });
    });

    expressApp.post('/config/intentsConnections', (req, res) => {
        const { intentsConnections } = req.body;

        configController.setIntentsConnections(intentsConnections).then(() => {
            res.send(true);
        }).catch(err => {
            res.send(err);
        });
    });

    expressApp.post('/config/iftttWebhook', (req, res) => {
        const { iftttWebhook } = req.body;

        configController.setIFTTTEventsUrl(iftttWebhook).then(() => {
            res.send(true);
        }).catch(err => {
            res.send(err);
        });
    });
}

module.exports = init