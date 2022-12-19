import React from 'react';

export default function Footer() {
  return (
    <footer className="flex justify-center border-t bg-white p-12">
      <div className="flex w-full max-w-7xl flex-col items-center justify-between gap-3 lg:flex-row">
        <h1 className=" text-3xl font-bold text-gray-900">Discover</h1>
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-600">powered by</p>
          <a href="https://opencollective.com">
            <img
              src="/oc-logo.svg"
              alt="Open Collective"
              height="32px"
              width="164px"
              className="grayscale transition-all duration-300 hover:grayscale-0"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
