import sdk from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';

export default function Home() {
  // Pull in the required packages.

  // Replace with your own subscription key, service region (e.g., "westus"), and
  // the name of the file you want to run through the speech recognizer.
  const subscriptionKey = "YourSubscriptionKey";
  const serviceRegion = "YourServiceRegion"; // e.g., "westus"
  const filename = "YourAudioFile.wav"; // 16000 Hz, Mono

  // Create the push stream we need for the speech sdk.
  const pushStream = sdk.AudioInputStream.createPushStream();

  // Open the file and push it to the push stream.
  fs.createReadStream(filename).on('data', function(arrayBuffer: any) {
    pushStream.write(arrayBuffer.buffer);
  }).on('end', function() {
    pushStream.close();
  });

  // We are done with the setup
  console.log("Now recognizing from: " + filename);

  // Create the audio-config pointing to our stream and
  // the speech config specifying the language.
  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

  // Setting the recognition language to English.
  speechConfig.speechRecognitionLanguage = "en-US";

  // Create the speech recognizer.
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // Start the recognizer and wait for a result.
  recognizer.recognizeOnceAsync(
    (result) => {
      console.log(result);

      recognizer.close();
    },
    (error) => {
      console.trace("err - " + error);

      recognizer.close();
    });
  return (
    <main className="min-h-screen">
    </main>
  )
}
