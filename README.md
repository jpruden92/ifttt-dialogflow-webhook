
# 1. Intro

On this repo you will find a very small Dialogflow fullfilment that allows to integrate your chatbots with IFTTT applets.

[Dialogflow](https://dialogflow.com) is a Google platform that facilitate the creation of chatbots. You can configurate your intents and replies easily with a visual interface. You can connect your Dialogflow chatbots with a lot of platforms ( Facebook Messenger, Telegram, Google Assistant, ... ).

If you want to create a chatbot that speaks with third party services ( Gmail, Spotify, ... ) you need to create a fullfilment webhook and develop a connector on your servers.

The objective of this project is to facilitate the integration of third party services with the help of IFTTT.

[IFTTT](https://ifttt.com) is a platform where you can configurate connections between hundreds of services.

# 2. Example
On this example we are going to create a small poll with a chatbot. The replies will be saved on Google Drive.

## Step 1: Create a IFTTT applet:
1. Create a new IFTTT account.
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
1. Create a Heroku account.
2. Click on this button:
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
3. Write an app name and choose a region.
4. Click ``Deploy app``
5. Wait until webhook be deployed.
6. Click on ``View`` and you will be redirected to your app. The URL of your fulfillment will be: ``https://<app_name>.herokuapp.com/fulfillment``.

## Step 3: Create your intent:
1. [Create an agent on dialogflow](https://dialogflow.com/docs/getting-started/first-agent).
2. Create a new intent with this features:
    - Intent name. We will use ``bot.example.poll``.
    - Some training phrases. For example: ``i want to complete the poll``, ``complete the poll``, ``reply the poll``.
    - Two required params:
        - value1 - @sys.given-name - $value1. Prompt: ``Your name?``.
        - value2 - @sys.number - $value2. Prompt: ``Your age?``.

        ![parameters](https://s3-eu-west-1.amazonaws.com/ifttt-dialogflow-webhook-imgs/parameters.png)
    - A response: Thanks for reply our survey.
3. Save intent.
4. Insert your fulfillment URL on Fulfillment section.

## Step 4: Connect all.
1. Open [https://ifttt.com/services/maker_webhooks/settings](https://ifttt.com/services/maker_webhooks/settings). You will see an URL. Open it on your browser.
2. Copy the URL inside ``Make a POST or GET web request to:``. This is the ``IFTTT Webhooks URL``.
3. Go to your Heroku app options: ``https://dashboard.heroku.com/apps/<app_name>/settings``.
4. Reveal config vars and add:

- trigger_url:

    Paste ``IFTTT Webhooks URL``.
    
    ![trigger_url](https://s3-eu-west-1.amazonaws.com/ifttt-dialogflow-webhook-imgs/trigger_url_v2.png)

- intents:

    ```json
    {
        "bot.example.poll": "poll_completed"
    }
    ```

    ![intents](https://s3-eu-west-1.amazonaws.com/ifttt-dialogflow-webhook-imgs/intents.png)

NOTE: You can insert as intents as you want on intents variable in this format:
```json
{
    "dialogflow_intent_name_1": "ifttt_event_name_1",
    "dialogflow_intent_name_2": "ifttt_event_name_2",
    "dialogflow_intent_name_3": "ifttt_event_name_3"
}
```

## Step 5: Test