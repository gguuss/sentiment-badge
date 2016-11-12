# sentiment-badge
Records 5 seconds of audio using WebRTC, converts it to flac client-side,
transmits the audio to the Speech API, transmits the text to the language API,
and uses the sentiment from the language API to control a LED badge via
Firebase.

Also proxies the transcribed result to Google search in an inline frame.

# Running

1. Run the sample using the built-in PHP server:
    php -s localhost:4567

2. Navigate to localhost:4567
3. Click the start demo button and start talking
4. The sample will transcribe and analyze the query and results
