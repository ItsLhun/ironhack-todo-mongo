const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 140
    },
    due: {
      type: Date,
      required: false
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: { createdAt: 'created', updatedAt: 'edited' } }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
