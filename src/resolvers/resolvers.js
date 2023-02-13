const { GraphQLError } = require("graphql");
const crypto = require("crypto");
const axios = require("axios").default;

exports.resolvers = {
  Query: {
    getAllFlowers: async (_, args) => {
      let flowers = [];
      try {
        const response = await axios.get(process.env.SHEETDB_URL);

        flowers = response.data;
      } catch (error) {
        return new GraphQLError("That flower does not exist");
      }

      return flowers;
    },
  },

  Mutation: {
    createFlower: async (_, args) => {
      const { name, description, colour, projectId } = args.input;

      const newFlower = {
        id: crypto.randomUUID(),
        name,
        description,
        colour,
        projectId,
      };

      try {
        const endpoint = process.env.SHEETDB_URL;
        const response = await axios.post(
          endpoint,
          {
            data: [newFlower],
          },
          {
            headers: {
              "Accept-Encoding": "gzip,deflate,compress",
            },
          }
        );
      } catch (error) {
        console.error(error);
        return new GraphQLError("Could not create flower...");
      }

      return newFlower;
    },

    deleteFlower: async (_, args) => {
      let endpoint = process.env.SHEETDB_URL;
      let flowerId = args.flowerId;

      try {
        const deleteFlower = `${endpoint}/id/${flowerId}`;
        axios.delete(deleteFlower);
        return {
          deletedId: flowerId,
          success: true,
        };
      } catch (error) {
        return new GraphQLError("Oooops, try again later!");
      }
    },
  },
};
