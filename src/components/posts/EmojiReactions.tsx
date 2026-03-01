import { useEffect, useState } from 'react';
import { subscribeToReactions, setReaction } from '../../api/postApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Reaction, ReactionType } from '../../api/types';
import type { Unsubscribe } from 'firebase/firestore';

const REACTION_EMOJIS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'celebrate', emoji: '🎉', label: 'Celebrate' },
  { type: 'support', emoji: '🙌', label: 'Support' },
  { type: 'thumbsup', emoji: '👏', label: 'Applaud' },
];

interface EmojiReactionsProps {
  postId: string;
  subscribeFn?: (postId: string, cb: (reactions: Reaction[]) => void) => Unsubscribe;
  reactFn?: (postId: string, uid: string, type: ReactionType | null) => Promise<void>;
}

export default function EmojiReactions({
  postId,
  subscribeFn = subscribeToReactions,
  reactFn = setReaction,
}: EmojiReactionsProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    return subscribeFn(postId, setReactions);
  }, [postId, subscribeFn]);

  const myReaction = reactions.find((r) => r.uid === user?.uid);

  const counts = reactions.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const handleReact = async (type: ReactionType) => {
    if (!user) return;
    const newType = myReaction?.type === type ? null : type;
    await reactFn(postId, user.uid, newType);
    setShowPicker(false);
  };

  const activeReactions = REACTION_EMOJIS.filter((r) => counts[r.type]);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {activeReactions.map((r) => (
        <button
          key={r.type}
          onClick={() => handleReact(r.type)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
            myReaction?.type === r.type
              ? 'bg-primary-50 border-primary-300 text-primary'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{r.emoji}</span>
          <span>{counts[r.type]}</span>
        </button>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 text-sm transition-colors"
        >
          +
        </button>

        {showPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
            <div className="absolute bottom-full left-0 mb-2 z-20 flex gap-1 bg-white rounded-xl shadow-lg border border-slate-200 p-2">
              {REACTION_EMOJIS.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReact(r.type)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 text-lg transition-colors"
                  title={r.label}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
