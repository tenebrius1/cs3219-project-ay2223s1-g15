import {
  ormCreateNewQuestion as _createNewQuestion,
  ormGetRandomQuestion as _getRandomQuestion,
} from '../model/question-orm.js';

export const createNewQuestion = async (req, res) => {
  try {
    const { title, difficulty, description, example, constraint } = req.body;
    if (title && difficulty && description && example && constraint) {
      const resp = await _createNewQuestion(
        title,
        difficulty,
        description,
        example,
        constraint
      );
      if (resp.err) {
        return res.status(400).json({ message: 'Could not create a new question' });
      } else {
        return res.status(201).json({ message: `Created new question successfully!` });
      }
    } else {
      return res.status(400).json({ message: 'One or more fields is missing!' });
    }
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'Database failure when creating new question' });
  }
};

export const getRandomQuestion = async (req, res) => {
  try {
    const resp = await _getRandomQuestion(req.query.difficulty);
    return res.status(200).json(resp);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: 'Database failure when getting random question' });
  }
};
