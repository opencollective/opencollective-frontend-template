import React from 'react';

import HostSwitcher from './HostSwitcher';

export default function Header({ hosts, platformTotalCollectives, locale, host, categories, filter, setFilter }) {
  return (
    <div
      className={`flex w-full flex-col justify-center bg-white p-6 lg:mx-0 lg:rounded-lg lg:p-10 ${
        host.root && 'lg:pb-8'
      }`}
    >
      <h1 className="text-[24px] font-bold leading-snug tracking-tight text-[#111827] lg:text-[40px]">
        <span>Discover {host.count.toLocaleString(locale)}</span>
        {host.root && <span className={`relative -top-2 -mx-0.5 -mr-1 select-none text-gray-400`}>*</span>}{' '}
        <span>collectives {host.root ? 'on ' : 'hosted by '}</span>
        <HostSwitcher
          hosts={hosts}
          platformTotalCollectives={platformTotalCollectives}
          locale={locale}
          host={host}
        />{' '}
        <span>making an impact in</span>{' '}
        <span>
          {categories
            .filter(c => !c.options && c.tag !== 'ALL')
            .map((cat, i, arr) => (
              <React.Fragment key={cat.label}>
                <span className="whitespace-nowrap">
                  <button
                    className={`inline-block whitespace-nowrap tracking-tight underline decoration-3 underline-offset-3 transition-colors lg:decoration-4 lg:underline-offset-4 ${
                      filter.tag !== 'ALL' && filter.tag !== cat.tag
                        ? `decoration-transparent hover:decoration-${cat.color.name}-500`
                        : `decoration-${cat.color.name}-500`
                    }`}
                    onClick={() => setFilter({ tag: cat.tag })}
                  >
                    {cat.label.toLowerCase()}
                  </button>
                  {arr.length - 1 === i ? '' : ','}
                </span>
                {` `}
              </React.Fragment>
            ))}
        </span>
        <span>and more.</span>
      </h1>
      {host.root && (
        <p className="mt-4 text-sm text-gray-600">
          * out of {platformTotalCollectives.toLocaleString(locale)} collectives on Open Collective. Displaying data
          from selected Fiscal Hosts.
        </p>
      )}
    </div>
  );
}
