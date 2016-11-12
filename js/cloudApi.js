/**
 *
 * Copyright 2015 Google Inc.
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
 * Sends a file blob to the speech API endpoint.
 *
 * @param blob the Blob to send.
 * @param encoding the encoding type (e.g. 'flac' or 'LINEAR16').
 * @param rate the encoding rate, ideally 16000.
 */
function sendBlobToSpeech (blob, encoding, rate) {
  var speechSender = new FileReader();
  speechSender.addEventListener('loadend', function () {
    gapi.client.speech.speech.syncrecognize({
      config: {
        encoding: encoding,
        sampleRate: rate
      },
      audio: {
        content: btoa(speechSender.result)
      }
    }).execute(function (r) {
      if (r.results && r.results[0]) {
        console.log('Found result(s):', r.results);
        // document.getElementById('console').innerText += '\n' +
        //      r.results[0].alternatives[0].transcript;
        document.getElementById('scrollconsole').value =
              r.results[0].alternatives[0].transcript + '\n' +
              document.getElementById('scrollconsole').value;
        processSentiment(r.results[0].alternatives[0].transcript);
        searchGoogle(r.results[0].alternatives[0].transcript);
      }
    });
  });
  speechSender.readAsBinaryString(blob);
}

/**
 * Uses the search proxy to query Google for the results.
 */
function searchGoogle (query) {
  document.getElementById('searchframe').src='proxy.php?query=' + query;
}

/**
 * Sends text to the language API endpoint.
 *
 * @param content the text to process sentiment from.
 */
function processSentiment (content) {
  gapi.client.language.documents.analyzeSentiment(
    {
      document: {
        language: 'en-us',
        content: content,
        type: 'PLAIN_TEXT'
      }
    }).execute(function (r) {
      console.log('Sentiment for ', r);
      console.log("I'm really checking", r.documentSentiment.magnitude);

      // Default to positive polarity
      var gVal = r.documentSentiment.magnitude * 255;
      var rVal = 0;

      // Flip the colors if it's negative
      if (r.documentSentiment.polarity == -1) {
        rVal = r.documentSentiment.magnitude * 255;
        gVal = 0;
      }

      rVal = Math.floor(rVal);
      gVal = Math.floor(gVal);

      console.log('Setting BG to ', rVal, gVal);
      var bgStr = 'rgb(' + rVal + ', ' + gVal + ', 0)';
      console.log("document.getElementById('console').style.backgroundColor =" + bgStr);
      document.getElementById('console').style.backgroundColor = bgStr;
      updatePixel(rVal, gVal, 0);
    });
}
