'use client';

import { useState } from 'react';
// import { ArrowDownUp, Copy, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

export default function TranslateApp() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = () => {
    // In a real app, this would call a translation API
    setTranslatedText(
      `[Translation from ${sourceLanguage} to ${targetLanguage}]: ${sourceText}`
    );
  };

  const handleClearText = () => {
    setSourceText('');
    setTranslatedText('');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className='max-w-3xl mx-auto p-4 md:p-6'>
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        {/* Header */}
        <div className='p-4 border-b'>
          <h1 className='text-xl font-medium text-blue-600'>
            Google Translate
          </h1>
        </div>

        {/* Language Selection */}
        <div className='flex items-center p-2 md:p-4 gap-2 bg-white'>
          <div className='flex-1'>
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className='border-none shadow-none focus:ring-0 h-auto p-1 text-sm'>
                <SelectValue placeholder='Select language' />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant='ghost'
            size='icon'
            onClick={handleSwapLanguages}
            className='rounded-full h-8 w-8'
          >
            {/* <ArrowDownUp className='h-4 w-4' /> */}
          </Button>

          <div className='flex-1'>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className='border-none shadow-none focus:ring-0 h-auto p-1 text-sm'>
                <SelectValue placeholder='Select language' />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Source Text Area */}
        <div className='p-4 bg-white border-b relative'>
          <Textarea
            placeholder='Enter text'
            className='min-h-[120px] resize-none border-none focus-visible:ring-0 p-0 text-base'
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            onBlur={handleTranslate}
          />
          {sourceText && (
            <Button
              variant='ghost'
              size='icon'
              onClick={handleClearText}
              className='absolute top-4 right-4 h-6 w-6 rounded-full'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
          <div className='flex justify-between mt-2'>
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                disabled={!sourceText}
              >
                <Volume2 className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={() => handleCopyText(sourceText)}
                disabled={!sourceText}
              >
                <Copy className='h-4 w-4' />
              </Button>
            </div>
            <div className='text-xs text-gray-400'>
              {sourceText.length} / 5000
            </div>
          </div>
        </div>

        {/* Translated Text Area */}
        <div className='p-4 bg-gray-50'>
          <div className='min-h-[120px] text-base'>
            {translatedText || (
              <span className='text-gray-400'>Translation</span>
            )}
          </div>
          <div className='flex justify-end mt-2'>
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                disabled={!translatedText}
              >
                <Volume2 className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={() => handleCopyText(translatedText)}
                disabled={!translatedText}
              >
                <Copy className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-4 text-center text-xs text-gray-500'>
        <p>
          This is a UI demo only. In a real app, you would integrate with a
          translation API.
        </p>
      </div>
    </div>
  );
}
