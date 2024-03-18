### How to get it up and running:
1. Run `npm install` to install the project dependencies
2. Run `npx prisma generate` to generate the prisma client source
3. Run `node --env-file .env index.js` to run the web application

### .env requirements:
```
DATABASE_URL="mongodb+srv://"
SECRET_KEY="secretkey"
DISCORD_CLIENT_ID="clientid"
DISCORD_CLIENT_SECRET="clientsecret"
```

### Useful stuff
- [Prisma](https://www.prisma.io/docs/)
- Push schema changes to the database: `npx prisma db push`
- Live view of the database: `npx prisma studio`

### Setting up MongoDB (Replica Set)
Prisma requires MongoDB to be in replication mode to enable features such as fault tolerance, data redundancy, and high availability through replica sets.

- Stop the mongodb service
- Edit mongod.conf
```
# replica set options
replication:
  replSetName: myReplicaSet
```
- Start mongodb service
- Run the following command in mongosh
```rs.initiate()```
- Check that replication is applied with this command
```rs.status()```
