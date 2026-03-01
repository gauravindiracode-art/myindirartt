import { useEffect, useState } from 'react';
import { subscribeToReactions, setReaction } from '../../api/postApi';
import { useAuth } from '../../contexts/AuthContext';
import type { Reaction, ReactionType } from '../../api/types';
import type { Unsubscribe } from 'firebase/firestore';

const REACTION_EMOJIS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like', emoji: '\u{1F44D}', label: 'Like' },
  { type: 'love', emoji: '\u{2764}\u{FE0F}', label: 'Love' },
  { type: 'celebrate', emoji: '\u{1F389}', label: 'Celebrate' },
  { type: 'support', emoji: '\u{1F64C}', label: 'Support' },
  { type: 'thumbsup', emoji: '\u{1F44F}', label: 'Applaud' },
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
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${
            myReaction?.type === r.type
              ? 'bg-primary-50 text-primary neu-inset-sm'
              : 'bg-neu text-slate-600 neu-sm hover:neu-inset-sm'
          }`}
        >
          <span>{r.emoji}</span>
          <span>{counts[r.type]}</span>
        </button>
      ))}

      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-neu text-slate-400 text-sm transition-all neu-sm hover:neu-inset-sm"
        >
          +
        </button>

        {showPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
            <div className="absolute bottom-full left-0 mb-2 z-20 flex gap-1 bg-neu rounded-xl p-2 neu">
              {REACTION_EMOJIS.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReact(r.type)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:neu-inset-sm text-lg transition-all"
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
