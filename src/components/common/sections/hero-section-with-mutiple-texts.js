'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';
import { useRouter } from 'next/navigation';

const HeroSectionWithMultipleTexts = ({ data, theme = 'normal' }) => {
  const router = useRouter();
  const currentTheme = themeConfig[theme];

  const handleButtonClick = (type) => (e) => {
    e.preventDefault();
    if (type === 'demo') {
      window.open('https://calendly.com/joey-techacc/30min', '_blank');
    } else {
      router.push('https://app.websitelm.com');
    }
  };

  const renderTitle = (title) => {
    const words = title.split(' ');
    const lastTwoWords = words.slice(-2).join(' ');
    const restOfTitle = words.slice(0, -2).join(' ');

    return (
      <>
        <span className={`${currentTheme.typography.h1.color}`}>
          {restOfTitle}{' '}
        </span>
        <span className={`inline-block -rotate-1 px-2 py-1 bg-gradient-to-r from-[#3374FF]/[0.75] via-[#3374FF]/[0.5] to-[#3374FF]/[0.75] text-white`}>
          {lastTwoWords}
        </span>
      </>
    );
  };

  return (
    <section className={`${currentTheme.section.base} ${currentTheme.section.background.primary} pt-20 pb-20 md:pt-36 md:pb-36`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative z-10 pt-8 md:pt-12">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              {renderTitle(data.topContent.title)}
            </h1>
          </div>
          
          <p className={`text-center ${currentTheme.typography.paragraph.fontSize} ${currentTheme.typography.paragraph.color} pt-3 max-w-3xl mx-auto`}>
            {data.topContent.description}
          </p>
          
          <div className="pt-8 flex justify-center gap-4">
            <button 
              onClick={handleButtonClick('demo')}
              className={`${currentTheme.button.base} ${currentTheme.button.variants.secondary} hover:scale-105`}
            >
              {data.topContent.buttonText}
            </button>
            
            <button 
              onClick={handleButtonClick('getStarted')}
              className={`${currentTheme.button.base} ${currentTheme.button.variants.primary} hover:scale-105`}
            >
              {data.topContent.ctaButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionWithMultipleTexts;