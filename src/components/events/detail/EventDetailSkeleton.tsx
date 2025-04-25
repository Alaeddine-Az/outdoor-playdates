
import { Skeleton } from '@/components/ui/skeleton';

export const EventDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
};
