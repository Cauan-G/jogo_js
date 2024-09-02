const express = require('express')
const app = express()

const port = 3000

const path = require("path")

const basePath = path.join(__dirname, 'templates')

app.use(express.static('public'))

app.get('/2048', (req, res) => {
    res.sendFile(`${basePath}/2048.html`)
})

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
})