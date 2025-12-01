/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

const main = async () => {
  await prismaClient.$transaction(async (tx: any) => {
    await tx.restaurant.deleteMany();
    const restaurant = await tx.restaurant.create({
      data: {
        name: "FSW Donalds",
        slug: "fsw-donalds",
        description: "The best fast food in the world",
        avatarImageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQvcNP9rHlEJu1vCY5kLqzjf29HKaeN78Z6pRy",
        coverImageUrl:
          "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQac8bHYlkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
      },
    });
    const combosCategory = await tx.menuCategory.create({
      data: {
        name: "Combos",
        restaurantId: restaurant.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Medium Big Mac Double Combo",
          description:
            "Four hamburgers (100% beef), American lettuce, cheddar cheese slices, special sauce, onion, pickles and sesame seed bun, side and drink.",
          price: 39.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQaHB8tslkBUjlHSKiuseLm2hIFzVY0OtxEPnw",
          menuCategoryId: combosCategory.id,
          restaurantId: restaurant.id,
          ingredients: [
            "Sesame seed bun",
            "100% beef hamburger",
            "American lettuce",
            "Cheddar cheese slices",
            "Special sauce",
            "Onion",
            "Pickles",
          ],
        },
        {
          name: "New Awesome Melt Onion Rings",
          description:
            "Two 100% beef hamburgers, special sauce, exclusive special mayonnaise with smoked meat flavor, onion rings, bacon slices, processed cheddar cheese, delicious dairy sauce with cheddar cheese all on a brioche bun bringing an explosion of flavors to your glorious days! Side and Drink.",
          price: 41.5,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQeGQofnEPyQaHEV2WL8rGUs41oMICtYfNkphl",
          menuCategoryId: combosCategory.id,
          restaurantId: restaurant.id,
          ingredients: [
            "Brioche bun",
            "100% beef hamburger",
            "Special sauce",
            "Special mayonnaise with smoked meat flavor",
            "Onion rings",
            "Bacon slices",
            "Processed cheddar cheese",
            "Dairy sauce with cheddar cheese",
          ],
        },
        {
          name: "McCrispy Chicken Elite",
          description:
            "Made with brioche bun with potato, Honey&Fire sauce, sliced bacon, lettuce, tomato, cheddar cheese and 100% chicken breast, seasoned and breaded, side and drink.",
          price: 39.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQr12aTqPo3SsGjBJCaM7yhxnbDlXeL5N9dckv",
          menuCategoryId: combosCategory.id,
          restaurantId: restaurant.id,
          ingredients: [
            "Brioche bun",
            "Potato",
            "Honey&Fire sauce",
            "Sliced bacon",
            "Lettuce",
            "Tomato",
            "Cheddar cheese",
            "100% chicken breast",
          ],
        },
        {
          name: "Double Cheddar McMelt",
          description:
            "Two hamburgers (100% beef), dairy sauce with cheddar cheese, onion with soy sauce and dark sesame bun, side and drink.",
          price: 36.2,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQWdq0w8niS9XCLQu7Nb4jvBYZze16goaOqsKR",
          menuCategoryId: combosCategory.id,
          restaurantId: restaurant.id,
          ingredients: [
            "Dark sesame bun",
            "100% beef hamburger",
            "Dairy sauce with cheddar cheese",
            "Onion with soy sauce",
          ],
        },
      ],
    });
    const hamburguersCategory = await tx.menuCategory.create({
      data: {
        name: "Burgers",
        restaurantId: restaurant.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Big Mac",
          description:
            "Four hamburgers (100% beef), American lettuce, cheddar cheese slices, special sauce, onion, pickles and sesame seed bun, side and drink.",
          ingredients: [
            "Sesame seed bun",
            "100% beef hamburger",
            "American lettuce",
            "Cheddar cheese slices",
            "Special sauce",
            "Onion",
            "Pickles",
          ],
          price: 39.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQKfI6fivqActTvBGLXfQe4a8CJ6d3HiR7USPK",
          menuCategoryId: hamburguersCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Double Quarter Pounder",
          description:
            "Two 100% beef hamburgers, special sauce, exclusive special mayonnaise with smoked meat flavor, onion rings, bacon slices, processed cheddar cheese, delicious dairy sauce with cheddar cheese all on a brioche bun bringing an explosion of flavors to your glorious days! Side and Drink.",
          ingredients: [
            "Brioche bun",
            "100% beef hamburger",
            "Special sauce",
            "Special mayonnaise with smoked meat flavor",
            "Onion rings",
            "Bacon slices",
            "Processed cheddar cheese",
            "Dairy sauce with cheddar cheese",
          ],
          price: 41.5,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ99rtECuYaDgmA4VujBU0wKn2ThXJvF3LHfyc",
          menuCategoryId: hamburguersCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "McMelt",
          description:
            "Made with brioche bun with potato, Honey&Fire sauce, sliced bacon, lettuce, tomato, cheddar cheese and 100% chicken breast, seasoned and breaded, side and drink.",
          ingredients: [
            "Brioche bun",
            "Potato",
            "Honey&Fire sauce",
            "Sliced bacon",
            "Lettuce",
            "Tomato",
            "Cheddar cheese",
            "100% chicken breast",
          ],
          price: 39.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQUY0VlDTmvPeJLoyOjzNsMqFdxUI423nBl6br",
          menuCategoryId: hamburguersCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "McAwesome Bacon",
          description:
            "Two hamburgers (100% beef), dairy sauce with cheddar cheese, onion with soy sauce and dark sesame bun, side and drink.",
          ingredients: [
            "Dark sesame bun",
            "100% beef hamburger",
            "Dairy sauce with cheddar cheese",
            "Onion with soy sauce",
          ],
          price: 36.2,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBBmifbjzEVXRoycAtrP9vH45bZ6WDl3QF0a1",
          menuCategoryId: hamburguersCategory.id,
          restaurantId: restaurant.id,
        },
      ],
    });
    const frenchFriesCategory = await tx.menuCategory.create({
      data: {
        name: "Fries",
        restaurantId: restaurant.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Large Fries",
          description: "Crispy and golden french fries. Comes in a large portion!",
          ingredients: [],
          price: 10.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQNd3jSNrcJroaszwjUAlM6iSO5ZTx2HV70t31",
          menuCategoryId: frenchFriesCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Medium Fries",
          description:
            "Crispy and golden french fries. Comes in a medium portion!",
          ingredients: [],
          price: 9.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ7Y6lv9tkc0L9oMIXZsFJtwnBh2KCz3y6uSW1",
          menuCategoryId: frenchFriesCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Small Fries",
          description:
            "Crispy and golden french fries. Comes in a small portion (good for your diet)!",
          ingredients: [],
          price: 5.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ5toOZxYa1oARJCUGh4EY3x8NjXHtvZ7lnVfw",
          menuCategoryId: frenchFriesCategory.id,
          restaurantId: restaurant.id,
        },
      ],
    });
    const drinksCategory = await tx.menuCategory.create({
      data: {
        name: "Drinks",
        restaurantId: restaurant.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Coca-cola",
          description: "Ice-cold Coca-cola to accompany your meal.",
          ingredients: [],
          price: 5.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQJS1b33q29eEsh0CVmOywrqx1UPnJpRGcHN5v",
          menuCategoryId: drinksCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Fanta Orange",
          description: "Ice-cold Fanta Orange to accompany your meal.",
          ingredients: [],
          price: 5.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQW7Kxm9gniS9XCLQu7Nb4jvBYZze16goaOqsK",
          menuCategoryId: drinksCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Mineral Water",
          description: "Cristiano Ronaldo's favorite drink.",
          ingredients: [],
          price: 2.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ7i05S5tkc0L9oMIXZsFJtwnBh2KCz3y6uSW1",
          menuCategoryId: drinksCategory.id,
          restaurantId: restaurant.id,
        },
      ],
    });
    const desertsCategory = await tx.menuCategory.create({
      data: {
        name: "Desserts",
        restaurantId: restaurant.id,
      },
    });
    await tx.product.createMany({
      data: [
        {
          name: "Vanilla Cone",
          description: "Ice cream cone with vanilla flavor.",
          ingredients: [],
          price: 3.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQtfuQrAKkI75oJfPT0crZxvX82ui9qV3hLFdY",
          menuCategoryId: desertsCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Chocolate Cone",
          description: "Ice cream cone with chocolate flavor.",
          ingredients: [],
          price: 3.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQBH21ijzEVXRoycAtrP9vH45bZ6WDl3QF0a1M",
          menuCategoryId: desertsCategory.id,
          restaurantId: restaurant.id,
        },
        {
          name: "Mixed Cone",
          description: "Ice cream cone with vanilla and chocolate flavor.",
          ingredients: [],
          price: 2.9,
          imageUrl:
            "https://u9a6wmr3as.ufs.sh/f/jppBrbk0cChQ4rBrtULypXmR6JiWuhzS8ALjVkrF3yfatC7E",
          menuCategoryId: desertsCategory.id,
          restaurantId: restaurant.id,
        },
      ],
    });
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });