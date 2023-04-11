const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log('give password as argument to list all persons. Give password, name, number to add person to the phonebook.')
    process.exit(1)
}
  
const password = process.argv[2]
const newName = process.argv[3] ?? ""
const newNumber = process.argv[4] ?? ""

const url = `mongodb+srv://raffso:${password}@fullstackopenpart3.qekp79y.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

if(newName && newNumber && password)
{
    const newContact = new Person({
        name: newName,
        number: newNumber
    })
    newContact.save().then( (res) => {
        console.log(`Added ${res.name} to phonebook`);
        mongoose.connection.close()
    })
}
else if (password && !(newName && newNumber))
{
    Person.find({})
    .then( (people) => {
        console.log("Phonebook: ");
        people.forEach( (person) => {
            console.log(`${person.name} ${person.number}`);
        } )
        mongoose.connection.close()
    })
}