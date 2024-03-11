import { Faker, faker } from "@faker-js/faker";
import Answer from "../models/Answer.js";
const run = async (limit) => {
  try {
    let data = [];
    for (let i = 0; i < limit; i++) {
      data.push({
        "649fa3043ef8f89e4082a01b": faker.person.fullName(),
        "64a00faf0fcd65c9b78f6db6": faker.helpers.arrayElements([
          "Somay",
          "Somay2 ",
        ]),
        formId: "649fa2e83ef8f89e4082a017",
        userId: "649c3026598ee294465eb026",
        // '64a00faf0fcd65c9b78f6db6':faker.helpers.arrayElements(['Somay','Somay2 ']),
        // radio '64a00faf0fcd65c9b78f6db6':faker.helpers.arrayElement(['Somay','Somay2 ']),
      });
    }
    const fakeData = await Answer.insertMany(data);
    if (fakeData) {
      // console.log(fakeData);
      process.exit();
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
export { run };
