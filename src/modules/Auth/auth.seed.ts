import { seedUsers } from './auth.constant';
import { User } from './auth.model';

export const seedAdmin = async () => {
  for (const seedUser of seedUsers) {
    const isUserExist = await User.findOne({ email: seedUser.email });
    if (!isUserExist) {
        // user.create will trigger pre-save hook for password hash
      await User.create(seedUser);
    }
  }
};
