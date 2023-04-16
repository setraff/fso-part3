const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

morgan.token('conf', (req, _) => JSON.stringify(req.body))
const customMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :conf')

app.use(cors(), express.static('build') , express.json(), customMorgan)

app.get('/api/persons/', (request, response) => {
  Person.find({})
    .then(res => response.json(res))
})

app.get('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findById(id)
    .then(x => {
      if(x)
      {
        response.json(x)
      }
      else
      {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndRemove(id)
    .then( _ => {
      response.status(204).end()
    })
    .catch(error => next(error) )
})

app.post('/api/persons', async (request, response, next) => {
  let { name, number } = request.body

  let isPersonAlreadyInPhonebook  = await Person.find({ name })
  if(isPersonAlreadyInPhonebook.length)
  {
    return response.status(400).send({ error: 'Name must be unique' })
  }

  const newPerson = new Person({ name, number })
  newPerson.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({})
    .then( ({ length }) => {
      response.send(`
            <p>Phonebook has info for ${length} people</p>
            <p>${new Date()}</p>
        `)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { id } = request.params
  const { body } = request
  const { name, number } = body
  const updatedContact = { name, number }
  Person.findByIdAndUpdate(id, updatedContact, { new: true, runValidators: true, context: 'query' })
    .then( (x) => {
      if(x) {
        response.json(x)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const handleUnknownRoutes = (request, response) => {
  response.status(404).send({ error: 'Route not found' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(handleUnknownRoutes, errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log('App running on port 3001')})