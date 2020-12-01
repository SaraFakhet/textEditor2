// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('e0f07ea56123ef7bab7b', {
  cluster: 'eu'
});

var channel = pusher.subscribe('editor');
channel.bind('text-box', function(data) {
  alert(JSON.stringify(data));
});
