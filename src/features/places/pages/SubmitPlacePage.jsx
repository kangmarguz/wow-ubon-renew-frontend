import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { toast } from "react-toastify";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { ubonDistricts } from "../../../shared/constants/ubonDistricts";
import { createPlace, uploadPlaceImages } from "../api/placesApi";

const placeSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["RESTAURANT", "ACCOMMODATION", "ATTRACTION"]),
  district: z.string().min(2),
  address: z.string().min(5),
  description: z.string().min(20),
  latitude: z.number(),
  longitude: z.number()
});

const defaultMapCenter = [15.2448, 104.8472];

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
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      category: "RESTAURANT",
      district: "เมืองอุบลราชธานี",
      address: "",
      description: "",
      latitude: defaultMapCenter[0],
      longitude: defaultMapCenter[1]
    }
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({
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

  const handlePickLocation = ({ lat, lng }) => {
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
  };

  const handleResetLocation = () => {
    const [lat, lng] = defaultMapCenter;
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
  };

  const onSubmit = async (values) => {
    if (selectedFiles.length === 0) {
      toast.error("กรุณาเลือกรูปอย่างน้อย 1 รูป");
      return;
    }

    try {
      setIsSubmitting(true);
      const uploadedImages = await uploadPlaceImages(selectedFiles);
      await createPlace({
        ...values,
        images: uploadedImages
      });

      toast.success("ส่งสถานที่เข้าสู่ระบบเรียบร้อยแล้ว");
      reset({
        name: "",
        category: "RESTAURANT",
        district: "เมืองอุบลราชธานี",
        address: "",
        description: "",
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1]
      });
      setSelectedFiles([]);
      setMarkerPosition({
        lat: defaultMapCenter[0],
        lng: defaultMapCenter[1]
      });
    } catch (error) {
      console.error("create-place-error", error);
      toast.error(error?.response?.data?.message || "ส่งข้อมูลสถานที่ไม่สำเร็จ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <PageIntro
        eyebrow="เพิ่มสถานที่"
        title="ส่งสถานที่ใหม่เข้าสู่ระบบ"
        description="กรอกข้อมูลสถานที่ให้ครบเพื่อส่งเข้าตรวจสอบก่อนเผยแพร่บนเว็บไซต์ คุณสามารถเริ่มจากรายละเอียดหลัก รูปภาพ และตำแหน่งบนแผนที่ได้จากหน้านี้"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.7rem] leading-tight md:text-[3.6rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_360px]">
        <SectionCard
          title="ข้อมูลสถานที่"
          description="กรอกข้อมูลสำคัญให้ครบก่อนส่งตรวจสอบ รายการของคุณจะถูกแอดมินตรวจสอบก่อนเผยแพร่จริง"
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
                <p className="mt-1 text-sm leading-6 text-[#8a7a6a]">รองรับหลายรูป เพื่อให้ผู้ใช้เห็นบรรยากาศของสถานที่ได้ชัดขึ้น</p>
              </div>

              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[1.8rem] border border-dashed border-[#d7c5b4] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f1e8_100%)] px-6 text-center transition hover:border-[#b39478] hover:bg-[#fffaf4]">
                <div className="rounded-full border border-[#dcc8b6] bg-white px-4 py-2 text-xs tracking-[0.2em] text-[#866c57]">
                  UPLOAD AREA
                </div>
                <div className="mt-5 text-lg font-semibold text-[#4d3d30]">ลากไฟล์มาวางหรือคลิกเพื่อเลือกรูป</div>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#8b7b6d]">ระบบจะแสดงตัวอย่างรูปให้ดูก่อนส่งจริง และคุณสามารถลบรูปที่ไม่ต้องการออกได้</p>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>

              {previewFiles.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-[#5b4a3b]">รูปที่เลือกไว้</div>
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

            <div className="flex flex-col gap-4 border-t border-[#eadfce] pt-6 md:flex-row md:items-center md:justify-between">
              <div className="text-sm leading-6 text-[#7b6f64]">
                เมื่อส่งแล้ว รายการจะเข้าสู่สถานะ <span className="font-semibold text-[#4c3b2d]">รอตรวจสอบ</span> ก่อนเผยแพร่บนเว็บไซต์
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#3f3328] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2f251d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "กำลังส่งข้อมูล..." : "ส่งเข้าสู่ระบบเพื่อตรวจสอบ"}
              </button>
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
                center={defaultMapCenter}
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
                ล้างหมุด
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title="คำแนะนำก่อนส่ง"
            className="border-[#eadfce] bg-white/75"
            titleClassName="text-[1.35rem] text-[#3f3328]"
            contentClassName="space-y-3 text-sm leading-7 text-[#726659]"
          >
            <p>ใช้ชื่อสถานที่ที่คนทั่วไปค้นหาเจอจริง เพื่อให้ระบบสร้าง slug และหน้ารายละเอียดได้ชัดเจน</p>
            <p>รูปภาพชุดแรกควรเป็นภาพที่สื่อบรรยากาศโดยรวม เพราะมีโอกาสถูกใช้เป็นภาพหลักของรายการ</p>
            <p>หากข้อมูลที่อยู่ยังไม่ครบ ควรอย่างน้อยระบุอำเภอและตำแหน่งหมุดให้แม่นยำ</p>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}
