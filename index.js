const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const app = express();
const Task = require('./models/task');
const hbs = require('hbs');
const mongoose = require('mongoose');
const morgan = require('morgan'); // logger from npm
const nodeSassMiddleware = require('node-sass-middleware');

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(
  nodeSassMiddleware({
    dest: path.join(__dirname, 'public/styles'),
    src: path.join(__dirname, 'styles'),
    force: true,
    outputStyle: 'expanded',
    prefix: '/styles'
  })
);

app.use(express.urlencoded({ extended: true }));

//const formatYmd = (date) => date.toISOString().slice(0, 10);

app.get('/', (req, res, next) => {
  Task.find({})
    .lean()
    .then((taskList) => {
      for (let task of taskList) {
        if (task.due) {
          task.due = task.due.toISOString().slice(0, 10);
        }
      }
      res.render('home', { taskList });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/create-to-do-list-item', (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const due = req.body.due;
  const completed = false;
  Task.create({
    title,
    description,
    due,
    completed
  })
    .then((task) => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/toggle/:id/:completed', (req, res, next) => {
  const id = req.params.id;
  Task.findById(id)
    .then((task) => {
      task.completed = !task.completed;
      task.save().then((task) => {
        res.redirect('/');
      });
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  Task.findById(id)
    .then((task) => {
      res.render('edit', task);
    })
    .catch((error) => {
      next(error);
    });
});

app.post('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const description = req.body.description;
  const due = req.body.due;
  Task.findByIdAndUpdate(id, { title, description, due })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/*', (req, res, next) => {
  //next(new Error('NOT FOUND'));
  res.render('error');
});

app.use((error, req, res, next) => {
  console.log(error);
  res.render('error');
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3000);
});
