"use client";

import speech_to_text_rest from "@/services/rest/speechtotext";
import { Viseme } from "@/types/Viseme";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const Home = () => {
  const [isSdk, setIsSdk] = useState(true);
  const [audio, setAudio] = useState("");
  const [viseme, setViseme] = useState("");

  const refStartSpeakTextAsyncButton = useRef<HTMLButtonElement>(null);
  const refSubscriptionKey = useRef<HTMLInputElement>(null);
  const refServiceRegion = useRef<HTMLInputElement>(null);
  const refPhrase = useRef<HTMLInputElement>(null);
  const refAudio = useRef<HTMLAnchorElement>(null);
  const refViseme = useRef<HTMLAnchorElement>(null);

  const SPEECH_KEY = process.env.SPEECH_KEY!;
  const SPEECH_REGION = process.env.SPEECH_REGION!;

  const tts = () => {
    if (!isSdk) {
      tts_rest_deprecated();
      return;
    }
    
    // Subscription Key 필드 Disabled 시작
    refSubscriptionKey.current!.disabled = true;

    // Subscription Key 필드 입력여부 검사
    if (refSubscriptionKey.current!.value === "") {
      alert("Please enter your Microsoft Cognitive Services Speech subscription key!");

      // Subscription Key 필드 Disabled 종료
      refSubscriptionKey.current!.disabled = false;
      return;
    }

    // SSML 작성
    const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
          ${refPhrase.current!.value}
        </voice>
      </speak>
    `;
    
    // Synthesizer 객체 생성
    const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(refSubscriptionKey.current!.value, refServiceRegion.current!.value);
    const audioConfig = window.SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    let synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakSsmlAsync(
      ssml,
      (result: any) => {
        // Subscription Key 필드 Disabled 종료
        refStartSpeakTextAsyncButton.current!.disabled = false;

        if (result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          //refAudio.current!.download = result.audioData;
        }
        
        synthesizer.close();
        synthesizer = undefined;
      },
      (error: any) => {
        // Subscription Key 필드 Disabled 종료
        refStartSpeakTextAsyncButton.current!.disabled = false;
        
        window.console.log(error);

        synthesizer.close();
        synthesizer = undefined;
      }
    );
    
    // Subscribes to viseme received event
    let visemes: any[] = [];
    
    synthesizer.visemeReceived = (s: any, e: any) => {
      //window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);

      // `Animation` is an xml string for SVG or a json string for blend shapes
      const animation = e.Animation;

      const viseme: Viseme = {
        offset: e.audioOffset / 10000,
        id: e.visemeId
      }
      visemes.push(viseme);
    }
  };

  const tts_rest_deprecated = async () => {
    const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
          ${refPhrase.current!.value}
        </voice>
      </speak>
    `

    const result = await speech_to_text_rest(refSubscriptionKey.current!.value, refServiceRegion.current!.value, ssml, "test.mp3");
    download(result);
  }

  const download = (result: any) => {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.download = "FILENAME2.mp3";
    a.click();
  };
  
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <input
          ref={refSubscriptionKey}
          placeholder="subscription key"
          className="w-full p-2 bg-transparent border-2 border-black dark:border-white"
          defaultValue={SPEECH_KEY}
        />
        <input
          ref={refServiceRegion}
          placeholder="service region"
          className="w-full p-2 bg-transparent border-2 border-black dark:border-white"
          defaultValue={SPEECH_REGION}
        />
        <input
          ref={refPhrase}
          placeholder="phrase"
          className="w-full p-2 bg-transparent border-2 border-black dark:border-white"
        />
        <button
          ref={refStartSpeakTextAsyncButton}
          className="w-full p-2 bg-transparent border-2 border-black dark:border-white"
          onClick={tts}
        >Click</button>
        <div className="flex w-full gap-4">
          <a
            ref={refAudio}
            download={audio}
            className={`w-full p-2 border-2 border-black dark:border-white text-center ${(audio === '') ? 'pointer-events-none cursor-default' : ''}`}
          >Audio</a>
          <a
            ref={refViseme}
            download={viseme}
            className={`w-full p-2 border-2 border-black dark:border-white text-center ${(viseme === '') ? 'pointer-events-none cursor-default' : ''}`}
          >Viseme</a>
        </div>
      </div>
      <Script src="https://aka.ms/csspeech/jsbrowserpackageraw" />
    </main>
  )
};

export default Home;