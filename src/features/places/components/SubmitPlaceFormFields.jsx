import { ubonDistricts } from "../../../shared/constants/ubonDistricts";

export function SubmitPlaceFormFields({ register, fieldClassName }) {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-[1.4fr_0.8fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-[#5b4a3b]">ชื่อสถานที่</span>
          <input className={fieldClassName} placeholder="เช่น บ้านสวนริมน้ำ" {...register("name")} />
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
    </>
  );
}
