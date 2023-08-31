const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const download = require('./routes/download')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())
app.use('/download', download)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`Server on http://localhost:${port}`)
})
