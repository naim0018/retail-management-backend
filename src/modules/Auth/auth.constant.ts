export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
} as const;

export const seedUsers = [
  {
    name: 'Super Admin',
    email: 'aziz@gmail.com',
    password: '123456789',
    role: 'admin',
  },
  {
    name: 'General User',
    email: 'user@gmail.com',
    password: '123456789',
    role: 'user',
  },
];
