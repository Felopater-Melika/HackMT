'use client';

import React from 'react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { DevTools } from 'jotai-devtools';

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const store = createStore();
  return (
    <JotaiProvider store={store}>
      {children}
      <DevTools />
    </JotaiProvider>
  );
}

export default Providers;
