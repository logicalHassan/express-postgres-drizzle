export const USER = 'user';
export const ADMIN = 'admin';

export const rolesAllowed = [USER, ADMIN] as const;
export const rightsAllowed = ['create', 'read', 'update', 'delete'] as const;
