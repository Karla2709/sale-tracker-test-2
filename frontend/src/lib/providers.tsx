'use client';

import React, { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import RBACProvider from '@/components/auth/RBACProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider>
      <RBACProvider>
        {children}
      </RBACProvider>
    </ConfigProvider>
  );
} 