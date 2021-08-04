import { useCallback, useState } from "react";

interface BreadcrumbsData {
  text: string;
  href: string;
  level: number;
  onClick: (item: BreadcrumbsData) => void;
}

export function useBreadcrumbs(
  root: string,
  onClick?: (item: BreadcrumbsData) => void
): {
  breadcrumbs: BreadcrumbsData[];
  addBreadcrumb: (text: string) => void;
  removeBreadcrumbs: (level: number) => void;
} {
  const removeBreadcrumbs = useCallback((level: number) => {
    setBreadcrumbs((b) => b.slice(0, level + 1));
  }, []);
  const onBreadcrumbClick = useCallback(
    (item: BreadcrumbsData) => {
      onClick?.(item);
      removeBreadcrumbs(item.level);
    },
    [onClick, removeBreadcrumbs]
  );

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsData[]>([
    {
      text: root,
      href: "#",
      level: 0,
      onClick: onBreadcrumbClick,
    },
  ]);

  const addBreadcrumb = useCallback(
    (text: string) => {
      setBreadcrumbs((b) => [
        ...b,
        { text, href: "#", level: b.length, onClick: onBreadcrumbClick },
      ]);
    },
    [onBreadcrumbClick]
  );

  return { breadcrumbs, addBreadcrumb, removeBreadcrumbs };
}
