let persons = require("./data")
const express = require("express")
const app = express()

app.use(express.json())

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
    persons = persons.filter(person => person.id !== id).map((person, i) => {return {...person, id: i + 1}})
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    let newPerson = request.body
    if( !(newPerson.name && newPerson.number) )
    {
        return response.status(400).end()
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


app.listen(3001, () => {console.log("App running on port 3001");})

const generateId = () => {
    const existingIds = persons.map( ({id}) => Number(id) )
    let randomId
    do
    {
        randomId = Math.floor(Math.random() * (Math.floor(10000) - Math.ceil(1)) + Math.ceil(1))
    }
    while(existingIds.includes(randomId))

    return randomId
}