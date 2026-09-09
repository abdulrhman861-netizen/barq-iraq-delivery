import { SECURITY_DEFAULT_PERMISSIONS } from '../constants/security';

export const hasPermission = (role, permission) => {
  const permissions = SECURITY_DEFAULT_PERMISSIONS[role] || [];
  return permissions.includes('*') || permissions.includes(permission);
};

export const getRolePermissions = (role) => SECURITY_DEFAULT_PERMISSIONS[role] || [];
