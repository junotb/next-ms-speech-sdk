import React from 'react';

interface TextToSpeechFormProps {
  onSubmit: (speechKey: string, speechRegion: string, voice: string, expressStyle: string, phrase: string) => void;
}

export default function TextToSpeechForm({ onSubmit }: TextToSpeechFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement); 
    const speechKey = formData.get('speechKey') as string;
    const speechRegion = formData.get('speechRegion') as string;
    const voice = formData.get('voice') as string;
    const expressStyle = formData.get('expressStyle') as string;
    const phrase = formData.get('phrase') as string;

    onSubmit(speechKey, speechRegion, voice, expressStyle, phrase);
  }
  
  return (
    <form className="flex flex-col gap-4 w-full max-w-xl h-full" onSubmit={handleSubmit}>
      <input type="text" name="speechKey" className="w-full p-2 border border-gray-700 focus:bg-gray-400/10 rounded-lg" placeholder="speech key" />
      <input type="text" name="speechRegion" className="w-full p-2 border border-gray-700 focus:bg-gray-400/10 rounded-lg" placeholder="speech region" />
      <select name="voice" className="w-full px-1 py-2 border border-gray-700 rounded-lg">
        <option className="p-2 bg-white" value="en-US-JasonNeural">US: Jason</option>
        <option className="p-2 bg-white" value="en-US-CoraNeural">US: Cora</option>
        <option className="p-2 bg-white" value="en-US-AndrewNeural">US: Andrew</option>
        <option className="p-2 bg-white" value="en-US-EmmaNeural">US: Emma</option>
        <option className="p-2 bg-white" value="en-US-GuyNeural">US: Guy</option>
        <option className="p-2 bg-white" value="en-US-SaraNeural">US: Sara</option>
        <option className="p-2 bg-white" value="en-GB-RyanNeural">UK: Ryan</option>
        <option className="p-2 bg-white" value="en-GB-AbbiNeural">UK: Abbi</option>
      </select>
      <select name="expressStyle" className="w-full px-1 py-2 border border-gray-700 rounded-lg">
        <option className="p-2 bg-white" value="cheerful">cheerful</option>
        <option className="p-2 bg-white" value="excited">excited</option>
        <option className="p-2 bg-white" value="hopeful">hopeful</option>
        <option className="p-2 bg-white" value="angry">angry</option>
        <option className="p-2 bg-white" value="depressed">depressed</option>
      </select>
      <textarea name="phrase" defaultValue="Hello, world!" placeholder="phrase" className="w-full p-2 border border-gray-700 focus:bg-gray-400/10 rounded-lg" rows={8} />
      <button type="submit" className="w-full p-2 border border-gray-700 hover:bg-gray-400/10 rounded-lg">Submit</button>
    </form>
  );
}
