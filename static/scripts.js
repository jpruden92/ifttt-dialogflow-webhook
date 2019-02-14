document.querySelector('#fulfillmentUrl').textContent = `${window.location.href}fulfillment`;

const addConnection = (intent, action) => {
    const key = randomString(5);

    const domStr =  `<input type="text" class="form-control intent" aria-describedby="intent" value="${ intent || '' }" placeholder="Dialogflow Intent">` +
                    `<input type="text" class="form-control event" aria-describedby="intent" value="${ action || '' }" placeholder="IFTTT Event">` +
                    `<button type="submit" class="btn btn-primary" onClick="removeConnection('${key}')">Remove</button>`;

    const div = document.createElement('div');
    div.className = 'connection';
    div.id = key;
    div.innerHTML = domStr;

    document.querySelector('#connections').appendChild(div);
}

const load = () => {
    $.get( '/config', function( data ) {
        console.info(data);

        document.querySelector('#iftttEventsURL').value = data.iftttEventsUrl || '';
        loadConnections(data.intentsConnections);
    });
}

const loadConnections = connections => {
    if (!connections || Object.keys(connections).length === 0) addConnection();

    for (intent in connections) {
        addConnection(intent, connections[intent]);
    }
}

const saveCredentials = () => {
    const user = document.querySelector('#user').value;
    const password = document.querySelector('#password').value;

    $.ajax({
        url: '/config/credentials', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({ user, password }),
        success: () => {
            alert('Ok!');
        }
    })
}

const saveIftttWebhook = () => {
    const iftttWebhook = document.querySelector('#iftttEventsURL').value;

    $.ajax({
        url: '/config/iftttWebhook', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({ iftttWebhook }),
        success: () => {
            alert('Ok!');
        }
    })
}

const saveIntentsConnections = () => {
    const connections = document.querySelectorAll('.connection');
    const intentsConnections = {};

    connections.forEach(connection => {
        const intent = connection.querySelector('.intent').value;
        const event = connection.querySelector('.event').value;

        if (intent && event) intentsConnections[intent] = event;
    })

    $.ajax({
        url: '/config/intentsConnections', 
        type: 'POST', 
        contentType: 'application/json', 
        data: JSON.stringify({ intentsConnections }),
        success: () => {
            alert('Ok!');
        }
    })
}

const randomString = length => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const removeConnection = key => {
    document.querySelector(`#${key}`).remove();
}

load();