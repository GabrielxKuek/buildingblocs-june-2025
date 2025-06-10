import * as model from '../models/aiModel.js';

export const testController = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const result = await model.testModel(username);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error in testController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}