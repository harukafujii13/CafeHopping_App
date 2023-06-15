import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('hogehoge', 10);
  const user = await prisma.user.upsert({
    where: { email: 'hoge@hoge.com' },
    update: {},
    create: {
      email: 'hoge@hoge.com',
      name: 'hoge',
      password,
    },
  });

  console.log(user);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// npx prisma db push
