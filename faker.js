import connection from "./connection.js";

connection();

const args = process.argv;
let limit = 10; //default
if (args[3]) {
  limit = parseInt(args[3]);
}

const fakerFile = args[2];
const faker = await import(`./faker/${fakerFile}.js`);
faker.run(limit);
