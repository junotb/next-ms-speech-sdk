"use client";

import { Viseme } from "@/types/Viseme";
import Script from "next/script";
import { useRef } from "react";

const Home = () => {
  const refVoice = useRef<HTMLSelectElement>(null);
  const refExpressStyle = useRef<HTMLSelectElement>(null);
  const refPhrase = useRef<HTMLTextAreaElement>(null);
  const refStartSpeakTextAsyncButton = useRef<HTMLButtonElement>(null);
  const refAudioTag = useRef<HTMLAudioElement>(null);
  const refAudioFile = useRef<HTMLAnchorElement>(null);
  const refViseme = useRef<HTMLAnchorElement>(null);

  const SPEECH_KEY = process.env.SPEECH_KEY!;
  const SPEECH_REGION = process.env.SPEECH_REGION!;

  let audioDestination: any;

  const tts = () => {
    // Synthesizer 객체 생성
    audioDestination = new window.SpeechSDK.SpeakerAudioDestination();    
    const speechConfig = window.SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    const audioConfig = window.SpeechSDK.AudioConfig.fromSpeakerOutput(audioDestination);
    let synthesizer = new window.SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    // 자동재생 방지
    audioDestination.onAudioStart = () => {
      audioDestination.pause();
    };

    // Viseme 배열 초기화
    let visemes: Viseme[] = [];

    // SSML 마크업을 음원으로 변환
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
        <voice name="${refVoice.current!.value}">
          <mstts:express-as style="${refExpressStyle.current!.value}" styledegree="2">
            ${refPhrase.current!.value}
          </mstts:express-as>
        </voice>
      </speak>
      
    `;
    window.console.log(ssml);
    synthesizer.speakSsmlAsync(
      ssml,
      (result: any) => {
        // 사용자 콜백함수 실행
        // 성공여부: Boolean, Audio 데이터: ArrayBuffer -> any, Viseme 데이터: Viseme[]
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
    
    //window.console.log(error);
  };

  const update_audio_src = (data: any) => {
    refAudioTag.current!.src = window.URL.createObjectURL(new Blob([data], { type: "audio/mp3" }));
  };
  
  const download = (data: any, ref: React.RefObject<HTMLAnchorElement | null>, filetype: string, filename: string) => {    
    ref.current!.href = window.URL.createObjectURL(new Blob([data], { type: filetype }));
    ref.current!.download = filename;
    
    ref.current!.style.backgroundColor = "transparent";
  };
  
  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4 w-full max-w-xl h-full">
        <select
          ref={refVoice}
          className="w-full px-1 py-2 bg-transparent border-2 border-black dark:border-white"
        >
          <option className="p-2 bg-white dark:bg-black" value="en-US-JasonNeural">US: Jason</option>
          <option className="p-2 bg-white dark:bg-black" value="en-US-CoraNeural">US: Cora</option>
          <option className="p-2 bg-white dark:bg-black" value="en-US-AndrewNeural">US: Andrew</option>
          <option className="p-2 bg-white dark:bg-black" value="en-US-EmmaNeural">US: Emma</option>
          <option className="p-2 bg-white dark:bg-black" value="en-US-GuyNeural">US: Guy</option>
          <option className="p-2 bg-white dark:bg-black" value="en-US-SaraNeural">US: Sara</option>
          <option className="p-2 bg-white dark:bg-black" value="en-GB-RyanNeural">UK: Ryan</option>
          <option className="p-2 bg-white dark:bg-black" value="en-GB-AbbiNeural">UK: Abbi</option>
        </select>
        <select
          ref={refExpressStyle}
          className="w-full px-1 py-2 bg-transparent border-2 border-black dark:border-white"
        >
          <option className="p-2 bg-white dark:bg-black" value="cheerful">cheerful</option>
          <option className="p-2 bg-white dark:bg-black" value="excited">excited</option>
          <option className="p-2 bg-white dark:bg-black" value="hopeful">hopeful</option>
          <option className="p-2 bg-white dark:bg-black" value="angry">angry</option>
          <option className="p-2 bg-white dark:bg-black" value="depressed">depressed</option>
        </select>
        <textarea
          ref={refPhrase}
          placeholder="phrase"
          className="w-full p-2 bg-transparent border-2 border-black dark:border-white"
          rows={8}
        ></textarea>
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
          >JSON</a>
        </div>
      </div>
      <Script src="https://aka.ms/csspeech/jsbrowserpackageraw" />
    </main>
  )
};

export default Home;