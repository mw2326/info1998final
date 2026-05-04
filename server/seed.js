require('dotenv').config();
const { db, auth } = require('./firebase');

const ADMIN_EMAIL = 'admin@ithacaserves.com';
const ADMIN_PASSWORD = 'Admin1234!';
const ADMIN_NAME = 'IthacaServes Admin';

const opportunities = [
  {
    title: 'Food Bank Volunteer',
    organization: 'Ithaca Food Bank',
    description: 'Help sort and distribute food donations to families in need. No experience required — just bring a positive attitude and willingness to help.',
    category: 'Food & Hunger',
    location: 'Ithaca, NY',
    date: '2026-04-18',
    spots: 15,
  },
  {
    title: 'Habitat for Humanity Build Day',
    organization: 'Habitat for Humanity of Tompkins & Cortland Counties',
    description: 'Join us for a Saturday build day. Help construct affordable housing for local families. Training provided on-site.',
    category: 'Housing',
    location: 'Ithaca, NY',
    date: '2026-04-25',
    spots: 20,
  },
  {
    title: 'Youth Tutoring Program',
    organization: 'Southside Community Center',
    description: 'Tutor K–8 students in math and reading after school. Commit to at least one afternoon per week.',
    category: 'Education',
    location: 'Southside Community Center, Ithaca',
    date: '2026-04-14',
    spots: 8,
  },
  {
    title: 'Hospital Shadowing — Patient Services',
    organization: 'Cayuga Medical Center',
    description: 'Shadow patient services staff and assist with non-clinical support tasks. Great for pre-med and public health students.',
    category: 'Healthcare',
    location: 'Cayuga Medical Center, Ithaca',
    date: '2026-04-21',
    spots: 5,
  },
  {
    title: 'Ithaca Farmers Market Setup',
    organization: 'Ithaca Farmers Market',
    description: 'Help vendors set up booths and assist shoppers at the Saturday market. Shifts from 8am–12pm.',
    category: 'Community',
    location: 'Steamboat Landing, Ithaca',
    date: '2026-04-19',
    spots: 12,
  },
  {
    title: 'Environmental Trail Cleanup',
    organization: 'Finger Lakes Land Trust',
    description: 'Spend a morning cleaning up trails at a local nature preserve. Gloves and bags provided.',
    category: 'Environment',
    location: 'Six Mile Creek Preserve, Ithaca',
    date: '2026-04-26',
    spots: 25,
  },
  {
    title: 'Animal Shelter Assistant',
    organization: 'Tompkins County SPCA',
    description: 'Walk dogs, socialize cats, and assist shelter staff. Must complete a brief orientation before first shift.',
    category: 'Animals',
    location: 'SPCA of Tompkins County, Ithaca',
    date: '2026-05-03',
    spots: 6,
  },
  {
    title: 'Refugee Resettlement Support',
    organization: 'Catholic Charities of Tompkins/Tioga',
    description: 'Help newly arrived refugee families with daily tasks — shopping, navigating services, and English conversation practice.',
    category: 'Social Services',
    location: 'Ithaca, NY',
    date: '2026-04-16',
    spots: 4,
  },
];

async function seed() {
  console.log('Seeding database...');

  // Create or find admin user in Firebase Auth
  let adminUser;
  try {
    adminUser = await auth.getUserByEmail(ADMIN_EMAIL);
    console.log('Admin user already exists in Firebase Auth');
  } catch {
    adminUser = await auth.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      displayName: ADMIN_NAME,
    });
    console.log('Created admin user in Firebase Auth');
  }

  // Write admin user doc to Firestore with role='admin'
  await db.collection('users').doc(adminUser.uid).set({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });
  console.log('Admin user doc written to Firestore');

  // Seed opportunities if none exist
  const existing = await db.collection('opportunities').limit(1).get();
  if (existing.empty) {
    for (const opp of opportunities) {
      await db.collection('opportunities').add({
        ...opp,
        createdAt: new Date().toISOString(),
        createdBy: adminUser.uid,
      });
    }
    console.log(`Seeded ${opportunities.length} opportunities`);
  } else {
    console.log('Opportunities already exist, skipping');
  }

  console.log('\nDone! Admin credentials:');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
