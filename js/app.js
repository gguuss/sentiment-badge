/**
 *  Various Globals and initialization.
 */
var audioRecorder; // Stores WebRTC helper
var gConfig; // Configuration loaded from JSON

function initGapi () {
  console.log('loading gapi');

  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', '/config.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == '200') {
      gConfig = JSON.parse(xhr.responseText);
      gapi.client.setApiKey(gConfig.apiKey);
      initAudio();
    }
  };
  xhr.send(null);

  gapi.client.load('speech', 'v1beta1', function () {
    gapi.client.load('language', 'v1beta1', function () {
      document.getElementById('toggleButton').disabled = false;
      document.getElementById('pushToTalk').disabled = false;
      initFirebase(gConfig);
    });
  });
}
