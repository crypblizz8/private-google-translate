'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TranslatePage() {
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
  ];

  // State management
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Swap languages function
  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);

    // Swap text content too if available
    if (translatedText && inputText) {
      setInputText(translatedText);
      // Will trigger auto-translation
    }
  };

  // Handle translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);

    try {
      const fromLang =
        languages.find((lang) => lang.code === sourceLanguage)?.name ||
        sourceLanguage;
      const toLang =
        languages.find((lang) => lang.code === targetLanguage)?.name ||
        targetLanguage;

      // Skip translation if languages are the same
      if (sourceLanguage === targetLanguage) {
        setTranslatedText(inputText);
        setIsTranslating(false);
        return;
      }

      // Add more detailed system prompt
      const systemPrompt = `You are a translation tool that ONLY translates text. Your ONLY function is to translate the exact text provided from ${fromLang} to ${toLang}. 
      IMPORTANT: 
      - Do NOT explain the translation
      - Do NOT answer questions about the content
      - Do NOT provide definitions or explanations
      - Do NOT add ANY additional text
      - ONLY return the direct translation of the input text
      - If the text appears to be a question, still ONLY translate it, do not answer it`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3.1-8B-Instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputText },
          ],
          temperature: 0.2,
          top_p: 0.95,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Translation API error:', errorData);
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        setTranslatedText(data.choices[0].message.content.trim());
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid response format from translation service');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText(
        `Translation failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // Auto-translate after typing stops
  useEffect(() => {
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Don't translate if input is empty
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    // Set a new timeout for translation
    const timeout = setTimeout(() => {
      handleTranslate();
    }, 1000); // 1 second delay after typing stops

    //@ts-ignore
    setTypingTimeout(timeout);

    // Clean up function to clear the timeout when component unmounts
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
    //@ts-ignore
  }, [inputText, sourceLanguage, targetLanguage]);

  return (
    <div className='min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center'>
      <header className='mb-6'>
        <Image
          src='/noogle.png'
          alt='Noogle Logo'
          width={200}
          height={50}
          className='mx-auto'
        />
        <h1 className='text-3xl font-light text-center text-black'>
          Translate
        </h1>
      </header>

      <main className='w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Language selector */}
        <div className='flex items-center justify-between p-4 bg-blue-50'>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            className='bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {languages.map((lang) => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className='bg-white p-2 rounded-full hover:bg-gray-100 focus:outline-none transform transition hover:scale-110'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='w-6 h-6 text-blue-600'
            >
              <polyline points='16 3 21 8 16 13'></polyline>
              <line x1='21' y1='8' x2='9' y2='8'></line>
              <polyline points='8 21 3 16 8 11'></polyline>
              <line x1='3' y1='16' x2='15' y2='16'></line>
            </svg>
          </button>

          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className='bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {languages.map((lang) => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input text area */}
        <div className='p-4 border-b'>
          <div className='relative'>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Enter text to translate'
              className='w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
            ></textarea>
            {/* Small typing indicator */}
            {inputText && typingTimeout && (
              <div className='absolute bottom-2 right-2'>
                <span className='text-xs text-blue-500'>
                  Auto-translating...
                </span>
              </div>
            )}
          </div>
          <div className='flex justify-between mt-2'>
            <span className='text-sm font-semibold text-gray-600'>
              {inputText.length} characters
            </span>

            <button
              onClick={() => setInputText('')}
              className='text-xs text-gray-500 hover:text-gray-700'
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output text area with modern loading state */}
        <div className='p-4'>
          <div className='relative'>
            <textarea
              value={translatedText}
              readOnly
              placeholder='Translation'
              className='w-full h-32 p-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none resize-none transition-opacity duration-300 ease-in-out'
              style={{ opacity: isTranslating ? 0.6 : 1 }}
            ></textarea>

            {/* Modern loading indicator */}
            {isTranslating && (
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <div className='flex space-x-2'>
                  <div
                    className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
                <p className='text-sm text-blue-600 mt-2 font-medium'>
                  Translating...
                </p>
              </div>
            )}
          </div>

          <div className='flex justify-end mt-2'>
            <button
              onClick={() => {
                if (navigator.clipboard && translatedText) {
                  navigator.clipboard.writeText(translatedText);
                }
              }}
              className='p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`w-5 h-5 text-blue-600 ${
                  !translatedText || isTranslating ? 'opacity-50' : ''
                }`}
              >
                <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
                <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
              </svg>
            </button>
          </div>
        </div>
      </main>

      <footer className='mt-8 text-center text-xs text-gray-500 w-full'>
        <p>
          Made by{' '}
          <a
            href='https://x.com/crypblizz'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-gray-700 text-blue-500'
          >
            @crypblizz
          </a>
        </p>
      </footer>
    </div>
  );
}
