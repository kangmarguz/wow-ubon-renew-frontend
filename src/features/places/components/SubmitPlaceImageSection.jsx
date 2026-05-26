import { maxImageCount } from "../lib/submitPlaceForm";

export function SubmitPlaceImageSection({
  isEditMode,
  placeName,
  description,
  existingImages,
  previewFiles,
  onFileChange,
  onRemoveExistingImage,
  onRemoveFile
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold text-[#5b4a3b]">รูปภาพประกอบ</div>
        <p className="mt-1 text-sm leading-6 text-[#8a7a6a]">{description}</p>
      </div>

      <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e8_100%)] px-6 text-center transition hover:border-[#b39478] hover:bg-[#fffaf4]">
        <div className="rounded-full border border-[#dcc8b6] bg-white px-4 py-2 text-xs tracking-[0.2em] text-[#866c57]">
          UPLOAD AREA
        </div>
        <div className="mt-5 text-lg font-semibold text-[#4d3d30]">ลากไฟล์มาวางหรือคลิกเพื่อเลือกรูป</div>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#8b7b6d]">
          ระบบจะแสดงตัวอย่างรูปให้ดูก่อนบันทึกจริง และคุณสามารถลบรูปที่ไม่ต้องการออกได้
        </p>
        <p className="mt-2 text-xs leading-6 text-[#9a7d64]">อัปโหลดได้สูงสุด {maxImageCount} รูป รูปละไม่เกิน 5 MB</p>
        <input type="file" multiple accept="image/*" className="hidden" onChange={onFileChange} />
      </label>

      {existingImages.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#5b4a3b]">รูปเดิมที่ยังเลือกเก็บไว้</div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {existingImages.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[1.5rem] border border-[#e1d4c6] bg-white shadow-[0_12px_28px_rgba(74,55,37,0.08)]"
              >
                <div className="aspect-[4/3] bg-[#f4ebdf]">
                  <img src={image.url} alt={placeName || "place image"} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <div className="text-sm font-semibold text-[#4d3d30]">รูปเดิมในระบบ</div>
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(image.id)}
                    className="inline-flex rounded-full border border-[#d6c7b8] px-3 py-2 text-xs font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
                  >
                    ลบรูปนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {previewFiles.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#5b4a3b]">รูปใหม่ที่เพิ่มเข้ามา</div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {previewFiles.map(({ key, file, previewUrl }) => (
              <div
                key={key}
                className="overflow-hidden rounded-[1.5rem] border border-[#e1d4c6] bg-white shadow-[0_12px_28px_rgba(74,55,37,0.08)]"
              >
                <div className="aspect-[4/3] bg-[#f4ebdf]">
                  <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <div className="truncate text-sm font-semibold text-[#4d3d30]">{file.name}</div>
                    <div className="mt-1 text-xs text-[#8a7a6a]">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file)}
                    className="inline-flex rounded-full border border-[#d6c7b8] px-3 py-2 text-xs font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
                  >
                    ลบรูปนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
