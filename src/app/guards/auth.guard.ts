import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // อ่าน role ที่อนุญาตจาก route.data
  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // ✅ ถ้ามี token และ role ถูกต้อง
  // if (token && (!allowedRoles || allowedRoles.includes(role || ''))) {
  if (!allowedRoles || allowedRoles.includes(role || '')) {

    return true;
  }

  // ❌ ไม่มีสิทธิ์ หรือไม่ได้ login → เด้งกลับหน้า login
  router.navigate(['/login-member']);
  return false;
};
