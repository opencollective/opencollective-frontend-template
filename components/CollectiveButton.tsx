import React from 'react';

export default function Collective({ collective, openCollectiveModal }) {
  return (
    <button
      className=" flex items-center gap-2 rounded-md px-2 py-2 hover:bg-gray-50 lg:px-4"
      type="button"
      onClick={() => openCollectiveModal(collective.slug)}
    >
      <img
        src={collective.imageUrl.replace('-staging', '')}
        alt={collective.name}
        className="h-8 w-8 rounded object-cover"
      />
      <span className="font-medium">{collective.name}</span>
    </button>
  );
}
