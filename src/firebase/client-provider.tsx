'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * A client-side component that wraps the main FirebaseProvider.
 * This ensures Firebase is initialized and provided correctly on the client.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
