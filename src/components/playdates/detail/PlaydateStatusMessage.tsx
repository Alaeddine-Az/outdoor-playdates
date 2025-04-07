
import React from 'react';

interface PlaydateStatusMessageProps {
  isCanceled: boolean;
  isCompleted: boolean;
}

export const PlaydateStatusMessage: React.FC<PlaydateStatusMessageProps> = ({ 
  isCanceled, 
  isCompleted 
}) => {
  if (!isCanceled && !isCompleted) return null;
  
  if (isCanceled) {
    return (
      <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
        This playdate has been canceled by the host.
      </div>
    );
  }
  
  if (isCompleted) {
    return (
      <div className="mt-4 p-3 bg-amber-100 text-amber-800 rounded-md border border-amber-200">
        This playdate has already ended.
      </div>
    );
  }
  
  return null;
};
