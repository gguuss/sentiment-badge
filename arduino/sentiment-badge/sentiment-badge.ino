//
// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

// This demo is based on FirebaseNeoPixel and just sets a single color on the
// display to all pixels.
#include <FirebaseArduino.h>
#include <ESP8266WiFi.h>

#include <Adafruit_NeoPixel.h>

// Set these to run example.
#define FIREBASE_HOST "YOURPROJECT.firebaseio.com"
#define FIREBASE_AUTH "YOUR_AUTH_KEY"
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_SSID_PASSWORD"

const int pixelPin = 13;
Adafruit_NeoPixel strip = Adafruit_NeoPixel(32, pixelPin, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(9600);

  strip.begin();
  strip.setBrightness(25); // 0 ... 255
  strip.show(); // Initialize all pixels to 'off'

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  int count = 0;
  while (WiFi.status() != WL_CONNECTED || count < 5) {
    if (count & 1){
      strip.setPixelColor(0, 0);
    } else {
      strip.setPixelColor(0, 0x00ff00);
    }
    strip.show();
    Serial.print(".");
    delay(500);
    count++;
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}


void loop() {
  // Get all entries.
  // TODO: Replace with streaming
  int r = Firebase.get("/rgbdata/r").getInt();
  int g = Firebase.get("/rgbdata/g").getInt();
  int b = Firebase.get("/rgbdata/b").getInt();
  if (Firebase.failed()) {
      Serial.println("Firebase get failed");
      Serial.println(Firebase.error());
      return;
  }

  for (int i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, r, g, b);
  }
  strip.show();
  delay(200);
}
