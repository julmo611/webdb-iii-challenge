// Manage cohorts (id, name)
const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true, // needed for sqlite
};
const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

server.post('/api/cohorts', (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: 'Insert Name.' });
  }
  db('cohorts')
    .insert(req.body)
    .then(newCohortId =>
      db('cohorts')
        .select()
        .where('id', newCohortId[0])
        .first()
        .then(newCohort => res.status(201).json(newCohort))
    )
    .catch(error => {
      console.error(error);
      res.status(500).json({
        message: 'Not completed.',
        error: error
      });
    });
});

// Get Cohorts
server.get('/api/cohorts', (req, res) => {
  db('cohorts')
    .select('*')
    .then(cohorts => res.status(200).json(cohorts))
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error', error: error });
    });
});

// get Cohorts by Id
server.get('/api/cohorts/:id', (req, res) => {
  db('cohorts')
    .select()
    .where('id', req.params.id)
    .first()
    .then(cohort => {
      if (!cohort) {
        return res.status(404).json({ message: 'Not found.' });
      }
      res.status(200).json(cohort);
    })
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error', error: error });
    });
});

// Get Cohorts by Id - Students

server.get('/api/cohorts/:id/students', (req, res) => {
  db('students')
    .select('*')
    .where('cohort_id', req.params.id)
    .then(students => res.status(200).json(students))
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error', error: error });
    });
});

// Put Cohorts
server.put('/api/cohorts/:id', (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: 'Insert name' });
  }
  db('cohorts')
    .where('id', req.params.id)
    .update(req.body)
    .then(updatedRows => {
      if (!updatedRows) {
        return res.status(404).json({ message: 'Not found.' });
      } else {
        db('cohorts')
          .select('*')
          .where('id', req.params.id)
          .then(updatedCohort => res.status(201).json(updatedCohort[0]));
      }
    })
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error', error: error });
    });
});

// Delete Cohort
server.delete('/api/cohorts/:id', (req, res) => {
  db('cohorts')
    .where('id', req.params.id)
    .del()
    .then(delStatus => {
      if (!delStatus) {
        return res.status(404).json({ message: 'Not found.' });
      } else {
        res.status(204).end();
      }
    })
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error.', error: error });
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () =>
  console.log(`\n** API running on http://localhost:${port} **\n`)
);