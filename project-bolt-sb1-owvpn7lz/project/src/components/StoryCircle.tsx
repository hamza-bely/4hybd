import React from 'react';
import { IonAvatar } from '@ionic/react';
import { Story, User } from '../types';
import { format } from 'date-fns';

interface StoryCircleProps {
  story: Story;
  user?: User;
  onClick: () => void;
  viewed?: boolean;
}

const StoryCircle: React.FC<StoryCircleProps> = ({
  story,
  user,
  onClick,
  viewed = false
}) => {
  // Calculate time since story was posted
  const timeSince = () => {
    const storyDate = new Date(story.createdAt);
    const now = new Date();
    const diff = Math.floor((now.getTime() - storyDate.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return format(storyDate, 'MMM d');
  };

  return (
    <div className="flex flex-col items-center mx-2" onClick={onClick}>
      <div className={`p-1 rounded-full ${viewed ? 'bg-gray-400' : 'bg-gradient-to-tr from-purple-500 to-pink-500'}`}>
        <IonAvatar className="h-16 w-16 border-2 border-white overflow-hidden">
          {story.mediaType.includes('image') ? (
            <img src={story.mediaUrl} alt="Story thumbnail" className="object-cover w-full h-full" />
          ) : (
            <div className="bg-gray-300 w-full h-full flex items-center justify-center">
              <span className="text-xs text-gray-600">Video</span>
            </div>
          )}
        </IonAvatar>
      </div>
      <span className="text-xs mt-1">{user?.name || 'User'}</span>
      <span className="text-xs text-gray-500">{timeSince()}</span>
    </div>
  );
};

export default StoryCircle;