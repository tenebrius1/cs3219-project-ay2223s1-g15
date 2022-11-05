import { Sequelize } from "sequelize";
import { sequelize, Question } from "./question-model.js";

sequelize.sync().then(() => {
  console.log("Question table created successfully!");
}).catch((error) => {
  console.error("Unable to create table : ", error);
});

export const createQuestion = async (title, difficulty, description, example, constraint) => {
  let newQuestion;
  switch (difficulty) {
  case "Easy":
    newQuestion = Question.build({
      title, difficulty: "Easy", description, example, constraint,
    });
    break;
  case "Medium":
    newQuestion = Question.build({
      title, difficulty: "Medium", description, example, constraint,
    });
    break;
  case "Hard":
    newQuestion = Question.build({
      title, difficulty: "Hard", description, example, constraint,
    });
    break;
  }

  return newQuestion;
};

export const getRandomQuestion = async (difficulty) => {
  let randomQuestion;
  switch (difficulty.toLowerCase()) {
  case "easy":
    randomQuestion = await Question.findAll({
      where: {
        difficulty: "Easy",
      },
      order: Sequelize.literal("rand()"),
      limit: 1,
    });
    break;
  case "medium":
    randomQuestion = await Question.findAll({
      where: {
        difficulty: "Medium",
      },
      order: Sequelize.literal("rand()"),
      limit: 1,
    });
    break;
  case "hard":
    randomQuestion = await Question.findAll({
      where: {
        difficulty: "Hard",
      },
      order: Sequelize.literal("rand()"),
      limit: 1,
    });
    break;
  }

  return JSON.stringify(randomQuestion[0]);
};
