const db = require('../models');
const TaskComment = db.TaskComment;
const User = db.User;

// List comments for a task
exports.list = async (req, res) => {
  const { taskId } = req.params;
  const comments = await TaskComment.findAll({
    where: { taskId, deleted: false },
    include: [{ model: User }],
    order: [['createdAt', 'ASC']]
  });
  res.json(comments);
};

// Add comment
exports.add = async (req, res) => {
  const { taskId } = req.params;
  const { userId, comment } = req.body;
  if (!userId || !comment) return res.status(400).json({ message: 'Missing userId or comment' });
  const newComment = await TaskComment.create({ taskId, userId, comment });
  res.status(201).json(newComment);
};

// Delete comment
exports.remove = async (req, res) => {
  const { id } = req.params;
  const comment = await TaskComment.findByPk(id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  comment.deleted = true;
  await comment.save();
  res.json({ message: 'Comment deleted' });
};
