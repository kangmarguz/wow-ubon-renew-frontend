const statusConfig = {
  REJECTED: {
    label: "REJECTED STATUS",
    className: "border-[#ebc8c8] bg-[linear-gradient(180deg,rgba(255,242,242,0.96),rgba(255,250,250,1))]",
    labelClassName: "text-[#9a4b4b]",
    titleClassName: "text-[#7b3f3f]",
    title: "รายการนี้ถูกปฏิเสธและรอให้คุณแก้ไขข้อมูล",
    description: (place) => place.rejectionReason || "ยังไม่มีข้อความเหตุผลจากระบบ"
  },
  PENDING: {
    label: "PENDING STATUS",
    className: "border-[#eadbb8] bg-[linear-gradient(180deg,rgba(255,248,230,0.95),rgba(255,252,245,1))]",
    labelClassName: "text-[#8a6432]",
    titleClassName: "text-[#8a6432]",
    title: "รายการนี้อยู่ระหว่างการตรวจสอบ",
    description: () => "คุณยังสามารถแก้ไขรายละเอียดได้จนกว่าจะมีการอนุมัติจากแอดมิน"
  },
  APPROVED: {
    label: "APPROVED STATUS",
    className: "border-[#cfe4d4] bg-[linear-gradient(180deg,rgba(238,247,240,0.96),rgba(252,255,252,1))]",
    labelClassName: "text-[#2f6b41]",
    titleClassName: "text-[#2f6b41]",
    title: "รายการนี้เผยแพร่อยู่ในระบบตอนนี้",
    description: () => "เมื่อคุณบันทึกการแก้ไข สถานะจะกลับเป็น รอตรวจสอบ และรายการนี้จะถูกซ่อนจากหน้า public ชั่วคราวจนกว่าจะอนุมัติใหม่"
  }
};

export function SubmitPlaceStatusBanner({ status, place }) {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <div className={`rounded-[1.6rem] border p-5 ${config.className}`}>
      <div className={`text-xs tracking-[0.22em] ${config.labelClassName}`}>{config.label}</div>
      <div className={`mt-2 text-lg font-semibold ${config.titleClassName}`}>{config.title}</div>
      <div className="mt-2 text-sm leading-7 text-[#6f6257]">{config.description(place)}</div>
    </div>
  );
}
