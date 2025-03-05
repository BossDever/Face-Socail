'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// สร้าง QueryClient สำหรับ React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Provider สำหรับ React Query
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [client] = React.useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};