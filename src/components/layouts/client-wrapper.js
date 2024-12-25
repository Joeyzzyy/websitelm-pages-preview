'use client';

import dynamic from 'next/dynamic';

// 直接导入组件
const Header = dynamic(() => import('./header'), {
  ssr: false
});

const Footer = dynamic(() => import('./footer'), {
  ssr: false
});

export function ClientWrapper({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header theme="light" />
      {children}
      <Footer />
    </div>
  );
}