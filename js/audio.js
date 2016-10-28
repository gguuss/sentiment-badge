function gotStream(audioStream) {
  audioRecorder = RecordRTC(audioStream, {
    recorderType: StereoAudioRecorder,
    numberOfAudioChannels: 1
  });
}

function initAudio() {
  if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
  if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

  navigator.getUserMedia({
    "audio": {
      "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
      },
      "optional": []
    },
  }, gotStream, function(e) {
    alert('Error getting audio');
    console.log(e);
  });
}

function saveRecording() {
    var f = audioRecorder.blob;
    f.name = 'file.wav';
    convertToFlac(f, downloadResult);
}

function convertToFlac(f, callback) {
  worker = new Worker('/flac.js/worker/EmsWorkerProxy.js');
  // Listen for messages by the worker
  worker.onmessage = function(e) {
    if (e.data && e.data.reply === 'done') {
      for (fileName in e.data.values) {
        // Pass the flac blob to the callback
        callback(e.data.values[fileName].blob);
      }
    }
  };

  fr = new FileReader();
  fr.addEventListener('loadend', function() {
    var encodedName = "file.wav";

    var args = [
      encodedName
    ];
    console.log(args);
    var inData = {};
    inData[f.name] = new Uint8Array(fr.result);

    var outData = {};
    outData['file.flac'] = {
      // Its MIME type
      'MIME': 'audio/flac'
    };

    // Finally post all the data to the
    // worker together with the "encode"
    // command.
    worker.postMessage({
      command: 'encode',
      args: args,
      outData: outData,
      fileData: inData
    });
  });

  fr.readAsArrayBuffer(f);
}
