import { Sequelize } from "sequelize";
import { sequelize, Question } from "./question-model.js";

sequelize.sync().then(() => {
  console.log("Question table created successfully!");
}).catch((error) => {
  console.error("Unable to create table : ", error);
});

export const createQuestion = async (title, difficulty, description, example, constraint) => {
  var newQuestion;
  switch(difficulty) {
  case "Easy":
    newQuestion = Question.build({ title: title, difficulty: "Easy", description: description, example: example, constraint: constraint });
    break;
  case "Medium":
    newQuestion = Question.build({ title: title, difficulty: "Medium", description: description, example: example, constraint: constraint });
    break;
  case "Hard":
    newQuestion = Question.build({ title: title, difficulty: "Hard", description: description, example: example, constraint: constraint });
    break;
  } 
   
  return newQuestion;
};

export const getRandomQuestion = async (difficulty) => {
  var randomQuestion;
  switch(difficulty.toLowerCase()) {
  case "easy":
    randomQuestion = await Question.findAll({
      where: {
        difficulty: "Easy"
      },
      order: Sequelize.literal("rand()"), limit: 1
    });
    break;
  case "medium":
    randomQuestion = await Question.findAll({
      where: {
        difficulty: "Medium"
      },
      order: Sequelize.literal("rand()"), limit: 1
    });
    break;
  case "hard":
    randomQuestion = await Question.findAll({
      where: {
        difficulty: "Hard"
      },
      order: Sequelize.literal("rand()"), limit: 1
    });
    break;
  }

  return JSON.stringify(randomQuestion[0]);
};
