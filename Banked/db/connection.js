const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || mongodb+srv://ecoadminarlindo:<db_password>@cluster0.gny5q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Atlas connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;