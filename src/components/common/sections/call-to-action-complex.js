'use client';
import React from 'react';
import buttonLinks from '../../ui/button/links';
import themeConfig from '../../../styles/themeConfig';

const CallToAction = ({ data, theme = 'normal' }) => {
  const getButtonLink = (buttonType) => {
    return buttonLinks[buttonType] || '#';
  };

  const { button, typography, section } = themeConfig[theme];

  return (
    <div className={`${section.background.primary} ${section.padding.base}`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className={`${typography.h2.fontSize} ${typography.h2.fontWeight} ${typography.h2.color} mb-6 leading-tight`}>
          {data.title}
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
          {data.subTitle}
        </p>
        
        <div className="mb-12">
          <h3 className={`${typography.h3.fontSize} ${typography.h3.fontWeight} ${typography.h3.color} mb-8`}>
            {data.bottomContent.title}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {data.bottomContent.content.map((item, index) => (
              <div key={index} className="text-left p-6 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-lg mb-4">{data.bottomContent.callToActionEngagementTop}</p>
          <p className="text-lg mb-8">{data.bottomContent.callToActionEngagementBottom}</p>
        </div>

        <div className="flex justify-center items-center space-x-6">
          <a 
            href={getButtonLink()}
            className={`${button.base} ${button.variants.secondary}`}
          >
            {data.buttonText}
          </a>
          <a 
            href={getButtonLink()}
            className={`${button.base} ${button.variants.primary}`}
          >
            {data.ctaButtonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;