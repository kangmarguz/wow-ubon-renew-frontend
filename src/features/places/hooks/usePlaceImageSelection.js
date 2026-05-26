import { useEffect, useMemo, useState } from "react";

export function usePlaceImageSelection() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const previewFiles = useMemo(
    () =>
      selectedFiles.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file)
      })),
    [selectedFiles]
  );

  useEffect(() => {
    return () => {
      previewFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [previewFiles]);

  function setHydratedImages(images) {
    setExistingImages(images);
    setSelectedFiles([]);
  }

  function addFiles(files) {
    setSelectedFiles((currentFiles) => [...currentFiles, ...files]);
  }

  function removeSelectedFile(fileToRemove) {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter(
        (file) => !(file.name === fileToRemove.name && file.lastModified === fileToRemove.lastModified)
      )
    );
  }

  function removeExistingImage(imageIdToRemove) {
    setExistingImages((currentImages) => currentImages.filter((image) => image.id !== imageIdToRemove));
  }

  function resetImages() {
    setSelectedFiles([]);
    setExistingImages([]);
  }

  return {
    selectedFiles,
    existingImages,
    previewFiles,
    setHydratedImages,
    addFiles,
    removeSelectedFile,
    removeExistingImage,
    resetImages
  };
}
