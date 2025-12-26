
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faGooglePlay } from '@fortawesome/free-brands-svg-icons';

export interface Review {
  name: string;
  review: string;
  rating: number;
  avatarId: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { name, review: reviewText, rating, avatarId } = review;
  const avatar = PlaceHolderImages.find(p => p.id === avatarId);

  return (
    <Card className="p-4 bg-background shadow-md">
      <div className="flex items-start gap-4">
        {avatar && (
          <Image
            src={avatar.imageUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-full"
            data-ai-hint={avatar.imageHint}
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-sm">{name}</p>
            <FontAwesomeIcon icon={faGooglePlay} className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={cn('h-3 w-3', index < rating ? 'text-yellow-400' : 'text-gray-300')}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {reviewText}
          </p>
        </div>
      </div>
    </Card>
  );
}
