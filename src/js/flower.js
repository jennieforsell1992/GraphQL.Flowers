const flowerForm = document.getElementById("formFlowers");

let flowersArray = [];

const graphQlQuery = async (url, query, variables = {}) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const res = await response.json();
  return res.data;
};

const getAllFlowersQuery = `query GetAllFlowers {
  getAllFlowers {
    id
    name
    description
    colour
  }
}`;

const getAllFlowers = async () => {
  const response = await graphQlQuery(
    "http://localhost:4000/graphql",
    getAllFlowersQuery
  );
  console.log(response);

  flowersArray = await response.getAllFlowers;

  createHTML(flowersArray);
};

const getAllFlowersButton = document.getElementById("getFlowers");
getAllFlowersButton.addEventListener("click", async () => {
  getAllFlowers();
});

const deleteFlowerMutation = `mutation Mutation($flowerId: ID!) {
  deleteFlower(flowerId: $flowerId) {
    deletedId
    success
  }
}`;

const deleteFlowerVariables = {
  flowerId: "06b3dc91-9d3e-4df0-8186-dfa80e1deaf1",
};

flowerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const createNewFlower = `mutation ($input: CreateFlowerInput!) {
    createFlower(input: $input) {
      id
      name
      description
      colour
    }
  }`;

  const response = await graphQlQuery(
    "http://localhost:4000/graphql",
    createNewFlower,
    {
      input: {
        name: document.getElementById("inputName").value,
        description: document.getElementById("inputDesc").value,
        colour: document.getElementById("inputColour").value,
      },
    }
  );

  console.log(document.getElementById("inputName").value);

  console.log(response);

  getAllFlowers();
});

const deleteFlower = (id) => {
  console.log(id);
};

const flowerMain = document.getElementById("flowerMain");

const createHTML = (flowers) => {
  flowerMain.innerHTML = "";

  for (let i = 0; i < flowers.length; i++) {
    const flowerContainer = document.createElement("div");
    const flowerDiv = document.createElement("div");
    const flowerName = document.createElement("p");
    const flowerDescription = document.createElement("p");
    const flowerColour = document.createElement("p");
    const flowerButton = document.createElement("button");

    flowerButton.setAttribute("data-flowerid", flowers[i].id);

    flowerButton.addEventListener("click", async (e) => {
      const flowertoDelete = e.currentTarget.dataset.flowerid;

      const response = await graphQlQuery(
        "http://localhost:4000/graphql",
        deleteFlowerMutation,
        {
          flowerId: flowertoDelete,
        }
      );

      const newArray = flowersArray.filter(
        (flower) => flowertoDelete !== flower.id
      );

      flowersArray = newArray;

      createHTML(newArray);
    });

    flowerContainer.classList.add("flowerContainer");
    flowerDiv.classList.add("flower");
    flowerName.classList.add("flower__name");
    flowerDescription.classList.add("flower__desc");
    flowerColour.classList.add("flower__colour");
    flowerButton.classList.add("flower__button");

    flowerName.innerHTML = flowers[i].name;
    flowerDescription.innerHTML = flowers[i].description;
    flowerColour.innerHTML = flowers[i].colour;
    flowerButton.innerHTML = "Ta bort!";

    flowerDiv.appendChild(flowerName);
    flowerDiv.appendChild(flowerDescription);
    flowerDiv.appendChild(flowerColour);
    flowerDiv.appendChild(flowerButton);
    flowerContainer.appendChild(flowerDiv);
    flowerMain.appendChild(flowerContainer);
  }
};

getAllFlowers();
