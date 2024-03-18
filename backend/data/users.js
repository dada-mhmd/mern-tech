import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'samir samir',
    email: 'samir@samir.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'dada dada',
    email: 'dada@dada.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
  },
  {
    name: 'admin yser',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
];

export default users;
