    // Initialize Firebase
    // TODO: Replace with your project's customized code snippet
    var pixelData;

    /**
     * Uses the configuration from JSON to setup the firebase object.
     */
    function initFirebase(fbConfig) {
      var config = {
        apiKey: fbConfig.firebaseApiKey,
        authDomain: fbConfig.firebaseAuthDomain,
        databaseURL: fbConfig.firebaseDatabaseURL,
        storageBucket: fbConfig.firebaseStorageBucket,
        messagingSenderId: fbConfig.firebaseMessagingSenderId,
      };
      firebase.initializeApp(config);
      pixelData = firebase.database();
    }

    /**
     * Updates the badge to the specified red, green, and blue value.
     *
     * @param r the red color value
     * @param g the green color value
     * @param b the blue color value
     */
    function updatePixel(r, g, b){
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
