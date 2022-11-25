import React from 'react';

import Footer from './Footer';
// import Header from './Header';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* <Header /> */}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
