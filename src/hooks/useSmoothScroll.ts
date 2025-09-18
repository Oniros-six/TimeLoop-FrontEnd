import { useCallback } from "react";

export function useSmoothScroll(closeMenu?: () => void) {
    const rems = 5;
    const handleSmoothScroll = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
            e.preventDefault();
            const targetElement = document.getElementById(targetId.replace("#", ""));

            if (targetElement) {
                const offset = (rems * 16); 
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({ top: targetPosition, behavior: "smooth" });
            }

            if (closeMenu) {
                closeMenu();
            }
        },
        [closeMenu]
    );

    return handleSmoothScroll;
}