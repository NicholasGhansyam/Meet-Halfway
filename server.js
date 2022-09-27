const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mainRoutes = require("./routes/main");
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

//load env vars
dotenv.config({ path: './config/config.env'})

//Connect DB
connectDB()
const app = express()


//Set Views Engine
app.engine(
    '.hbs',
    exphbs.engine({
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set("view engine", ".hbs")

//Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Set Static Folder
app.use(express.static('public'))

//Enable cors
app.use(cors())

//Routes
app.use("/", mainRoutes)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))