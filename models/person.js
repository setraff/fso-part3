const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(_ => console.log('Connected to MongoDB'))
  .catch( error => `Error connecting to mongodb: ${error.message}` )

const personSchema = new mongoose.Schema({
  name: {
    minLength: 3,
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: x => /^((\d{3})|(\d{2}))-(\d{1,})$/.test(x),
      message: props => `${props.value} is not a valid phone number.`
    }
  }
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