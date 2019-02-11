
# 1. Intro

On this repo you will find a very small Dialogflow fullfilment that allows to integrate your chatbots with IFTTT applets.

[Dialogflow](https://dialogflow.com) is a Google platform that facilitate the creation of chatbots. You can configurate your intents and replies easily with a visual interface. You can connect your Dialogflow chatbots with a lot of platforms ( Facebook Messenger, Telegram, Google Assistant, ... ).

If you want to create a chatbot that speaks with third party services ( Gmail, Spotify, ... ) you need to create a fullfilment webhook and develop a connector on your servers.

The objective of this project is to facilitate the integration of third party services with the help of IFTTT.

[IFTTT](https://ifttt.com) is a platform where you can configurate connections between hundreds of services.

# 2. Example
On this example we are going to create a small poll with a chatbot. The replies will be saved on Google Drive.

## Step 1: Create a IFTTT applet:
1. Create a new [IFTTT account](https://ifttt.com/join).
2. Go to [IFTTT New Applet](https://ifttt.com/create).
3. Click on ``+this``.
4. Search ``webhooks``.
5. Select ``Receive a web request``.
6. Write an event name. We are going to use ``poll_completed``.
7. Click on ``+that``.
8. Search ``Google Sheets``.
9. Select ``Add a row to spreadsheet``.
10. Click ``Create action``.
11. Click ``Finish``.

## Step 2: Deploy the webhook:
1. Create a [Heroku account](https://id.heroku.com/login).
2. Click on this button:
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
3. Write an app name and choose a region.
4. Click ``Deploy app``
5. Wait until webhook be deployed.
6. Click on ``View`` and you will be redirected to your app. Default user is ``test`` and default password is ``test``. Remember change them.
7. This control panel will allow you to connect your chatbot intents to IFTTT applets.

## Step 3: Create your intent:
1. Open a browser and [log in to Dialogflow](https://console.dialogflow.com/api-client/#/login).
2. Click Create agent in the left menu.
3. Enter your agent's name, default language, and default time zone, then click the Create button.

![agent](https://dialogflow.com/docs/images/getting-started/first-agent/creating-002.png)

4. Create a new intent with this features:
    - Intent name. We will use ``bot.example.poll``.
    - Some training phrases. For example: ``i want to complete the poll``, ``complete the poll``, ``reply the poll``.
    - Two required params:
        - value1 - @sys.given-name - $value1. Prompt: ``Your name?``.
        - value2 - @sys.number - $value2. Prompt: ``Your age?``.

        ![parameters](https://s3-eu-west-1.amazonaws.com/ifttt-dialogflow-webhook-imgs/parameters.png)
    - A response: Thanks for reply our survey.
5. Activate Fulfillment on ``Fulfillment > Enable webhook call for this intent.``.
6. Save intent.
7. Insert your Fulfillment URL on ``Fulfillment`` section. Fulfillment URL appears on Heroku control panel (you installed it on previous section).

![fulfillment](https://s3-eu-west-1.amazonaws.com/ifttt-dialogflow-webhook-imgs/fulfillment.png)

## Step 4: Connect all.

1. Go to Heroku control panel.
2. Insert and Save ``IFTTT Events URL``.
3. Insert connections. First row contains Dialogflow intents. Second row contains IFTTT events. On this example you should insert:
    - Intent: ``bot.example.poll``.
    - Action: ``poll_completed``.
4. Save Connections.

## Step 5: Test

1. Go to ``Integrations`` on Dialogflow.
2. Enable Web Demo.
3. Click on ``https://bot.dialogflow.com/...``
4. Write ``i want to complete the poll``.