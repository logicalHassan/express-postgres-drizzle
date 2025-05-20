import { env } from '@/config';
import { hashPassword } from '@/utils/password-hash';
import db, { pool } from './index';
import { users } from './schema';

async function seed() {
  if (env.mode !== 'development') return;

  const data = [
    {
      name: 'Vivi',
      email: 'vmoorman0@utexas.edu',
      password: 'uM5`d_.E37"h7z',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Judye',
      email: 'jbarrick1@studiopress.com',
      password: 'fE8%VGkMjD|yq$_`',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Haley',
      email: 'helders2@bravesites.com',
      password: 'lU1+a0<b7>B',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Gareth',
      email: 'gfunnell3@aol.com',
      password: 'lC4/HT0yN',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Farrel',
      email: 'fthridgould4@comsenz.com',
      password: 'uI3)pCQ?',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Sigfried',
      email: 'ssimonich5@samsung.com',
      password: 'vG0}I5E}"(ZEZr',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Sonya',
      email: 'sdelos6@guardian.co.uk',
      password: 'vK5,4C.FG',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Candie',
      email: 'cdanelet7@furl.net',
      password: 'gT0.q@Ks@bg/',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Hodge',
      email: 'hzute8@disqus.com',
      password: 'mT4|l)W*MI5N\\O7<',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Granthem',
      email: 'gcoldham9@chron.com',
      password: 'fN7$DW2M@FX',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Gus',
      email: 'gsautera@statcounter.com',
      password: 'jI7|hb`|/0k',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Misha',
      email: 'mfrearb@redcross.org',
      password: 'hA8%tvSd*8E',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Marty',
      email: 'mklimkinc@addthis.com',
      password: 'gW8<StRW@,x=DSTC',
      role: 'user',
      isEmailVerified: false,
    },
    {
      name: 'Eolande',
      email: 'egeerd@forbes.com',
      password: 'qH2"\\2,G4fm,8tk',
      role: 'user',
      isEmailVerified: true,
    },
    {
      name: 'Piotr',
      email: 'pnozzoliie@princeton.edu',
      password: 'rJ6\\gq=g3aK7u?$Y',
      role: 'user',
      isEmailVerified: false,
    },
  ];

  const usersData = await Promise.all(
    data.map(async (usr) => {
      const hashedPass = await hashPassword(usr.password);
      return {
        ...usr,
        password: hashedPass,
      };
    }),
  );

  try {
    await db
      .insert(users)
      .values(usersData as (typeof users.$inferInsert)[])
      .onConflictDoNothing(); // ✅ Skips duplicates instead of throwing errors
  } catch (error) {
  } finally {
    await pool.end();
  }
}

seed();
