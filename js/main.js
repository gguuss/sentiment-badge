/**
 * Records a brief chunk of audio, sets it up as flac, and passes it to
 * the Speech API.
 *
 * @param timeout time, in milliseconds to record a chunk of audio for.
 */
var cantStopWontStop = false;
function autoChunk(timeout) {
  if (cantStopWontStop) {
    audioRecorder.startRecording();
    setTimeout( function() {
        audioRecorder.stopRecording();
        transmitRecording();
      }, timeout);
  }
}

/**
 * Callback used for downloading the result from flac encoding.
 *
 * @param blob the Blob containing the flac file.
 */
function downloadResult(blob) {
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var link = document.getElementById("save");
  link.download="file.flac";
  link.href = url;
  link.click();
}

/**
 * Callback used for sending the result from flac encoding to Google APIs.
 *
 * @param blob the Blob containing the flac file.
 */
function transmitResult(blob) {
  console.log("transmitting", blob);
  sendBlobToSpeech(blob, 'flac', 8000);

  // Danger...
  //audioRecorder.clearRecordedData();
  autoChunk(5000);
}

/**
 * Wrapper around transmitting the current audio to Google APIs.
 */
function transmitRecording() {
  var f = audioRecorder.blob;
  if (f) {
    f.name = 'file.wav';
  } else {
    // not ready, retry...
    setTimeout(transmitRecording, 500);
  }

  // TODO: Why does this not work?
  //sendBlobToSpeech(f, 'MULAW', 8000);

  convertToFlac(f, transmitResult);
}

/**
 * Enables / disables the demo.
 */
function toggleTranscribe() {
  cantStopWontStop = !cantStopWontStop;
  if (cantStopWontStop == true) {
    // Start the demo, change the button
    document.getElementById('toggleButton').innerText = 'Stop the demo';
    autoChunk(5000);
  } else {
    // Stop the demo
    document.getElementById('toggleButton').innerText = 'Start the demo';
  }
}
