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

// TODO: encapsulate
var pixelData;
/**
 * Uses the configuration from JSON to setup the Firebase object.
 *
 * @param fbConfig a hash containing properties for connecting to Firebase.
 */
function initFirebase (fbConfig) {
  var config = {
    apiKey: fbConfig.firebaseApiKey,
    authDomain: fbConfig.firebaseAuthDomain,
    databaseURL: fbConfig.firebaseDatabaseURL,
    storageBucket: fbConfig.firebaseStorageBucket,
    messagingSenderId: fbConfig.firebaseMessagingSenderId
  };
  firebase.initializeApp(config);
  pixelData = firebase.database();

  setTimeout(function () { updatePixel(0, 0, 0); }, 500);
  setTimeout(function () { updatePixel(255, 0, 0); }, 1000);
  setTimeout(function () { updatePixel(0, 255, 0); }, 1300);
  setTimeout(function () { updatePixel(0, 0, 255); }, 1600);
  setTimeout(function () { updatePixel(0, 0, 0); }, 2500);
}

/**
 * Updates the badge to the specified red, green, and blue value.
 *
 * @param r the red color value
 * @param g the green color value
 * @param b the blue color value
 */
function updatePixel (r, g, b) {
  var pathR = 'rgbdata/r';
  var pathG = 'rgbdata/g';
  var pathB = 'rgbdata/b';
  var pixelRefR = pixelData.ref(pathR);
  var pixelRefG = pixelData.ref(pathG);
  var pixelRefB = pixelData.ref(pathB);
  pixelRefR.set(r);
  pixelRefG.set(g);
  pixelRefB.set(b);
}
