import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase/config';
import type { Post, PostType, Reaction, ReactionType } from './types';

const POSTS_COL = 'posts';

function toPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    title: data.title as string,
    content: data.content as string,
    type: data.type as PostType,
    authorName: data.authorName as string,
    authorPhoto: data.authorPhoto as string,
    createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
    archived: (data.archived as boolean) ?? false,
  };
}

export function subscribeToPosts(
  callback: (posts: Post[]) => void,
  filterType?: PostType,
): Unsubscribe {
  const constraints = [orderBy('createdAt', 'desc'), where('archived', '==', false)];
  if (filterType) constraints.push(where('type', '==', filterType));

  const q = query(collection(db, POSTS_COL), ...constraints);
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => toPost(d.id, d.data())));
  });
}

export async function createPost(
  post: Omit<Post, 'id' | 'createdAt' | 'archived'>,
): Promise<string> {
  const ref = await addDoc(collection(db, POSTS_COL), {
    ...post,
    archived: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<void> {
  const { id: _id, ...rest } = data;
  await updateDoc(doc(db, POSTS_COL, id), rest);
}

export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, POSTS_COL, id));
}

// Reactions
export async function getReactions(postId: string): Promise<Reaction[]> {
  const snap = await getDocs(collection(db, POSTS_COL, postId, 'reactions'));
  return snap.docs.map((d) => ({ uid: d.id, type: d.data().type as ReactionType }));
}

export async function setReaction(
  postId: string,
  uid: string,
  type: ReactionType | null,
): Promise<void> {
  const ref = doc(db, POSTS_COL, postId, 'reactions', uid);
  if (type === null) {
    const snap = await getDoc(ref);
    if (snap.exists()) await deleteDoc(ref);
  } else {
    await setDoc(ref, { type });
  }
}

export function subscribeToReactions(
  postId: string,
  callback: (reactions: Reaction[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, POSTS_COL, postId, 'reactions'), (snap) => {
    callback(snap.docs.map((d) => ({ uid: d.id, type: d.data().type as ReactionType })));
  });
}
