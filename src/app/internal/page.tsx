
import { InternalDashboard } from "@/components/internal/InternalDashboard";
import { CalculatorProvider } from "@/components/calculator/CalculatorProvider";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalculatorParamsLoader } from "@/components/calculator/CalculatorParamsLoader";

function InternalPageContent() {
    return (
        <CalculatorProvider>
            <CalculatorParamsLoader>
                <InternalDashboard />
            </CalculatorParamsLoader>
        </CalculatorProvider>
    )
}

function LoadingFallback() {
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-10 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </div>
    )
}


export default function InternalPage() {
    return (
        <main className="min-h-screen w-full">
            <Suspense fallback={<LoadingFallback />}>
                <InternalPageContent />
            </Suspense>
        </main>
    )
}
