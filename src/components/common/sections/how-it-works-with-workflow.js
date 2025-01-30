'use client';
import React from 'react';
import themeConfig from '../../../styles/themeConfig';

const HowItWorksWithWorkflow = ({ data, theme = 'normal' }) => {
  const { bottomContent, topContent } = data;
  
  const commonStyles = {
    heading: `${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color}`,
    paragraph: `${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`,
    accent: themeConfig[theme].text.color.accent
  };

  const getBgColor = () => {
    return theme === 'tech' 
      ? themeConfig[theme].section.background.secondary
      : themeConfig[theme].section.background.primary;
  };
  
  return (
    <div className={`
      ${themeConfig[theme].section.background.primary}
      ${themeConfig[theme].section.padding.base}
      py-16 md:py-24
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 max-w-4xl mx-auto">
          {topContent.icon && (
            <div className="text-6xl mb-8 transform transition-transform hover:scale-110">
              {topContent.icon}
            </div>
          )}
          <h2 className={`${commonStyles.heading} mb-6`}>
            {topContent.title}
          </h2>
          {topContent.subTitle && (
            <h3 className="text-xl text-gray-600 leading-relaxed">
              {topContent.subTitle}
            </h3>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-stretch gap-12 md:gap-8">
          {bottomContent.map((block, index) => (
            <React.Fragment key={block.number}>
              <div className="flex flex-col items-center text-center w-full md:w-[32%] p-6 md:p-8 rounded-xl 
                hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-1 
                transition-all duration-300 ease-in-out">
                <div className={`text-2xl md:text-4xl font-bold mb-2.5 ${commonStyles.accent}
                  transform transition-transform hover:scale-110 opacity-90`}>
                  {block.number}
                </div>
                {block.title && (
                  <h4 className="text-lg md:text-xl font-semibold mb-1.5 tracking-wide">
                    {block.title}
                  </h4>
                )}
                {block.subTitle && (
                  <h5 className="text-base md:text-lg text-gray-500 mb-2 font-medium">
                    {block.subTitle}
                  </h5>
                )}
                <p className={`${commonStyles.paragraph} leading-relaxed whitespace-pre-line text-sm md:text-base`}>
                  {block.content}
                </p>
              </div>
              
              {index < bottomContent.length - 1 && (
                <div className={`hidden md:flex items-center text-3xl ${commonStyles.accent}
                  transform transition-transform hover:scale-110 duration-300 opacity-75`}>
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksWithWorkflow;