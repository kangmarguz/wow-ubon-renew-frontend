import { useEffect, useState, useTransition } from "react";
import { useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ImageOff, MapPinned, Search, SlidersHorizontal, Sparkles, Star, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PageIntro } from "../../../shared/ui/PageIntro";
import { SectionCard } from "../../../shared/ui/SectionCard";
import { StateNotice } from "../../../shared/ui/StateNotice";
import { ubonDistricts } from "../../../shared/constants/ubonDistricts";
import { getPlaceCategoryLabel, placeCategories } from "../../../shared/constants/placeCategories";
import { fetchPlaces } from "../api/publicPlacesApi";

const sortOptions = [
  { value: "rating", label: "คะแนนสูงสุด" },
  { value: "latest", label: "ใหม่ล่าสุด" },
  { value: "reviews", label: "รีวิวมากสุด" },
  { value: "oldest", label: "เก่าสุด" }
];

export function PlacesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const deferredSearchValue = useDeferredValue(searchValue);

  const category = searchParams.get("category") || "";
  const district = searchParams.get("district") || "";
  const sort = searchParams.get("sort") || "rating";

  useEffect(() => {
    startTransition(() => {
      const nextSearchParams = new URLSearchParams(searchParams);

      if (deferredSearchValue.trim()) {
        nextSearchParams.set("search", deferredSearchValue.trim());
      } else {
        nextSearchParams.delete("search");
      }

      setSearchParams(nextSearchParams, { replace: true });
    });
  }, [deferredSearchValue]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["places", { category, district, sort, search: searchParams.get("search") || "" }],
    queryFn: () =>
      fetchPlaces({
        ...(category ? { category } : {}),
        ...(district ? { district } : {}),
        ...(searchParams.get("search") ? { search: searchParams.get("search") } : {}),
        sort
      })
  });

  const handleFilterChange = (key, value) => {
    startTransition(() => {
      const nextSearchParams = new URLSearchParams(searchParams);

      if (value) {
        nextSearchParams.set(key, value);
      } else {
        nextSearchParams.delete(key);
      }

      setSearchParams(nextSearchParams, { replace: true });
    });
  };

  const handleClearFilters = () => {
    setSearchValue("");
    startTransition(() => {
      setSearchParams(new URLSearchParams(), { replace: true });
    });
  };

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="สถานที่ทั้งหมด"
        title="ค้นหาร้านอาหาร ที่พัก และที่เที่ยวในอุบลฯ"
        description="หน้านี้ดึงข้อมูลจากฐานข้อมูลจริงแล้ว คุณสามารถค้นหาด้วยชื่อ กรองตามประเภท และกรองตามอำเภอได้ โดยหน้า list จะเน้นการตัดสินใจจากข้อมูลและรูปก่อน"
        className="max-w-4xl"
        eyebrowClassName="tracking-[0.28em]"
        titleClassName="text-[2.5rem] leading-tight md:text-[3.2rem]"
        descriptionClassName="max-w-2xl text-[15px] leading-8 text-[#6d6258]"
      />

      <SectionCard
        title="ค้นหาและตัวกรอง"
        description="ค้นหาจากชื่อสถานที่ หรือกรองตามประเภทและอำเภอเพื่อเจอรายการที่ต้องการเร็วขึ้น"
        className="border-[#eadfce] bg-white/80"
        titleClassName="text-[1.6rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <label className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a59384]"
              aria-hidden="true"
            />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
              placeholder="ค้นหาด้วยชื่อสถานที่"
            />
          </label>

          <label className="relative block">
            <Sparkles
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a59384]"
              aria-hidden="true"
            />
            <select
              value={category}
              onChange={(event) => handleFilterChange("category", event.target.value)}
              className="w-full appearance-none rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
            >
              {placeCategories.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="relative block">
            <MapPinned
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a59384]"
              aria-hidden="true"
            />
            <select
              value={district}
              onChange={(event) => handleFilterChange("district", event.target.value)}
              className="w-full appearance-none rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
            >
              <option value="">ทุกอำเภอ</option>
              {ubonDistricts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="relative block">
            <SlidersHorizontal
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a59384]"
              aria-hidden="true"
            />
            <select
              value={sort}
              onChange={(event) => handleFilterChange("sort", event.target.value)}
              className="w-full appearance-none rounded-[1.2rem] border border-[#d8cbbd] bg-[#fffdf9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 rounded-full border border-[#d6c7b8] bg-white px-4 py-2 text-sm font-semibold text-[#6f5e4f] transition hover:border-[#b08c6f] hover:text-[#4c3b2d]"
          >
            <X size={16} aria-hidden="true" />
            ล้างตัวกรอง
          </button>
        </div>
      </SectionCard>

      <SectionCard
        title="รายการสถานที่"
        description="แสดงเฉพาะรายการที่ผ่านการอนุมัติแล้ว"
        className="border-[#eadfce] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(250,244,236,0.94))]"
        titleClassName="text-[1.75rem] text-[#3f3328]"
        descriptionClassName="text-[14px] leading-7 text-[#74685e]"
        contentClassName="space-y-5"
      >
        {isLoading || isPending ? <StateNotice>กำลังโหลดรายการสถานที่...</StateNotice> : null}

        {isError ? <StateNotice tone="error">{error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสถานที่ได้"}</StateNotice> : null}

        {!isLoading && !isError && data?.items?.length === 0 ? (
          <StateNotice>ยังไม่พบสถานที่ที่ตรงกับเงื่อนไขที่เลือก</StateNotice>
        ) : null}

        {!isLoading && !isError && data?.items?.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((place) => (
                <Link
                  key={place.id}
                  to={`/places/${place.slug}`}
                  className="group overflow-hidden rounded-[1.8rem] border border-[#e2d5c7] bg-white shadow-[0_14px_34px_rgba(74,55,37,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_40px_rgba(74,55,37,0.12)]"
                >
                  <div className="aspect-[4/3] bg-[#f4ebdf]">
                    {place.coverImage ? (
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-[#8a7a6a]">
                        <ImageOff size={20} aria-hidden="true" />
                        <span>ไม่มีรูปภาพประกอบ</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <div className="text-xs tracking-[0.22em] text-[#a06840]">{getPlaceCategoryLabel(place.category)}</div>
                      <h3 className="text-xl font-semibold leading-snug text-[#3f3328]">{place.name}</h3>
                      <p className="inline-flex items-center gap-1.5 text-sm text-[#7a6d61]">
                        <MapPinned size={14} aria-hidden="true" />
                        {place.district}
                        {place.province ? `, ${place.province}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[#6f6257]">
                      <span className="inline-flex items-center gap-1.5">
                        <Star size={14} className="text-[#a06840]" aria-hidden="true" />
                        คะแนน {Number(place.averageRating || 0).toFixed(1)}
                      </span>
                      <span>{place.reviewCount || 0} รีวิว</span>
                    </div>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b5340] transition group-hover:text-[#3f3328]">
                      ดูรายละเอียด
                      <ArrowRight size={16} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-sm text-[#7a6d61]">พบทั้งหมด {data.pagination?.total || data.items.length} รายการ</div>
          </>
        ) : null}
      </SectionCard>
    </div>
  );
}
