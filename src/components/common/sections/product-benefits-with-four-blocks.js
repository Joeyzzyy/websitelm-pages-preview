'use client';

import React from 'react';
import buttonLinks from '../../ui/button/links';
import themeConfig from '../../../styles/themeConfig';

const ProductBenefitsWithFourBlocks = ({ data, author, theme = 'normal' }) => {
  const getButtonLink = () => {
    return buttonLinks.workbench || '#';
  };

  const getBgColor = () => {
    return theme === 'tech' 
      ? themeConfig[theme].section.background.secondary
      : themeConfig[theme].section.background.primary;
  };

  const getButtonStyle = () => {
    return `${themeConfig[theme].button.base} ${themeConfig[theme].button.variants.secondary}`;
  };

  const getModuleStyle = (index) => {
    return `${themeConfig[theme].card.base} ${themeConfig[theme].card.variants.primary}`;
  };

  return (
    <div className={`${getBgColor()} ${themeConfig[theme].section.padding.base}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="w-full md:w-2/5">
            <h2 className={`${themeConfig[theme].typography.h2.fontSize} ${themeConfig[theme].typography.h2.fontWeight} ${themeConfig[theme].typography.h2.color} mb-4`}>
              {data.leftContent.title}
            </h2>
            <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color} mb-6`}>
              {data.leftContent.description}
            </p>
            <a 
              href={getButtonLink()}
              className={getButtonStyle()}
            >
              {data.leftContent.buttonText}
            </a>
          </div>

          <div className="w-full md:w-3/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.rightContent.map((module, index) => (
                <div 
                  key={index} 
                  className={`${getModuleStyle(index)} ${themeConfig[theme].card.padding.md}`}
                >
                  <h3 className={`${themeConfig[theme].typography.h3.fontSize} ${themeConfig[theme].typography.h3.fontWeight} ${themeConfig[theme].typography.h3.color} mb-2`}>
                    {module.title}
                  </h3>
                  <p className={`${themeConfig[theme].typography.paragraph.fontSize} ${themeConfig[theme].typography.paragraph.color}`}>
                    {module.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBenefitsWithFourBlocks;