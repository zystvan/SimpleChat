# SimpleChat

A plugin thingy that inserts a chat box into the element you choose. 

You need [jQuery](https://code.jquery.com/jquery-latest.min.js) and [pubnub.min.js](https://cdn.pubnub.com/pubnub.min.js) for this to work, so at the bottom of your HTML file, add this: 

```
<link rel="stylesheet" href="simplechat.css">

<script src="https://code.jquery.com/jquery.min.js"></script>
<script src="https://cdn.pubnub.com/pubnub.min.js"></script>
<script src="simplechat.js"></script>
<script>
  simpleChat('id-of-parent-element', 'publish_key', 'subscribe_key', 'channel_name');
</script>
```

The chat uses [PubNub](https://www.pubnub.com), which is where you'll need to get your publish and subscribe keys from. 

-----

Made by [Annunziato Tocci](http://tocci.org) who does <strike>some</strike> most of the hard work, and [Zeke Y](https://kk4oxj.github.io), who started the project and pretends to help :D: