import { Skeleton } from "./skeleton";

export const LoadingSkeleton = () => (
    <div className="space-y-2">
        {[...Array(3)].map((_, i) => ( 
             <div key={i} className="flex items-center justify-between p-2 border-b border-gray-200">
                 <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" /> 
                    <Skeleton className="h-5 w-40" /> 
                 </div>
                 <div className="flex space-x-1">
                     <Skeleton className="h-7 w-7" />
                     <Skeleton className="h-7 w-7" /> 
                 </div>
            </div>
        ))}
    </div>
);
