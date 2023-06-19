// TODO - Now its your turn to make the working example! :)
//build a recipe from things in your fridge
//Type each individual ingredients in natural language (without quantity). Separate each ingredient with a comma.
//Output to console is an array of 2 objects that has property number(type number - base 1) and recipe(type string)
/*Example: Input: "eggs,butter".Output: "[
  {
    number: 1,
    recipe: 'Divide sausage into 8 portions. On a lightly crumb sprinkled surface, pat out each portion to about 1/8 inch thickness. Wrap 1 sausage portion completely around 1 hard boiled egg, pressing edges together to seal. Repeat with remaining sausage and hard boiled eggs.Dip sausage-covered eggs in 1 beaten egg and then roll in breadcrumbs.Deep fry or place on baking sheet and bake in a 375 degree oven for 20 minutes until lightly browned.'
  },
  {
    number: 2,
    recipe: 'Heat up the grill to 350 degrees..Slice the sweet potatoes into 1" rounds..Spray both sides of the sweet potatoes with butter and sprinkle with cinnamon..Place foil over the grilling grates and place the sweet potatoes directly onto the foil..Spray the sweet potatoes again with a little butter. (To keep the potatoes from sticking to the foil).Close the grill lid and cook for about 30 minutes. Make sure to turn and flip the sweet potatoes every 10 minutes and add additional sprays of butter to keep from sticking.'
  }
]"*/
import { fetchJSON } from "../include/fetchJSON.js";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { URL } from "url";
import fs from "fs";
import moment from "moment";


interface missedIngredient {
  id: number;
  amount: number;
  unit: string;
  unitLong: string;
  unitShort: string;
  aisle: string;
  name: string;
  original: string;
  originalName: string;
  meta: string[];
  image: string;
}

interface recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: missedIngredient[];
  usedIngredients: missedIngredient[];
  unusedIngredients: missedIngredient[];
  likes: number;
}

interface equipments {
  id: number;
  image: string;
  name: string;
  temperature: {
    number: number;
    unit: string;
  };
}
interface ingredient {
  id: number;
  image: string;
  name: string;
}
interface instruction {
  equipment: equipments[];
  ingredients: ingredient[];
  number: number;
  step: string;
}

const rl = readline.createInterface({ input, output });
const answer = await rl.question("What is in your fridge?");
const spoonacularKey: string = `a555c17d0cef4a9880109f48bb30d808`;

async function generateRecipe(food: string): Promise<number[] | any[]> {
  const searchURL = new URL(`https://api.spoonacular.com/recipes/findByIngredients`);
  searchURL.searchParams.append("apiKey", spoonacularKey);
  searchURL.searchParams.append("ingredients", food);
  searchURL.searchParams.append("number", "5");
  searchURL.searchParams.append("ranking", "2");
  const resURL = searchURL.toString().replaceAll("%2C", ",+");
  console.log(resURL);
  const idRecipes = await fetchJSON(resURL)
    .then((json: recipe[]) => {
      if (json.length > 0) {
        return json.map(obj => obj.id);
      } else {
        throw new Error("No recipes found.");
      }
    })
    .catch((error: Error) => {
      console.log(error.message);
      return [];
    });
  return idRecipes;
}
async function getDetailedRecipe(id: number) {
  const searchURL = new URL(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions`);
  searchURL.searchParams.append("apiKey", spoonacularKey);
  console.log(searchURL.toString());
  const detailedRecipe: string = await fetchJSON(searchURL.toString())
    .then(json => {
      if (json.length > 0) {
        const steps = json[0].steps;
        const instructions: string[] = [];
        steps.forEach((instr: instruction) => instructions.push(instr.step));
        return instructions.join(`.`);
      } else {
        throw new Error(`Recipe does not exist`);
      }
    })
    .catch((error: Error) => {
      console.log(error.message);
      return error.message;
    });
  return detailedRecipe;
}

const ids = await generateRecipe(answer);
console.log(ids);
const outputs: { number: number; recipe: string }[] = [];
for (let i = 0; i < ids.length; ++i) {
  const recipeI = await getDetailedRecipe(ids[i]);
  outputs.push({ number: i + 1, recipe: recipeI });
}
console.log(outputs);

const RECIPE_PATH = "./src/resultRecipe.json"
const date = new Date();
moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a");

const content = {
  date: date, output: outputs.map(e => e)
};

process.on("beforeExit", () => {
  fs.writeFileSync(RECIPE_PATH, JSON.stringify(content, null, 2), { flag: 'a+' });
})

rl.close();
