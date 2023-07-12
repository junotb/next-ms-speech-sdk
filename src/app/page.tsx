"use client";

import speech_to_text_rest from "@/services/rest/speechtotext";
import { Viseme } from "@/types/Viseme";
import Script from "next/script";
import { useRef } from "react";

const Home = () => {
  const refVoice = useRef<HTMLSelectElement>(null);
  const refPhrase = useRef<HTMLInputElement>(null);
  const refStartSpeakTextAsyncButton = useRef<HTMLButtonElement>(null);
  const refAudioTag = useRef<HTMLAudioElement>(null);
  const refAudioFile = useRef<HTMLAnchorElement>(null);
  const refViseme = useRef<HTMLAnchorElement>(null);

  const SPEECH_KEY = process.env.SPEECH_KEY!;
  const SPEECH_REGION = process.env.SPEECH_REGION!;

  const tts = () => {
    // SSML 작성
    const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' name='${refVoice.current!.value}'>
          ${refPhrase.current!.value}
        </voice>
      </speak>
    `;
    
    // Synthesizer 객체 생성
    const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    const audioConfig = window.SpeechSDK.AudioConfig.fromAudioFileOutput('audio.mp3');
    let synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    // Viseme 배열 초기화
    let visemes: Viseme[] = [];

    // SSML 마크업을 음원으로 변환
    synthesizer.speakSsmlAsync(
      ssml,
      (result: any) => {
        // 사용자 콜백함수 실행
        // 성공여부: Boolean, Audio 데이터: any, Viseme 데이터: Viseme[]
        result_SynthesizingAudioCompleted(
          result.reason === window.SpeechSDK.ResultReason.SynthesizingAudioCompleted
          , result.audioData
          , visemes
        );
        
        synthesizer.close();
        synthesizer = undefined;
      },
      (error: any) => {
        // 사용자 콜백함수 실행
        error_SynthesizingAudioCompleted(error);

        synthesizer.close();
        synthesizer = undefined;
      }
    );
    
    // Viseme 수신 이벤트 함수   
    synthesizer.visemeReceived = (s: any, e: any) => {
      window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);

      // `Animation` is an xml string for SVG or a json string for blend shapes
      const animation = e.Animation;

      const viseme: Viseme = {
        offset: e.audioOffset / 10000,
        id: e.visemeId
      }
      visemes.push(viseme);
    }
  };

  const result_SynthesizingAudioCompleted = (audioCompleted: boolean, audioData: any, visemes: Viseme[]) => {
    // Subscription Key 필드 Disabled 종료
    refStartSpeakTextAsyncButton.current!.disabled = false;

    if (audioCompleted) {
      update_audio_src(audioData);
      download(audioData, refAudioFile, 'audio/mp3', 'audio.mp3');
      download(JSON.stringify(visemes), refViseme, 'application/json', 'viseme.json');
    }
  };

  const error_SynthesizingAudioCompleted = (error: any) => {
    // Subscription Key 필드 Disabled 종료
    refStartSpeakTextAsyncButton.current!.disabled = false;
    
    window.console.log(error);
  };

  const tts_rest_deprecated = async () => {
    const ssml = `
      <speak version='1.0' xml:lang='en-US'>
        <voice xml:lang='en-US' xml:gender='Female' name='en-US-JennyNeural'>
          ${refPhrase.current!.value}
        </voice>
      </speak>
    `

    const data = await speech_to_text_rest(SPEECH_KEY, SPEECH_REGION, ssml, "test.mp3");
    download(data, refAudioFile, "audio/mp3", "audio.mp3");
  };

  const update_audio_src = (data: any) => {
    refAudioTag.current!.src = window.URL.createObjectURL(new Blob([data], { type: "audio/mp3" }));
  };
  
  const download = (data: any, ref: React.RefObject<HTMLAnchorElement>, filetype: string, filename: string) => {    
    ref.current!.href = window.URL.createObjectURL(new Blob([data], { type: filetype }));
    ref.current!.download = filename;
    
    ref.current!.style.backgroundColor = "transparent";
  };
  
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <select
          ref={refVoice}
          className="w-full px-1 py-2 bg-transparent border-2 border-black dark:border-white"
        >
          <option className="p-2 bg-white dark:bg-black" value="en-US-JasonNeural">US: Jason</option>
          <option className="p-2 bg-white dark:bg-black" value="en-US-CoraNeural">US: Cora</option>
          <option className="p-2 bg-white dark:bg-black" value="en-GB-RyanNeural">UK: Ryan</option>
          <option className="p-2 bg-white dark:bg-black" value="en-GB-AbbiNeural">UK: Abbi</option>
        </select>
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
        <audio
          ref={refAudioTag}
          controls
        ></audio>
        <div className="flex w-full gap-4">
          <a
            ref={refAudioFile}
            className="w-full p-2 border-2 border-black dark:border-white text-center bg-neutral-500"
          >Audio</a>
          <a
            ref={refViseme}
            className="w-full p-2 border-2 border-black dark:border-white text-center bg-neutral-500"
          >Viseme</a>
        </div>
      </div>
      <Script src="https://aka.ms/csspeech/jsbrowserpackageraw" />
    </main>
  )
};

export default Home;