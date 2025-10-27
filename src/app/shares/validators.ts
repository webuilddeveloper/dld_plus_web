import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Custom Validator สำหรับตรวจสอบความถูกต้องของเลขบัตรประชาชนไทย 13 หลัก
 * @param control FormControl ที่ต้องการตรวจสอบ
 * @returns { invalidThaiId: true } หากเลขบัตรไม่ถูกต้อง, หรือ null หากถูกต้อง
 */
export function thaiIdValidator(control: AbstractControl): ValidationErrors | null {
  const id = control.value;

  // ไม่ต้อง validate ถ้าไม่มีค่า (ปล่อยให้ Validators.required จัดการ)
  // หรือถ้าค่าที่กรอกมายังไม่ครบ 13 หลัก
  if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) {
    return null;
  }

  // เริ่มกระบวนการตรวจสอบ checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseFloat(id.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;

  // ถ้าเลขตัวสุดท้ายไม่ตรงกับ checksum ที่คำนวณได้ ให้ return error
  if (checkDigit !== parseFloat(id.charAt(12))) {
    return { invalidThaiId: true }; // key ของ error คือ 'invalidThaiId'
  }

  // ถ้าทุกอย่างถูกต้อง ให้ return null
  return null;
}
