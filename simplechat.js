var PUBNUB;

// Simple utitlity function for formatting a time or a date
function leftPad(string, maxLength, padding) {
  // Make sure we are dealing with a string
  string = string.toString();
  // While the string is not long enough
  while (string.length < maxLength) {
    // Add the padding to the left
    string = padding + string;
  }
  // Return the result
  return string;
}

function simpleChat(id, pubKey, subKey, channel) {
  // start PubNub
  var PUBNUB_demo = PUBNUB.init({
    publish_key: pubKey,
    subscribe_key: subKey
  });
  
  // insert the necessary HTML
  $('#' + id).html('<div class=\"simplechat-container\"><div class=\"simplechat-chat-container\"><div class=\"simplechat-header\">simpleChat</div><ul class=\"simplechat chat\"></ul></div><input type=\"text\" placeholder=\"Type text & hit enter\" maxlength=\"200\" class=\"input\"></div>');

  var box = $('#' + id + ' .chat')[0];
  var input = $('#' + id + ' .input')[0];
  
  // get the users name
  var name = prompt("Name, please:");
  
  if (!name) {
    name = 'Anonymous';
  }
  
  input.focus();
  
  // recieve messages from other people on the chat
  PUBNUB.subscribe({
    channel: channel,
    callback: function(text) {
      if (text.indexOf(' is typing') > -1) {
        var typingName = text.substring(0, text.indexOf(' is typing') || 0);
        if (typingName !== name) {
          $('.typing-' + typingName).remove();
          
          box.innerHTML = '<li class="typing-' + typingName + '"><small>' + typingName + ' is typing</small></li>' + box.innerHTML;
        }
      } else if (text.indexOf(' joined ') > -1) {
        box.innerHTML = '<li><small>' + text.replace(/[<>]/g, '') + '</small></li>' + box.innerHTML;
      } else {
        var senderName = text.substring(0, text.indexOf(' says: ') || 0);
        $('.typing-' + senderName).remove();
        box.innerHTML = '<li>' + text.replace(/[<>]/g, '').replace('AAAAAAAtime:', '<br><small>Sent at ') + '</small></li>' + box.innerHTML ;
      }
    }
  });
  
  // let other people know that you joined the chat (and what time you joined)
  var d = new Date();
  PUBNUB.publish({
    channel: channel,
    message: name + ' joined ' +
      leftPad(d.getHours() % 12, 2, '0') + ':' +
      leftPad(d.getMinutes(), 2, '0') + ':' +
      leftPad(d.getSeconds(), 2, '0') +
      ' (GMT-' + leftPad((d.getTimezoneOffset() / 60) * 100, 4, '0') + ')'
  });
  
  box.innerHTML = '<li><small>You joined ' + leftPad(d.getHours() % 12, 2, '0') + ':' + leftPad(d.getMinutes(), 2, '0') + ':' + leftPad(d.getSeconds(), 2, '0') + '</small></li>' + box.innerHTML;
  // Add some padding to the bottom
  box.innerHTML = '<li></li><li></li><li></li>' + box.innerHTML;
  
  PUBNUB.bind('keyup', input, function(e) {
    if ((e.keyCode || e.charCode) == 13 && input.value.length > 0 && input.value !== ' ') {
      d = new Date();
      PUBNUB.publish({
        channel: channel,
        message:
          name + ' says: ' + input.value +
          'AAAAAAAtime:' +
            leftPad(d.getHours() % 12, 2, '0') + ':' +
            leftPad(d.getMinutes(), 2, '0') + ':' +
            leftPad(d.getSeconds(), 2, '0') +
            ' (GMT-' + leftPad((d.getTimezoneOffset() / 60) * 100, 4, '0') + ')'
      });
      input.value = '';
    } else if (input.value.length == 1) {
      PUBNUB.publish({
        channel: channel,
        message: name + ' is typing'
      });
    }
  });
}