"use client";

const Home = () => {
  const SPEECH_KEY = process.env.SPEECH_KEY!;
  const SPEECH_REGION = process.env.SPEECH_REGION!;

  /*
    curl --location --request POST "https://%SPEECH_REGION%.tts.speech.microsoft.com/cognitiveservices/v1" ^
    --header "Ocp-Apim-Subscription-Key: %SPEECH_KEY%" ^
    --header "Content-Type: application/ssml+xml" ^
    --header "X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3" ^
    --header "User-Agent: curl" ^
    --data-raw "<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>my voice is my passport verify me</voice></speak>" --output output.mp3
  */

  const tts = async () => {
    const file = await fetch(`https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        "User-Agent": "curl"
      },
      body: `
        <speak version='1.0' xml:lang='en-US'>
          <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
            my voice is my passport verify me
          </voice>
        </speak>
      `
    })
    .then(response => response.blob())
    .then(blob => new File([blob], 'tts.wav', { lastModified: Date.now() }));

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(file);
    a.download = "FILENAME2.mp3";
    a.click();
  }
  
  return (
    <main className="min-h-screen">
      <button onClick={tts}>Click</button>
    </main>
  )
};

export default Home;