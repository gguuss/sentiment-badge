/**
 *
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Records a brief chunk of audio, sets it up as flac, and passes it to
 * the Speech API.
 *
 * @param timeout time, in milliseconds to record a chunk of audio for.
 */
var cantStopWontStop = false;
function autoChunk (timeout) {
  if (cantStopWontStop) {
    audioRecorder.startRecording();
    setTimeout(function () {
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
function downloadResult (blob) {
  var url = (window.URL || window.webkitURL).createObjectURL(blob);
  var link = document.getElementById('save');
  link.download = 'file.flac';
  link.href = url;
  link.click();
}

/**
 * Callback used for sending the result from flac encoding to Google APIs.
 *
 * @param blob the Blob containing the flac file.
 */
function transmitResult (blob) {
  console.log('transmitting', blob);
  // Note: If you're seeing 400 errors, you probably have the wrong value
  // here: the input on your computer can affect the sample rate.
  sendBlobToSpeech(blob, 'flac', 44100);

  // TODO: Clip sound based on silences.
  autoChunk(5000);
}

/**
 * Wrapper around transmitting the current audio to Google APIs.
 */
function transmitRecording () {
  var f = audioRecorder.blob;
  if (f) {
    f.name = 'file.wav';
  } else {
    // not ready, retry...
    setTimeout(transmitRecording, 500);
  }

  // TODO: Why does this not work?
  // sendBlobToSpeech(f, 'MULAW', 8000);

  convertToFlac(f, transmitResult);
}

/**
 * Enables / disables the demo.
 */
function toggleTranscribe () {
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
