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