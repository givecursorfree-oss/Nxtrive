import { useEffect, useState } from "react";

/** Highlights nav item for the section most visible in the viewport */
export function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState("");
  const idsKey = sectionIds.join("|");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const top = visible[0]?.target.id;
        if (top) {
          setActiveId(top);
          return;
        }

        if (window.scrollY < 120) {
          setActiveId("");
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
