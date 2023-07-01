import { faker } from "@faker-js/faker";
import Answer from "../models/Answer.js";
const run = async () => {
  try {
    let data = [];

    for (let i = 0; i < 15; i++) {
      data.push({
       
        invites: 'faker@gmail.com'
        // '64a00faf0fcd65c9b78f6db6':faker.helpers.arrayElements(['Somay','Somay2 ']),
        // radio '64a00faf0fcd65c9b78f6db6':faker.helpers.arrayElement(['Somay','Somay2 ']),
      });
    }
    Answer.insertMany(data);
  } catch (error) {
    console.log(error);
  }
};
export { run };
