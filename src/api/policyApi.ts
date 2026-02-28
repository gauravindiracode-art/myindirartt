import {
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase/config';
import type { Policy, Acknowledgment } from './types';

const POLICIES_COL = 'policies';

function toPolicy(id: string, data: Record<string, unknown>): Policy {
  return {
    id,
    title: data.title as string,
    content: data.content as string,
    department: data.department as string,
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  };
}

export function subscribeToPolicies(callback: (policies: Policy[]) => void): Unsubscribe {
  const q = query(collection(db, POLICIES_COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => toPolicy(d.id, d.data())));
  });
}

export async function createPolicy(
  policy: Omit<Policy, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, POLICIES_COL), {
    ...policy,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Acknowledgments
export async function getAcknowledgments(policyId: string): Promise<Acknowledgment[]> {
  const snap = await getDocs(collection(db, POLICIES_COL, policyId, 'acknowledgments'));
  return snap.docs.map((d) => ({
    uid: d.id,
    userName: d.data().userName as string,
    acknowledgedAt: (d.data().acknowledgedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
  }));
}

export async function acknowledgePolicy(
  policyId: string,
  uid: string,
  userName: string,
): Promise<void> {
  await setDoc(doc(db, POLICIES_COL, policyId, 'acknowledgments', uid), {
    userName,
    acknowledgedAt: serverTimestamp(),
  });
}

export function subscribeToAcknowledgments(
  policyId: string,
  callback: (acks: Acknowledgment[]) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, POLICIES_COL, policyId, 'acknowledgments'),
    (snap) => {
      callback(
        snap.docs.map((d) => ({
          uid: d.id,
          userName: d.data().userName as string,
          acknowledgedAt: d.data().acknowledgedAt?.toDate?.() ?? new Date(),
        })),
      );
    },
  );
}
