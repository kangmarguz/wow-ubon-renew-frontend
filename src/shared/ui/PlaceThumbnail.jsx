import { ImageOff } from "lucide-react";

export function PlaceThumbnail({ imageUrl, alt, imageClassName = "", fallbackClassName = "", fallbackLabel = "ไม่มีรูป" }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={alt} className={imageClassName} />;
  }

  return (
    <div className={fallbackClassName}>
      <ImageOff size={18} aria-hidden="true" />
      <span>{fallbackLabel}</span>
    </div>
  );
}
