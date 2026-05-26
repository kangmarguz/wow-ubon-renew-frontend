import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { fetchMyPlaceDetail } from "../../profile/api/myPlacesApi";
import { createPlace, updatePlace, uploadPlaceImages } from "../api/placesApi";
import { SubmitPlaceActionBar } from "../components/SubmitPlaceActionBar";
import { SubmitPlaceFormFields } from "../components/SubmitPlaceFormFields";
import { SubmitPlaceImageSection } from "../components/SubmitPlaceImageSection";
import { SubmitPlaceMapSection } from "../components/SubmitPlaceMapSection";
import { SubmitPlaceStatusBanner } from "../components/SubmitPlaceStatusBanner";
import { usePlaceImageSelection } from "../hooks/usePlaceImageSelection";
import { usePlaceLocationState } from "../hooks/usePlaceLocationState";
import {
  createPlaceImagePayload,
  getDefaultPlaceFormValues,
  getFormSectionDescription,
  getImageSectionDescription,
  getPlaceFormValuesFromDetail,
  getSubmitButtonLabel,
  getSubmitHintContent,
  getSubmitPlacePageCopy,
  getSubmitSuccessMessage,
  getTipsSectionTitle,
  maxImageCount,
  placeSchema,
  submitPlaceFieldClassName
} from "../lib/submitPlaceForm";

export function SubmitPlacePage() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const isEditMode = Boolean(placeId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageCopy = getSubmitPlacePageCopy(isEditMode);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(placeSchema),
    defaultValues: getDefaultPlaceFormValues()
  });

  const { data: editingPlace, isLoading: isLoadingPlace, isError: isPlaceError, error: placeError } = useQuery({
    queryKey: ["my-place-detail", placeId],
    queryFn: () => fetchMyPlaceDetail(placeId),
    enabled: isEditMode
  });

  const {
    selectedFiles,
    existingImages,
    previewFiles,
    setHydratedImages,
    addFiles,
    removeSelectedFile,
    removeExistingImage,
    resetImages
  } = usePlaceImageSelection();
  const { markerPosition, resetLocationTarget, syncLocation, hydrateLocation, resetLocation, resetLocationState } =
    usePlaceLocationState(setValue);

  const latitude = watch("latitude");
  const longitude = watch("longitude");

  useEffect(() => {
    if (!editingPlace) {
      return;
    }

    reset(getPlaceFormValuesFromDetail(editingPlace));
    setHydratedImages(editingPlace.images || []);
    hydrateLocation({
      lat: editingPlace.latitude,
      lng: editingPlace.longitude
    });
  }, [editingPlace, reset]);

  function handleFileChange(event) {
    const nextFiles = Array.from(event.target.files || []);
    const nextTotalCount = existingImages.length + selectedFiles.length + nextFiles.length;

    if (nextTotalCount > maxImageCount) {
      toast.error(`อัปโหลดรูปได้สูงสุด ${maxImageCount} รูป`);
      event.target.value = "";
      return;
    }

    addFiles(nextFiles);
    event.target.value = "";
  }

  function resetCreateForm() {
    reset(getDefaultPlaceFormValues());
    resetImages();
    resetLocationState();
  }

  async function onSubmit(values) {
    const totalImageCount = existingImages.length + selectedFiles.length;

    if (totalImageCount === 0) {
      toast.error("กรุณาเลือกรูปอย่างน้อย 1 รูป");
      return;
    }

    if (totalImageCount > maxImageCount) {
      toast.error(`อัปโหลดรูปได้สูงสุด ${maxImageCount} รูป`);
      return;
    }

    try {
      setIsSubmitting(true);

      const uploadedImages = selectedFiles.length > 0 ? await uploadPlaceImages(selectedFiles) : [];
      const images = createPlaceImagePayload(existingImages, uploadedImages);

      if (isEditMode) {
        await updatePlace(placeId, {
          ...values,
          images
        });

        toast.success(getSubmitSuccessMessage(true, editingPlace?.status));
        navigate("/my-places");
        return;
      }

      await createPlace({
        ...values,
        images
      });

      toast.success(getSubmitSuccessMessage(false));
      resetCreateForm();
    } catch (error) {
      console.error("submit-place-error", error);
      toast.error(error?.response?.data?.message || "บันทึกข้อมูลสถานที่ไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEditMode && isLoadingPlace) {
    return (
      <div className="rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[#fffaf4] px-6 py-12 text-sm text-[#7c6f63]">
        กำลังโหลดข้อมูลสถานที่สำหรับแก้ไข...
      </div>
    );
  }

  if (isEditMode && isPlaceError) {
    return (
      <div className="space-y-6">
        <div className="rounded-[1.8rem] border border-[#f0c6c6] bg-[#fff5f5] px-6 py-12 text-sm text-[#9a4b4b]">
          {placeError?.response?.data?.message || "ไม่สามารถดึงข้อมูลสถานที่สำหรับแก้ไขได้"}
        </div>
        <Link
          to="/my-places"
          className="inline-flex rounded-full border border-[#d6c7b8] px-4 py-2.5 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
        >
          กลับไปหน้าสถานที่ของฉัน
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow={pageCopy.eyebrow}
        title={pageCopy.title}
        description={pageCopy.description}
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.7rem] leading-tight md:text-[3.6rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      {isEditMode ? <SubmitPlaceStatusBanner status={editingPlace?.status} place={editingPlace} /> : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <SectionCard
          title={isEditMode ? "แก้ไขข้อมูลสถานที่" : "ข้อมูลสถานที่"}
          description={getFormSectionDescription(isEditMode)}
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))] p-0 shadow-[0_28px_80px_rgba(74,55,37,0.08)]"
          headerClassName="border-b border-[#eadfce] px-6 py-6 md:px-8"
          titleClassName="text-[1.9rem] text-[#3f3328]"
          descriptionClassName="max-w-2xl text-[15px] leading-7 text-[#74685e]"
          contentClassName="px-6 py-6 md:px-8 md:py-8"
        >
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <SubmitPlaceFormFields register={register} fieldClassName={submitPlaceFieldClassName} />

            <SubmitPlaceImageSection
              isEditMode={isEditMode}
              placeName={editingPlace?.name}
              description={getImageSectionDescription(isEditMode)}
              existingImages={existingImages}
              previewFiles={previewFiles}
              onFileChange={handleFileChange}
              onRemoveExistingImage={removeExistingImage}
              onRemoveFile={removeSelectedFile}
            />

            <SubmitPlaceActionBar
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
              submitLabel={getSubmitButtonLabel(isSubmitting, isEditMode, editingPlace?.status)}
              submitHint={getSubmitHintContent(isEditMode, editingPlace?.status)}
              backLinkTo="/my-places"
            />
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SubmitPlaceMapSection
            mapKey={`${resetLocationTarget.lat}-${resetLocationTarget.lng}-${isEditMode ? "edit" : "create"}`}
            markerPosition={markerPosition}
            onPickLocation={syncLocation}
            latitude={latitude}
            longitude={longitude}
            onResetLocation={resetLocation}
          />

          <SectionCard
            title={getTipsSectionTitle(isEditMode)}
            className="border-[#eadfce] bg-white/75"
            titleClassName="text-[1.35rem] text-[#3f3328]"
            contentClassName="space-y-3 text-sm leading-7 text-[#726659]"
          >
            <p>ใช้ชื่อสถานที่ที่คนทั่วไปค้นหาเจอจริง เพื่อให้ระบบสร้าง slug และหน้ารายละเอียดได้ชัดเจน</p>
            <p>รูปภาพชุดแรกควรเป็นภาพที่สื่อบรรยากาศโดยรวม เพราะมีโอกาสถูกใช้เป็นภาพหลักของรายการ</p>
            <p>หากข้อมูลที่อยู่อาจยังไม่ครบ ควรอย่างน้อยระบุอำเภอและตำแหน่งหมุดให้แม่นยำ</p>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
