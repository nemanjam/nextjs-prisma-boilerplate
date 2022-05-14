// NOTE: this file must be in javascript, so seed can work in production
// without dev dependencies
// process.env.DATABASE_URL must be defined, not from client, but in schema

const { PrismaClient } = require('@prisma/client');
const { hashSync } = require('bcryptjs');
const { lorem } = require('@faker-js/faker').faker;
const { readdir, unlink } = require('fs');
const { promisify } = require('util');
const { loadEnvConfig } = require('@next/env');
const rootDirAbsolutePath = process.cwd();

// load process.env.DATABASE_URL from .env.local
loadEnvConfig(rootDirAbsolutePath);

// MUST repeat definitions, imports don't work
// separate build context from next app

// lib-client/constants.ts
const Routes = {
  STATIC: {
    AVATARS: '/uploads/avatars/',
    HEADERS: '/uploads/headers/',
  },
};

// /lib-server/constants
// repeated in seed, docker volumes, Dockerfile.prod, folder structure
const avatarsFolderAbsolutePath = `${rootDirAbsolutePath}${Routes.STATIC.AVATARS}`;
const headersFolderAbsolutePath = `${rootDirAbsolutePath}${Routes.STATIC.HEADERS}`;

// /utils
// min, max included
const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// end repeated definitions

const _readdir = promisify(readdir);
const _unlink = promisify(unlink);

const password = hashSync('123456', 10);
const numberOfUsers = 4;
const numberOfPosts = 6;

const createPosts = (n) => {
  return Array.from(Array(n).keys()).map(() => ({
    title: lorem.sentence(),
    content: lorem.paragraphs(getRandomInteger(1, 3)),
    published: true,
  }));
};

const createUsers = (n) => {
  return Array.from(Array(n).keys())
    .reverse()
    .map((index) => ({
      name: `user${index} name`,
      username: `user${index}`,
      email: `user${index}@email.com`,
      // undefined for placeholder, prisma converts it to null
      image: index === 3 ? undefined : `avatar${index % 4}.jpg`, // 0...3
      headerImage: index === 3 ? undefined : `header${index % 4}.jpg`,
      password,
      bio: lorem.sentences(3),
      role: index === 0 ? 'admin' : 'user',
      posts: {
        create: createPosts(numberOfPosts),
      },
    }));
};

const deleteAllAvatars = async () => {
  console.log('Deleting avatars ... ');
  try {
    const files = await _readdir(avatarsFolderAbsolutePath);
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
        _unlink(`${avatarsFolderAbsolutePath}${filename}`);
      }
    });
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

const deleteAllHeaderImages = async () => {
  console.log('Deleting headers ... ');
  try {
    const files = await _readdir(headersFolderAbsolutePath);
    const unlinkPromises = files.map((filename) => {
      if (
        ![
          'placeholder-header.jpg',
          'header0.jpg',
          'header1.jpg',
          'header2.jpg',
          'header3.jpg',
          'header4.jpg',
        ].includes(filename)
      ) {
        console.log('Deleting header: ', filename);
        _unlink(`${headersFolderAbsolutePath}${filename}`);
      }
    });
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

/**
 * class so all functions use same PrismaClient
 * use this as constructor: SeedSingleton.getInstance(prisma)
 */
class SeedSingleton {
  constructor(prisma, isInternalClient) {
    this.isInternalClient = isInternalClient;
    this.prisma = prisma;

    SeedSingleton.instance = this;
  }

  static getInstance(prisma = null) {
    if (!SeedSingleton.instance) {
      const isInternalClient = !prisma;
      const prismaClient = isInternalClient ? new PrismaClient() : prisma;
      SeedSingleton.instance = new SeedSingleton(prismaClient, isInternalClient);
    }
    return SeedSingleton.instance;
  }

  async deleteAllTables() {
    console.log('Deleting tables ...');
    // Promise.all([...]) has bug with sqlite
    // https://github.com/prisma/prisma/issues/9562
    await this.prisma.post.deleteMany();
    await this.prisma.account.deleteMany();
    await this.prisma.session.deleteMany();
    await this.prisma.verificationToken.deleteMany();
    await this.prisma.user.deleteMany();
  }

  // just require file, or fn will be called 2 times
  // without exception handling here
  async seed() {
    console.log('Start seeding ...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    await deleteAllAvatars();
    await deleteAllHeaderImages();
    await this.deleteAllTables();

    const users = createUsers(numberOfUsers);

    for (const data of users) {
      const user = await this.prisma.user.create({ data });
      console.log(`Created user with email: ${user.email}`);
    }
    console.log('Seeding finished.');
  }

  /**
   * error handling only here
   */
  async run() {
    try {
      await this.seed();
    } catch (error) {
      console.error('Seeding error:', error);
      if (this.isInternalClient) {
        process.exit(1);
      }
    } finally {
      if (this.isInternalClient) {
        await this.prisma.$disconnect();
      }
    }
  }
}

module.exports = {
  SeedSingleton,
};
