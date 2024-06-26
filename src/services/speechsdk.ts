const speech_to_text_rest = async (SPEECH_KEY: string, SPEECH_REGION: string, SSML:string, FILE_NAME: string): Promise<Blob> => {
  /*
    curl --location --request POST "https://%SPEECH_REGION%.tts.speech.microsoft.com/cognitiveservices/v1" ^
    --header "Ocp-Apim-Subscription-Key: %SPEECH_KEY%" ^
    --header "Content-Type: application/ssml+xml" ^
    --header "X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3" ^
    --header "User-Agent: curl" ^
    --data-raw "<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>my voice is my passport verify me</voice></speak>" --output output.mp3
  */

  const blob = await fetch(`https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": SPEECH_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
      "User-Agent": "curl"
    },
    body: SSML
  })
  .then(response => response.blob());

  return blob;
}

export default speech_to_text_rest;