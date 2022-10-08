import { createQuestion, getRandomQuestion } from './repository.js'

export const ormCreateNewQuestion = async (title, difficulty, description, example, constraint) => {
  try {
    const newQuestion = await createQuestion(title, difficulty, description, example, constraint);
    newQuestion.save();
    return true;
  } catch (err) {
    console.error(err);
    console.log('ERROR: Could not create a new question');
    return { err };
  }
}

export const ormGetRandomQuestion = async (difficulty) => {
  try {
    const randomQuestion = await getRandomQuestion(difficulty);
    return randomQuestion;
  } catch(err) {
    console.error(err);
    return { err };
  }
}