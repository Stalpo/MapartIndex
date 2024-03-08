### How to get it up and running:
1. Run `npm install` to install the project dependencies
2. Run `npx prisma generate` to generate the prisma client source
3. Run `node --env-file .env index.js` to run the web application

## Useful stuff
- [Prisma](https://www.prisma.io/docs/)
- Push schema changes to the database: `npx prisma db push`
- Live view of the database: `npx prisma studio`