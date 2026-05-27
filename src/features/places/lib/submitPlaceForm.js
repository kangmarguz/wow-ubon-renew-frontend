import { z } from "zod";

export const defaultMapCenter = [15.2448, 104.8472];
export const maxImageCount = 8;
export const defaultDistrict = "เมืองอุบลราชธานี";

export const placeSchema = z.object({
  name: z.string().min(2),
  category: z.enum(["RESTAURANT", "ACCOMMODATION", "ATTRACTION"]),
  district: z.string().min(2),
  address: z.string().min(5),
  phoneNumber: z.string().optional(),
  description: z.string().min(20),
  latitude: z.number(),
  longitude: z.number()
});

export const submitPlaceFieldClassName =
  "w-full rounded-[1.4rem] border border-[#d8cbbd] bg-[#fffdf9] px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-[#9b8d80] focus:border-[#8b6a4f] focus:ring-2 focus:ring-[#e8d8c7]";

export function getDefaultPlaceFormValues() {
  return {
    name: "",
    category: "RESTAURANT",
    district: defaultDistrict,
    address: "",
    phoneNumber: "",
    description: "",
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1]
  };
}

export function getPlaceFormValuesFromDetail(place) {
  return {
    name: place.name,
    category: place.category,
    district: place.district,
    address: place.address,
    phoneNumber: place.phoneNumber || "",
    description: place.description,
    latitude: place.latitude,
    longitude: place.longitude
  };
}

export function createPlaceImagePayload(existingImages, uploadedImages) {
  return [
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
}

export function getSubmitPlacePageCopy(isEditMode) {
  if (isEditMode) {
    return {
      eyebrow: "แก้ไขสถานที่",
      title: "แก้ไขข้อมูลสถานที่ของคุณ",
      description:
        "ปรับข้อมูล รูปภาพ และตำแหน่งบนแผนที่ของรายการเดิมได้จากหน้านี้ หากรายการเคยเผยแพร่แล้ว เมื่อบันทึก ระบบจะส่งกลับเข้าสู่คิวตรวจสอบใหม่ทันที"
    };
  }

  return {
    eyebrow: "เพิ่มสถานที่",
    title: "ส่งสถานที่ใหม่เข้าสู่ระบบ",
    description:
      "กรอกข้อมูลสถานที่ให้ครบเพื่อส่งเข้าตรวจสอบก่อนเผยแพร่บนเว็บไซต์ คุณสามารถเริ่มจากรายละเอียดหลัก รูปภาพ และตำแหน่งบนแผนที่ได้จากหน้านี้"
  };
}

export function getSubmitSuccessMessage(isEditMode, status) {
  if (!isEditMode) {
    return "ส่งสถานที่เข้าสู่ระบบเรียบร้อยแล้ว";
  }

  if (status === "APPROVED") {
    return "บันทึกการแก้ไขแล้ว สถานะถูกเปลี่ยนกลับเป็นรอตรวจสอบ";
  }

  if (status === "REJECTED") {
    return "บันทึกและส่งกลับเข้าตรวจสอบเรียบร้อยแล้ว";
  }

  return "อัปเดตข้อมูลสถานที่เรียบร้อยแล้ว";
}

export function getSubmitButtonLabel(isSubmitting, isEditMode, status) {
  if (isSubmitting) {
    return "กำลังบันทึก...";
  }

  if (!isEditMode) {
    return "ส่งเข้าสู่ระบบเพื่อตรวจสอบ";
  }

  if (status === "REJECTED" || status === "APPROVED") {
    return "บันทึกและส่งกลับเข้าตรวจสอบ";
  }

  return "บันทึกการแก้ไข";
}

export function getSubmitHintContent(isEditMode, status) {
  if (!isEditMode) {
    return "เมื่อส่งแล้ว รายการจะเข้าสู่สถานะรอตรวจสอบก่อนเผยแพร่บนเว็บไซต์";
  }

  if (status === "APPROVED") {
    return "เมื่อบันทึกแล้ว รายการนี้จะกลับสู่สถานะรอตรวจสอบและถูกซ่อนจากหน้าสาธารณะชั่วคราวจนกว่าจะได้รับการอนุมัติใหม่";
  }

  if (status === "REJECTED") {
    return "เมื่อบันทึกแล้ว รายการนี้จะถูกส่งกลับเข้าสู่สถานะรอตรวจสอบทันที";
  }

  return "เมื่อบันทึกแล้ว ระบบจะใช้ข้อมูลและชุดรูปภาพล่าสุดตามที่คุณแก้ไขไว้ในฟอร์มนี้";
}

export function getImageSectionDescription(isEditMode) {
  return isEditMode
    ? "ลบรูปเดิมที่ไม่ต้องการออกได้ และเพิ่มรูปใหม่เข้าไปในชุดเดียวกันก่อนบันทึก"
    : "รองรับหลายรูป เพื่อให้ผู้ใช้เห็นบรรยากาศของสถานที่ได้ชัดขึ้น";
}

export function getFormSectionDescription(isEditMode) {
  return isEditMode
    ? "ตรวจสอบรายละเอียดล่าสุดของรายการนี้แล้วอัปเดตเฉพาะสิ่งที่ต้องการแก้ไขได้ทันที"
    : "กรอกข้อมูลสำคัญให้ครบก่อนส่งตรวจสอบ รายการของคุณจะถูกแอดมินตรวจสอบก่อนเผยแพร่จริง";
}

export function getTipsSectionTitle(isEditMode) {
  return isEditMode ? "คำแนะนำก่อนบันทึก" : "คำแนะนำก่อนส่ง";
}
