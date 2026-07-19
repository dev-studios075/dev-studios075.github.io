import { useEffect, useRef, useState } from "react";

const useInViewport = <T extends Element>(rootMargin = "200px") => {
  const ref = useRef<T>(null);
  const [isInViewport, setIsInViewport] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isInViewport };
};

export default useInViewport;
