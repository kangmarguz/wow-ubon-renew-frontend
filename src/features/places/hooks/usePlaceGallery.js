import { useEffect, useState } from "react";

export function usePlaceGallery(images) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  function showPrevious() {
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  }

  function showNext() {
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  }

  function showIndex(index) {
    setCurrentIndex(index);
  }

  return {
    currentIndex,
    showPrevious,
    showNext,
    showIndex
  };
}
