const configController = require('./libs/config');
const auth = require('./libs/auth');

const request =         require('request');
const express =         require('express');
const bodyParser =      require('body-parser');
const { dialogflow } =  require('actions-on-google');

const expressApp = express().use(bodyParser.json());
expressApp.use(auth);

require('./libs/config.hooks')(expressApp);

const app = dialogflow();

const init = config => {
    for (intent in config.intentsConnections) {
        const event = config.intentsConnections[intent];

        app.intent(intent, conv => {
            console.info(intent + ' received. I will fire ' + event + ' event.');

            let webHooksKey = config.iftttEventsUrl.split('/');
            webHooksKey = webHooksKey[webHooksKey.length - 1];
            const eventsIftttWebhook = `https://maker.ifttt.com/trigger/${event}/with/key/${webHooksKey}`;

            const queryResult = conv.body.queryResult;
            const formData = queryResult.parameters;
            const postBody = {
                url: eventsIftttWebhook,
                form: formData
            };

            return new Promise((resolve, reject) => {
                request.post(postBody, function(err, response, body) {
                    if (err) {
                        console.error(err);
                        conv.ask('Error!');
                        resolve();
                        return;
                    }

                    conv.ask(queryResult.fulfillmentText);
                    resolve();
                });
            });
        })
    };
}

configController.getConfig().then(config => {
    init(config);

    configController.events.on('config-updated', () => {
        configController.getConfig().then(config => {
            init(config);
        });
    });
});

expressApp.post('/fulfillment', app);
expressApp.use(express.static('static'));
 
expressApp.listen(process.env.PORT || 3000);