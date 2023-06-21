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

//memo1
//Hashing the Password: The hash function from bcryptjs is used to hash the password 'hogehoge'.
//The second argument 10 represents the number of salt rounds for the hash function.

//memo2
//upsert Method: The upsert method is used to either update an existing user record with the specified email
//or create a new user if a matching record doesn't exist.

//The where parameter specifies the condition to find the user by email.
//The update parameter is empty, indicating no updates to be performed on the existing record.
//The create parameter provides the data for creating a new user if no matching record is found.

//memo3
//$disconnect Method: The $disconnect method is used to disconnect the Prisma client from the database.
