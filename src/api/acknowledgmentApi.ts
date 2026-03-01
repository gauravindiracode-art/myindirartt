import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase/config';
import type { AcknowledgmentPost, AcknowledgmentResponse, UserRole } from './types';

const ACK_COL = 'acknowledgments';

function toAckPost(id: string, data: Record<string, unknown>): AcknowledgmentPost {
  return {
    id,
    title: data.title as string,
    content: data.content as string,
    targetAudience: data.targetAudience as AcknowledgmentPost['targetAudience'],
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    authorName: data.authorName as string,
  };
}

export function subscribeToAcknowledgmentPosts(
  callback: (posts: AcknowledgmentPost[]) => void,
): Unsubscribe {
  const q = query(collection(db, ACK_COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => toAckPost(d.id, d.data())));
  });
}

export async function createAcknowledgmentPost(
  post: Omit<AcknowledgmentPost, 'id' | 'createdAt'>,
): Promise<string> {
  const ref = await addDoc(collection(db, ACK_COL), {
    ...post,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAcknowledgmentPost(
  id: string,
  data: Partial<Omit<AcknowledgmentPost, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, ACK_COL, id), data);
}

export async function deleteAcknowledgmentPost(id: string): Promise<void> {
  await deleteDoc(doc(db, ACK_COL, id));
}

export async function submitAcknowledgment(
  postId: string,
  uid: string,
  userName: string,
  userRole: UserRole,
): Promise<void> {
  await setDoc(doc(db, ACK_COL, postId, 'responses', uid), {
    userName,
    userRole,
    acknowledgedAt: serverTimestamp(),
  });
}

export function subscribeToResponses(
  postId: string,
  callback: (responses: AcknowledgmentResponse[]) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, ACK_COL, postId, 'responses'),
    (snap) => {
      callback(
        snap.docs.map((d) => ({
          uid: d.id,
          userName: d.data().userName as string,
          userRole: d.data().userRole as UserRole,
          acknowledgedAt: d.data().acknowledgedAt?.toDate?.() ?? new Date(),
        })),
      );
    },
  );
}
