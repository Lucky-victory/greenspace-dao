import { useEffect, useState } from "react";

export const useResize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: NaN,
    height: NaN,
  });
  const isMobileSize = windowSize?.width < 560;
  const isTabletSize = windowSize?.width > 560 && windowSize?.width <= 960;

  useEffect(() => {
    // Function to update window size
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial window size update
    updateWindowSize();

    // Event listener to update window size on resize
    window.addEventListener("resize", updateWindowSize);

    // Clean-up function to remove event listener
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []); // Run only once on component mount

  return { ...windowSize, isMobileSize, isTabletSize };
};
