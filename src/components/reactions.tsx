'use client';

import { useState, useEffect }from 'react';
import { doc, runTransaction, collection, getDoc, setDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type ReactionType = 'love' | 'like' | 'applause' | 'funny' | 'sad';

const reactionEmojis: Record<ReactionType, string> = {
  love: '❤️',
  like: '👍',
  applause: '👏',
  funny: '😁',
  sad: '😢',
};

interface ReactionsProps {
  postId: string;
  initialCounts: Record<ReactionType, number>;
}

export function Reactions({ postId, initialCounts }: ReactionsProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [counts, setCounts] = useState(initialCounts);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [isProcessing, setIsProcessing] = useState<ReactionType | null>(null);

  useEffect(() => {
    if (!user || !firestore) return;
    const reactionDocRef = doc(firestore, 'blogPosts', postId, 'reactions', user.uid);
    getDoc(reactionDocRef).then((docSnap) => {
      if (docSnap.exists()) {
        setUserReaction(docSnap.data().type);
      }
    });
  }, [user, firestore, postId]);

  const handleReaction = async (reaction: ReactionType) => {
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to react.',
        variant: 'destructive',
      });
      return;
    }
    if (isProcessing) return;

    setIsProcessing(reaction);

    const postRef = doc(firestore, 'blogPosts', postId);
    const userReactionRef = doc(postRef, 'reactions', user.uid);

    try {
      await runTransaction(firestore, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        const userReactionDoc = await transaction.get(userReactionRef);

        if (!postDoc.exists()) {
          throw new Error('Post does not exist.');
        }

        const currentPostData = postDoc.data();
        let newCounts = { ...currentPostData.reactions };
        const previousReaction = userReactionDoc.exists() ? userReactionDoc.data().type : null;

        if (previousReaction === reaction) {
          // User is deselecting their reaction
          newCounts[reaction] = (newCounts[reaction] || 1) - 1;
          transaction.delete(userReactionRef);
          setUserReaction(null);
        } else {
          // New reaction or changing reaction
          if (previousReaction) {
            newCounts[previousReaction] = (newCounts[previousReaction] || 1) - 1;
          }
          newCounts[reaction] = (newCounts[reaction] || 0) + 1;
          transaction.set(userReactionRef, { type: reaction });
          setUserReaction(reaction);
        }
        
        transaction.update(postRef, { reactions: newCounts });
        setCounts(newCounts);
      });
    } catch (e: any) {
      const isPermissionError = e.code === 'permission-denied';
      if(isPermissionError) {
        const permissionError = new FirestorePermissionError({
          path: userReactionRef.path,
          operation: 'write',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
      toast({
        title: 'Error',
        description: isPermissionError ? 'You do not have permission to react.' : 'Could not save your reaction.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {Object.keys(reactionEmojis).map((key) => {
        const reaction = key as ReactionType;
        return (
          <Button
            key={reaction}
            variant="outline"
            className={cn('transition-all', {
              'bg-accent text-accent-foreground ring-2 ring-primary': userReaction === reaction,
            })}
            onClick={() => handleReaction(reaction)}
            disabled={!!isProcessing}
          >
            <span className="text-xl mr-2">{reactionEmojis[reaction]}</span>
            <span>{counts[reaction] || 0}</span>
          </Button>
        );
      })}
    </div>
  );
}
