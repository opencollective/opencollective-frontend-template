import React from 'react';

export function InfoBox({ host }) {
  return (
    <div
      className={`flex-col items-center justify-center px-2 lg:rounded-lg lg:p-12 ${host.styles.brandBox} ${
        !host.cta ? 'hidden lg:flex' : 'flex'
      }`}
    >
      <img src={host.logoSrc} alt={host.name} className="hidden h-8 lg:block" />

      <p className={`my-4 hidden text-center font-medium lg:block`}>
        {host.cta?.text ?? `Learn more about ${host.name}`}
      </p>
      <a
        href={host.cta?.href ?? host.website}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full rounded-full lg:rounded-full ${host.styles.button} px-3 py-3 text-center text-sm font-medium lg:text-lg`}
      >
        <span className="hidden lg:inline-block">{host.cta?.buttonLabel ?? 'Learn more'}</span>
        <span className="inline-block lg:hidden">{host.cta?.text}</span>
      </a>
    </div>
  );
}
