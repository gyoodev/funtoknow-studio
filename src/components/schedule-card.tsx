
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

export interface Call {
  name: string;
  time: string;
  duration: string;
  avatarId: string;
  isFaded?: boolean;
}

export interface Schedule {
  day: string;
  date: string;
  calls: Call[];
}

interface ScheduleCardProps {
  schedule: Schedule;
}

export function ScheduleCard({ schedule }: ScheduleCardProps) {
  const { day, date, calls } = schedule;

  return (
    <div className={cn('p-4 rounded-xl', { 'opacity-50': calls.some(c => c.isFaded) })}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider">{day}</h3>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
      <div className="space-y-3">
        {calls.map((call, index) => {
          const avatar = PlaceHolderImages.find(p => p.id === call.avatarId);
          return (
            <Card key={index} className="p-4 flex items-center gap-4 bg-background shadow-md">
              {avatar && (
                <Image
                  src={avatar.imageUrl}
                  alt={call.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  data-ai-hint={avatar.imageHint}
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-sm">New client call: {call.name}</p>
                <p className="text-xs text-muted-foreground">{call.time}</p>
              </div>
              <div className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                {call.duration}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
