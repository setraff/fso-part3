let persons = require("./data")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

morgan.token('conf', (req, _) => JSON.stringify(req.body))
const customMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :conf')

app.use(cors(), express.static('build') , express.json(), customMorgan)

app.get("/api/persons/", (request, response) => {
    response.json(persons)
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
    let newPerson = request.body
    if( !(newPerson.name && newPerson.number) )
    {
        return response.status(400).json({
            error: "Name, Number cannot be empty"
        })
    }
    const names = persons.map(({name}) => name.toLowerCase())
    if (names.includes(newPerson.name.toLowerCase()))
    {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    newPerson.id = generateId()
    persons = [...persons, newPerson]
    response.json(newPerson)
})

app.get("/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
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