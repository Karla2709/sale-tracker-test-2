'use client';

import React, { ReactNode } from 'react';
import { ConfigProvider } from 'antd';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
} 