'use client';

import { useRef, useState } from 'react';
import TextToSpeechForm from '@/components/TextToSpeechForm';
import { texttospeech } from '@/libs/texttospeech';

const Home = () => {
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [visemeUrl, setVisemeUrl] = useState<string | undefined>(undefined);

  const handleSubmit = async (voice: string, expressStyle: string, phrase: string) => {
    try {
      const result = await texttospeech(voice, expressStyle, phrase);
      if (!result) {
        throw new Error('음성 합성 실패');
      }
      setAudioUrl(result.audioUrl);
      setVisemeUrl(result.visemeUrl);
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <main className="flex flex-col justify-center items-center size-full bg-linear-to-b from-sky-200 to-white">
      <div className="flex flex-col justify-center items-center gap-4 p-8 w-xl h-fit bg-gray-400/10 rounded-2xl shadow-2xl">
        <TextToSpeechForm onSubmit={handleSubmit} />
        <div className="flex flex-col justify-center items-center gap-4 w-full">
          <audio src={audioUrl} controls/>
          <div className="flex w-full gap-4">
            <a href={audioUrl} download="audio.mp3" className="w-full p-2 border border-gray-700 hover:bg-gray-400/10 text-center rounded-lg">Audio</a>
            <a href={visemeUrl} download="viseme.json" className="w-full p-2 border border-gray-700 hover:bg-gray-400/10 text-center rounded-lg">Viseme</a>
          </div>
        </div>
      </div>
    </main>
  )
};

export default Home;