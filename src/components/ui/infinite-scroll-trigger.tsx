import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollTriggerProps {
    onIntersect: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    children?: React.ReactNode;
}

export function InfiniteScrollTrigger({
    onIntersect,
    hasNextPage,
    isFetchingNextPage,
    children
}: InfiniteScrollTriggerProps) {
    const observerRef = useRef<HTMLDivElement>(null);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                onIntersect();
            }
        },
        [onIntersect, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '100px', // Cargar cuando esté a 100px del final
            threshold: 0.1,
        });

        const currentRef = observerRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [handleIntersection]);

    return (
        <div ref={observerRef} className="w-full">
            {children}
            {isFetchingNextPage && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-muted-foreground">
                        Cargando más reservas...
                    </span>
                </div>
            )}
        </div>
    );
}
