let persons = require("./data")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const Person = require("./models/person")

const app = express()

morgan.token('conf', (req, _) => JSON.stringify(req.body))
const customMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :conf')

app.use(cors(), express.static('build') , express.json(), customMorgan)

app.get("/api/persons/", (request, response) => {
    Person.find({})
    .then(res => response.json(res))
})

app.get("/api/persons/:id", (request, response) => {
    let {id} = request.params
    id = Number(id)
    const person = persons.find(person => person.id === id)
    if(person)
    {
        response.json(person)
    }
    else
    {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    let {id} = request.params
    id = Number(id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    let {name, number} = request.body
    if( !(name && number) )
    {
        return response.status(400).json({
            error: "Name, Number cannot be empty"
        })
    }

    const newPerson = new Person({name, number})
    newPerson.save()
    .then(savedPerson => response.json(savedPerson))
})

app.get("/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.put("/api/persons/:id", (request, response) => {
    let id = request.params.id
    id = Number(id)
    let updated = {}
    let idInPersons = false
    persons = persons.map(p => {
        if(p.id === id)
        {
            idInPersons = true
            updated = {...p, number: request.body.number}
            return updated
        }
        else
        {
            return p
        }
    })
    if(!idInPersons)
    {
        return response.status(404).end()
    }
    response.json(updated)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log("App running on port 3001")})

const generateId = () => {
    const existingIds = persons.map( ({id}) => Number(id) )
    let randomId
    do
    {
        const max = Math.floor(10000)
        const min = Math.ceil(1)
        randomId = Math.floor(Math.random() * (max - min) + min)
    }
    while(existingIds.includes(randomId))

    return randomId
}