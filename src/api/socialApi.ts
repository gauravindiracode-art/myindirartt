import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase/config';
import type { SocialPost, SocialReport, Reaction, ReactionType } from './types';

const SOCIAL_COL = 'socialPosts';

function toSocialPost(id: string, data: Record<string, unknown>): SocialPost {
  return {
    id,
    content: data.content as string,
    mediaURL: (data.mediaURL as string) ?? null,
    mediaType: (data.mediaType as SocialPost['mediaType']) ?? null,
    authorUid: data.authorUid as string,
    authorName: data.authorName as string,
    authorPhoto: data.authorPhoto as string,
    blocked: (data.blocked as boolean) ?? false,
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? null,
  };
}

// Feed subscriptions
export function subscribeToSocialFeed(
  callback: (posts: SocialPost[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, SOCIAL_COL),
    where('blocked', '==', false),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => toSocialPost(d.id, d.data())));
  });
}

export function subscribeToAllSocialPosts(
  callback: (posts: SocialPost[]) => void,
): Unsubscribe {
  const q = query(collection(db, SOCIAL_COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => toSocialPost(d.id, d.data())));
  });
}

// CRUD
export async function createSocialPost(
  post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt' | 'blocked'>,
): Promise<string> {
  const ref = await addDoc(collection(db, SOCIAL_COL), {
    ...post,
    blocked: false,
    updatedAt: null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSocialPost(
  id: string,
  data: Partial<Omit<SocialPost, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, SOCIAL_COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteSocialPost(id: string): Promise<void> {
  await deleteDoc(doc(db, SOCIAL_COL, id));
}

export async function toggleBlockSocialPost(
  id: string,
  blocked: boolean,
): Promise<void> {
  await updateDoc(doc(db, SOCIAL_COL, id), { blocked });
}

// Media upload / delete
export async function uploadSocialMedia(
  uid: string,
  file: File,
): Promise<{ url: string; type: 'image' | 'video' }> {
  const timestamp = Date.now();
  const path = `social/${uid}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  const type = file.type.startsWith('video/') ? 'video' : 'image';
  return { url, type };
}

export async function deleteSocialMedia(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // File may already be deleted
  }
}

// Reactions (reuses existing Reaction/ReactionType)
export function subscribeToSocialReactions(
  postId: string,
  callback: (reactions: Reaction[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, SOCIAL_COL, postId, 'reactions'), (snap) => {
    callback(snap.docs.map((d) => ({ uid: d.id, type: d.data().type as ReactionType })));
  });
}

export async function setSocialReaction(
  postId: string,
  uid: string,
  type: ReactionType | null,
): Promise<void> {
  const reactionRef = doc(db, SOCIAL_COL, postId, 'reactions', uid);
  if (type === null) {
    await deleteDoc(reactionRef);
  } else {
    await setDoc(reactionRef, { type });
  }
}

// Reports
export async function reportSocialPost(
  postId: string,
  uid: string,
  reason: string,
): Promise<void> {
  await setDoc(doc(db, SOCIAL_COL, postId, 'reports', uid), {
    reason,
    reportedAt: serverTimestamp(),
  });
}

export function subscribeToReports(
  postId: string,
  callback: (reports: SocialReport[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, SOCIAL_COL, postId, 'reports'), (snap) => {
    callback(
      snap.docs.map((d) => ({
        uid: d.id,
        reason: d.data().reason as string,
        reportedAt: (d.data().reportedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
      })),
    );
  });
}
