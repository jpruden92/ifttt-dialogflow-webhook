const config = require('./config.json');
if (process.env.trigger_url) config.trigger_url = process.env.trigger_url;
if (process.env.intents)     config.intents = JSON.parse(process.env.intents);

const request =         require('request');
const express =         require('express');
const bodyParser =      require('body-parser');
const { dialogflow } =  require('actions-on-google');

const expressApp = express().use(bodyParser.json())
const app = dialogflow();

for (intent in config.intents) {
    const event = config.intents[intent];

    app.intent(intent, conv => {
        console.info(intent + ' received. I will fire ' + event + ' event.');

        const queryResult = conv.body.queryResult;
        const formData = queryResult.parameters;
        const postBody = {
            url: config.trigger_url.replace('{event}', event),
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

expressApp.post('/fulfillment', app);
 
expressApp.listen(process.env.PORT || 3000);