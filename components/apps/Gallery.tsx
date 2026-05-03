"use client";

import React from 'react';

export const Gallery: React.FC<{ url?: string }> = ({ url = "https://galary-quant.vercel.app" }) => {
  return (
    <div className="w-full h-full bg-black">
      <iframe
        src={url}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-storage-access-by-user-activation"
      />
    </div>
  );
};
