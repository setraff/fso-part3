const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(_ => console.log(`Connected to MongoDB`))
.catch( error => `Error connecting to mongodb: ${error.message}` )

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)
module.exports = Person