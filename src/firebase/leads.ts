
'use client';

import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface LeadData {
  name: string;
  phone: string;
}

/**
 * Saves a new lead to the 'leads' collection in Firestore.
 * This is a non-blocking operation that handles errors via a global emitter.
 * @param firestore The Firestore instance.
 * @param data An object containing the lead's name and phone number.
 */
export function saveLead(firestore: Firestore | null, data: LeadData) {
  if (!firestore) return;

  const leadsCollection = collection(firestore, 'leads');
  
  const leadData = {
    ...data,
    createdAt: serverTimestamp(),
  };

  addDoc(leadsCollection, leadData).catch(error => {
    errorEmitter.emit(
      'permission-error',
      new FirestorePermissionError({
        path: leadsCollection.path,
        operation: 'create',
        requestResourceData: leadData,
      })
    );
  });
}
