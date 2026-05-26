import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { toast } from "react-toastify";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { ubonDistricts } from "../../../shared/constants/ubonDistricts";
import { updatePlace, createPlace, uploadPlaceImages } from "../api/placesApi";
import { fetchMyPlaceDetail } from "../../profile/api/myPlacesApi";

const placeSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["RESTAURANT", "ACCOMMODATION", "ATTRACTION"]),
  district: z.string().min(2),
  address: z.string().min(5),
  phoneNumber: z.string().optional(),
  description: z.string().min(20),
  latitude: z.number(),
  longitude: z.number()
});

const defaultMapCenter = [15.2448, 104.8472];
const defaultDistrict = "เมืองอุบลราชธานี";

const placeMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationPicker({ markerPosition, onPick }) {
  useMapEvents({
    click(event) {
      onPick({
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lng.toFixed(6))
      });
    }
  });

  if (!markerPosition) {
    return null;
  }

  return <Marker position={[markerPosition.lat, markerPosition.lng]} icon={placeMarkerIcon} />;
}

export function SubmitPlacePage() {
  const navigate = useNavigate();
  const { placeId } = useParams();
  const isEditMode = Boolean(placeId);
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      category: "RESTAURANT",
      district: defaultDistrict,
      address: "",
      phoneNumber: "",
      description: "",
      latitude: defaultMapCenter[0],
      longitude: defaultMapCenter[1]
    }
  });

  const { data: editingPlace, isLoading: isLoadingPlace, isError: isPlaceError, error: placeError } = useQuery({
    queryKey: ["my-place-detail", placeId],
    queryFn: () => fetchMyPlaceDetail(placeId),
    enabled: isEditMode
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({
    lat: defaultMapCenter[0],
    lng: defaultMapCenter[1]
  });
  const [resetLocationTarget, setResetLocationTarget] = useState({
    lat: defaultMapCenter[0],
    lng: defaultMapCenter[1]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const latitude = watch("latitude");
  const longitude = watch("longitude");

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

  useEffect(() => {
    if (!editingPlace) {
      return;
    }

    reset({
      name: editingPlace.name,
      category: editingPlace.category,
      district: editingPlace.district,
      address: editingPlace.address,
      phoneNumber: editingPlace.phoneNumber || "",
      description: editingPlace.description,
      latitude: editingPlace.latitude,
      longitude: editingPlace.longitude
    });

    setExistingImages(editingPlace.images || []);
    setSelectedFiles([]);
    setMarkerPosition({
      lat: editingPlace.latitude,
      lng: editingPlace.longitude
    });
    setResetLocationTarget({
      lat: editingPlace.latitude,
      lng: editingPlace.longitude
    });
  }, [editingPlace, reset]);

  const fieldClassName =
    "w-full rounded-[1.4rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-[#9b8d80] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]";

  const handleFileChange = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    setSelectedFiles((currentFiles) => [...currentFiles, ...nextFiles]);
    event.target.value = "";
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter(
        (file) => !(file.name === fileToRemove.name && file.lastModified === fileToRemove.lastModified)
      )
    );
  };

  const handleRemoveExistingImage = (imageIdToRemove) => {
    setExistingImages((currentImages) => currentImages.filter((image) => image.id !== imageIdToRemove));
  };

  const handlePickLocation = ({ lat, lng }) => {
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
  };

  const handleResetLocation = () => {
    setMarkerPosition(resetLocationTarget);
    setValue("latitude", resetLocationTarget.lat, { shouldDirty: true });
    setValue("longitude", resetLocationTarget.lng, { shouldDirty: true });
  };

  const handleResetCreateForm = () => {
    reset({
      name: "",
      category: "RESTAURANT",
      district: defaultDistrict,
      address: "",
      phoneNumber: "",
      description: "",
      latitude: defaultMapCenter[0],
      longitude: defaultMapCenter[1]
    });
    setSelectedFiles([]);
    setExistingImages([]);
    setMarkerPosition({
      lat: defaultMapCenter[0],
      lng: defaultMapCenter[1]
    });
    setResetLocationTarget({
      lat: defaultMapCenter[0],
      lng: defaultMapCenter[1]
    });
  };

  const onSubmit = async (values) => {
    const totalImageCount = existingImages.length + selectedFiles.length;

    if (totalImageCount === 0) {
      toast.error("กรุณาเลือกรูปอย่างน้อย 1 รูป");
      return;
    }

    try {
      setIsSubmitting(true);

      const uploadedImages = selectedFiles.length > 0 ? await uploadPlaceImages(selectedFiles) : [];
      const mergedImages = [
        ...existingImages.map((image, index) => ({
          publicId: image.publicId,
          url: image.url,
          order: index
        })),
        ...uploadedImages.map((image, index) => ({
          ...image,
          order: existingImages.length + index
        }))
      ];

      if (isEditMode) {
        await updatePlace(placeId, {
          ...values,
          images: mergedImages
        });

        toast.success(
          editingPlace?.status === "APPROVED"
            ? "บันทึกการแก้ไขแล้ว สถานะถูกเปลี่ยนกลับเป็นรอตรวจสอบ"
            : editingPlace?.status === "REJECTED"
              ? "บันทึกและส่งกลับเข้าตรวจสอบเรียบร้อยแล้ว"
              : "อัปเดตข้อมูลสถานที่เรียบร้อยแล้ว"
        );
        navigate("/my-places");
        return;
      }

      await createPlace({
        ...values,
        images: mergedImages
      });

      toast.success("ส่งสถานที่เข้าสู่ระบบเรียบร้อยแล้ว");
      handleResetCreateForm();
    } catch (error) {
      console.error("submit-place-error", error);
      toast.error(error?.response?.data?.message || "บันทึกข้อมูลสถานที่ไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const pageTitle = isEditMode ? "แก้ไขข้อมูลสถานที่ของคุณ" : "ส่งสถานที่ใหม่เข้าสู่ระบบ";
  const pageDescription = isEditMode
    ? "ปรับข้อมูล รูปภาพ และตำแหน่งบนแผนที่ของรายการเดิมได้จากหน้านี้ ระบบจะบันทึกชุดข้อมูลล่าสุดที่คุณเลือกไว้"
    : "กรอกข้อมูลสถานที่ให้ครบเพื่อส่งเข้าตรวจสอบก่อนเผยแพร่บนเว็บไซต์ คุณสามารถเริ่มจากรายละเอียดหลัก รูปภาพ และตำแหน่งบนแผนที่ได้จากหน้านี้";

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow={isEditMode ? "แก้ไขสถานที่" : "เพิ่มสถานที่"}
        title={pageTitle}
        description={pageDescription}
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.7rem] leading-tight md:text-[3.6rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      {isEditMode && editingPlace?.status === "REJECTED" ? (
        <div className="rounded-[1.6rem] border border-[#ebc8c8] bg-[linear-gradient(180deg,rgba(255,242,242,0.96),rgba(255,250,250,1))] p-5">
          <div className="text-xs tracking-[0.22em] text-[#9a4b4b]">REJECTED STATUS</div>
          <div className="mt-2 text-lg font-semibold text-[#7b3f3f]">รายการนี้ถูกปฏิเสธและรอให้คุณแก้ไขข้อมูล</div>
          <div className="mt-2 text-sm leading-7 text-[#6f6257]">
            {editingPlace.rejectionReason || "ยังไม่มีข้อความเหตุผลจากระบบ"}
          </div>
        </div>
      ) : null}

      {isEditMode && editingPlace?.status === "PENDING" ? (
        <div className="rounded-[1.6rem] border border-[#eadbb8] bg-[linear-gradient(180deg,rgba(255,248,230,0.95),rgba(255,252,245,1))] p-5">
          <div className="text-xs tracking-[0.22em] text-[#8a6432]">PENDING STATUS</div>
          <div className="mt-2 text-lg font-semibold text-[#8a6432]">รายการนี้อยู่ระหว่างการตรวจสอบ</div>
          <div className="mt-2 text-sm leading-7 text-[#6f6257]">
            คุณยังสามารถแก้ไขรายละเอียดได้จนกว่าจะมีการอนุมัติจากแอดมิน
          </div>
        </div>
      ) : null}

      {isEditMode && editingPlace?.status === "APPROVED" ? (
        <div className="rounded-[1.6rem] border border-[#cfe4d4] bg-[linear-gradient(180deg,rgba(238,247,240,0.96),rgba(252,255,252,1))] p-5">
          <div className="text-xs tracking-[0.22em] text-[#2f6b41]">APPROVED STATUS</div>
          <div className="mt-2 text-lg font-semibold text-[#2f6b41]">รายการนี้เผยแพร่อยู่ในระบบตอนนี้</div>
          <div className="mt-2 text-sm leading-7 text-[#6f6257]">
            เมื่อคุณบันทึกการแก้ไข สถานะจะกลับเป็น <span className="font-semibold text-[#2f6b41]">รอตรวจสอบ</span> และรายการนี้จะถูกซ่อนจากหน้า public ชั่วคราวจนกว่าจะอนุมัติใหม่
          </div>
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <SectionCard
          title={isEditMode ? "แก้ไขข้อมูลสถานที่" : "ข้อมูลสถานที่"}
          description={
            isEditMode
              ? "ตรวจสอบรายละเอียดล่าสุดของรายการนี้แล้วอัปเดตเฉพาะสิ่งที่ต้องการแก้ไขได้ทันที"
              : "กรอกข้อมูลสำคัญให้ครบก่อนส่งตรวจสอบ รายการของคุณจะถูกแอดมินตรวจสอบก่อนเผยแพร่จริง"
          }
          className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))] p-0 shadow-[0_28px_80px_rgba(74,55,37,0.08)]"
          headerClassName="border-b border-[#eadfce] px-6 py-6 md:px-8"
          titleClassName="text-[1.9rem] text-[#3f3328]"
          descriptionClassName="max-w-2xl text-[15px] leading-7 text-[#74685e]"
          contentClassName="px-6 py-6 md:px-8 md:py-8"
        >
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-[1.4fr_0.8fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ชื่อสถานที่</span>
                <input className={fieldClassName} placeholder="เช่น บ้านสวนริมมูล" {...register("name")} />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ประเภท</span>
                <select className={fieldClassName} {...register("category")}>
                  <option value="RESTAURANT">ร้านอาหาร</option>
                  <option value="ACCOMMODATION">ที่พัก</option>
                  <option value="ATTRACTION">สถานที่ท่องเที่ยว</option>
                </select>
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">อำเภอ</span>
                <select className={fieldClassName} {...register("district")}>
                  {ubonDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ที่อยู่</span>
                <input className={fieldClassName} placeholder="บ้านเลขที่ ถนน ตำบล" {...register("address")} />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">เบอร์โทรศัพท์</span>
              <input className={fieldClassName} placeholder="เช่น 0812345678" {...register("phoneNumber")} />
              <span className="mt-2 block text-xs leading-6 text-[#8a7a6a]">ไม่บังคับกรอก แต่หากมี ระบบจะบันทึกลงฐานข้อมูลให้</span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">รายละเอียด</span>
              <textarea
                rows="7"
                className={`${fieldClassName} resize-none py-4 leading-7`}
                placeholder="เล่าจุดเด่น บรรยากาศ หรือข้อมูลสำคัญของสถานที่นี้"
                {...register("description")}
              />
            </label>

            <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
            <input type="hidden" {...register("longitude", { valueAsNumber: true })} />

            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-[#5b4a3b]">รูปภาพประกอบ</div>
                <p className="mt-1 text-sm leading-6 text-[#8a7a6a]">
                  {isEditMode
                    ? "ลบรูปเดิมที่ไม่ต้องการออกได้ และเพิ่มรูปใหม่เข้าไปในชุดเดียวกันก่อนบันทึก"
                    : "รองรับหลายรูป เพื่อให้ผู้ใช้เห็นบรรยากาศของสถานที่ได้ชัดขึ้น"}
                </p>
              </div>

              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e8_100%)] px-6 text-center transition hover:border-[#b39478] hover:bg-[#fffaf4]">
                <div className="rounded-full border border-[#dcc8b6] bg-white px-4 py-2 text-xs tracking-[0.2em] text-[#866c57]">
                  UPLOAD AREA
                </div>
                <div className="mt-5 text-lg font-semibold text-[#4d3d30]">ลากไฟล์มาวางหรือคลิกเพื่อเลือกรูป</div>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#8b7b6d]">
                  ระบบจะแสดงตัวอย่างรูปให้ดูก่อนบันทึกจริง และคุณสามารถลบรูปที่ไม่ต้องการออกได้
                </p>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
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
                          <img src={image.url} alt={editingPlace?.name || "place image"} className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="text-sm font-semibold text-[#4d3d30]">รูปเดิมในระบบ</div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(image.id)}
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
                            <div className="mt-1 text-xs text-[#8a7a6a]">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file)}
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

            <div className="space-y-4 rounded-[1.6rem] border border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(250,244,236,0.9))] p-4 md:p-5">
              <div className="rounded-[1.3rem] border border-white/70 bg-white/55 px-4 py-3 text-sm leading-6 text-[#7b6f64]">
                {isEditMode
                  ? editingPlace?.status === "APPROVED"
                    ? <>เมื่อบันทึกแล้ว ระบบจะใช้ข้อมูลล่าสุดของคุณและเปลี่ยนสถานะรายการกลับเป็น <span className="font-semibold text-[#4c3b2d]">รอตรวจสอบ</span></>
                    : editingPlace?.status === "REJECTED"
                      ? <>เมื่อบันทึกแล้ว รายการนี้จะถูกส่งกลับเข้าสถานะ <span className="font-semibold text-[#4c3b2d]">รอตรวจสอบ</span> ทันที</>
                      : "เมื่อบันทึกแล้ว ระบบจะใช้ข้อมูลและชุดรูปภาพล่าสุดตามที่คุณแก้ไขไว้ในฟอร์มนี้"
                  : <>เมื่อส่งแล้ว รายการจะเข้าสู่สถานะ <span className="font-semibold text-[#4c3b2d]">รอตรวจสอบ</span> ก่อนเผยแพร่บนเว็บไซต์</>}
              </div>

              <div className="rounded-[1.35rem] border border-[#e3d6c8] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(74,55,37,0.06)]">
                <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                  {isEditMode ? (
                    <Link
                      to="/my-places"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#d7c5b4] bg-white/90 px-5 py-3 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:bg-white hover:text-[#4c3b2d]"
                    >
                      ย้อนกลับ
                    </Link>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[48px] min-w-[220px] items-center justify-center rounded-full bg-[#3f3328] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(63,51,40,0.14)] transition hover:bg-[#2f251d] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "กำลังบันทึก..."
                      : isEditMode
                        ? editingPlace?.status === "REJECTED"
                          ? "บันทึกและส่งกลับเข้าตรวจสอบ"
                          : "บันทึกการแก้ไข"
                        : "ส่งเข้าสู่ระบบเพื่อตรวจสอบ"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="ตำแหน่งบนแผนที่"
            description="คลิกเพื่อปักหมุดตำแหน่งจริงของสถานที่ แล้วเก็บค่าพิกัดไว้ส่งพร้อมฟอร์ม"
            className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,239,229,0.95))] shadow-[0_24px_70px_rgba(74,55,37,0.06)]"
            titleClassName="text-[1.6rem] text-[#3f3328]"
            descriptionClassName="text-[14px] leading-7 text-[#74685e]"
            contentClassName="space-y-4"
          >
            <div className="overflow-hidden rounded-[1.8rem] border border-[#d7c5b4]">
              <MapContainer
                key={`${resetLocationTarget.lat}-${resetLocationTarget.lng}-${isEditMode ? "edit" : "create"}`}
                center={[markerPosition.lat, markerPosition.lng]}
                zoom={11}
                scrollWheelZoom
                className="h-[420px] w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker markerPosition={markerPosition} onPick={handlePickLocation} />
              </MapContainer>
            </div>

            <div className="rounded-[1.4rem] border border-[#e2d5c7] bg-white/70 p-4">
              <div className="text-xs tracking-[0.22em] text-[#9a836d]">LOCATION STATUS</div>
              <div className="mt-2 space-y-1 text-sm leading-6 text-[#6f6257]">
                <div>Latitude: {Number(latitude).toFixed(6)}</div>
                <div>Longitude: {Number(longitude).toFixed(6)}</div>
              </div>
              <button
                type="button"
                onClick={handleResetLocation}
                className="mt-4 inline-flex rounded-full border border-[#d6c7b8] px-4 py-2 text-xs font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
              >
                รีเซ็ตตำแหน่ง
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title={isEditMode ? "คำแนะนำก่อนบันทึก" : "คำแนะนำก่อนส่ง"}
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
