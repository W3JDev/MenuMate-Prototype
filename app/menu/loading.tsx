import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"

export default function Loading() {
  return (
    <>
      <Header title="Menu" />
      <main className="flex-1">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-full flex-shrink-0" />
                ))}
            </div>
          </div>

          <div className="hidden md:block mb-6">
            <Skeleton className="h-40 w-full rounded-ios" />
          </div>

          <div className="space-y-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="ios-card p-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-ios flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </>
  )
}

