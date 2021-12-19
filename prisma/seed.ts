import { PrismaClient, Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import faker from 'faker';
import fs from 'fs';
import { promisify } from 'util';

// npx, not typescript, relative paths
import { getRandomInteger } from '../utils';
import { avatarsFolderAbsolutePath } from '../lib-server/constants';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

const prisma = new PrismaClient();
const password = hashSync('123', 10);
const numberOfUsers = 4;

const createPosts = (n: number) => {
  return Array.from(Array(n).keys()).map(() => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(getRandomInteger(1, 3)),
    published: true,
  }));
};

const createUsers = (n: number): Prisma.UserCreateInput[] => {
  return Array.from(Array(n).keys()).map((index) => ({
    name: `user${index} name`,
    username: `user${index}`,
    email: `user${index}@email.com`,
    image: `avatar${index % 4}.jpg`, // 0...3
    password,
    bio: faker.lorem.sentences(3),
    role: index === 0 ? 'admin' : 'user',
    posts: {
      create: createPosts(getRandomInteger(3, 6)),
    },
  }));
};

const deleteAllAvatars = async () => {
  try {
    const files = await readdir(avatarsFolderAbsolutePath);
    const unlinkPromises = files.map((filename) => {
      if (
        ![
          'placeholder-avatar.jpg',
          'avatar0.jpg',
          'avatar1.jpg',
          'avatar2.jpg',
          'avatar3.jpg',
        ].includes(filename)
      ) {
        console.log('Deleting avatar: ', filename);
        unlink(`${avatarsFolderAbsolutePath}${filename}`);
      }
    });
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

const deleteAllTables = () => {
  console.log('Deleting tables ...');
  return Promise.all([
    prisma.post.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};

async function main() {
  console.log('Start seeding ...');
  await deleteAllTables();
  await deleteAllAvatars();
  const users = createUsers(numberOfUsers);

  for (const data of users) {
    const user = await prisma.user.create({ data });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
