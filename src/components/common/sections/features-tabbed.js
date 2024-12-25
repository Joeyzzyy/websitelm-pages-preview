'use client';

import React, { useState } from 'react';
import themeConfig from '../../../styles/themeConfig';

function FeaturesTabbedSection({ data, theme = 'normal' }) {
  console.log('FeaturesTabbedSection data:', data);
  
  const { title, description, bottomContent, buttonText } = data || {};
  const styles = themeConfig[theme];
  
  const [activeTab, setActiveTab] = useState(bottomContent?.[0]?.tabName);
  const activeContent = bottomContent?.find(tab => tab.tabName === activeTab);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <header className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-3">
          {title}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          {description}
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {bottomContent?.map((tab, index) => (
          <button
            key={`${tab.tabName}-${index}`}
            onClick={() => setActiveTab(tab.tabName)}
            className={`${styles.button.base} text-sm px-4 py-1.5 ${
              activeTab === tab.tabName
                ? styles.button.variants.primary
                : styles.button.variants.outline
            }`}
          >
            {tab.tabName}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-1">
        <div className="w-full md:w-1/3 space-y-3">
          <h3 className={`text-xl font-semibold ${styles.typography.h3.color}`}>
            {activeContent?.title}
          </h3>
          <p className={`text-sm ${styles.typography.paragraph.color}`}>
            {activeContent?.description}
          </p>
          <button 
            className={`${styles.button.base} ${styles.button.variants.primary} hover:scale-105 text-sm px-4 py-1.5`}
          >
            {buttonText}
          </button>
        </div>
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img 
              src={activeContent?.imageUrl} 
              alt={activeContent?.imageAlt}
              className="w-full h-auto max-w-sm mx-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesTabbedSection;

