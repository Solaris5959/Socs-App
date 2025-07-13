import { Skeleton } from "@/components/ui/skeleton"

// Placeholder component for user profile skeleton loading state
const ProfileSkeleton = () => {
    return (
        <div className="w-full bg-white dark:bg-slate-900 border-none shadow-none">
            <div className="p-6">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>

                    {/* Profile Picture Skeleton */}
                    <div className="mt-6 md:mt-0">
                        <Skeleton className="w-32 h-32 rounded-full" />
                    </div>
                </div>

                {/* Form Fields Skeleton */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Repeat for each form field */}
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="grid gap-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </div>

                {/* Actions Skeleton */}
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        </div>
    );
};

export { ProfileSkeleton };