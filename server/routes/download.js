const express = require('express')
const app = express.Router()
const path = require('path')
const fs = require('node:fs')
const { exec } = require('child_process')
const { downloadFile } = require('../utils/downloadFiles')

app.get('/', (req, res) => {
    res.send('Download some part of video .ts')
})

app.post('/files', async (req, res) => {
    const receivedUrls = req.body.UrlArray

    // Create directory if not exist
    const destinationFolder = path.join(__dirname, 'videos')
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
    }

    const downloadPromises = receivedUrls.map(url => downloadFile(url, destinationFolder))

    Promise.all(downloadPromises)
        .then(() => {
            // Execute script Python
            exec('python D:/Code/dev-talles-download/scripts-to-download/list_parts.py', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error when execute script: ${error}`)
                    return
                }
                console.log(`stdout: ${stdout}`)
                console.error(`stderr: ${stderr}`)
            })
            res.send('Files downloaded it and saved it, Script Executed')
        })
        .catch(error => {
            console.error(`Error to file download: ${error}`)
            res.status(500).send('Error to file download')
        })
})

module.exports = app
