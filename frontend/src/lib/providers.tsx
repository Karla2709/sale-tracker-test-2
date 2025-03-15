'use client';

import React, { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { TaskProvider } from './contexts/TaskContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </ConfigProvider>
  );
} 