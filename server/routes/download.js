const express = require('express')
const app = express.Router()
const path = require('path')
const fs = require('node:fs')
const { exec } = require('child_process')
const { formatVideoTitle, downloadAllFiles } = require('../utils/downloadFiles')
const pc = require('picocolors')

app.get('/', (req, res) => {
    res.send('Download some part of video .ts')
})

app.post('/files', async (req, res) => {
    const receivedUrls = req.body.requestData
    const nameVideo = formatVideoTitle(receivedUrls.urlActualTab)
    const destinationFolder = path.join(__dirname, 'videos')
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
    }
    const firstUrl = receivedUrls.UrlArray[0]
    const pattern = firstUrl.match(/(.*\/seg-)(\d+)(-v\d+-a\d+\.ts)/)
    if (pattern && pattern.length === 4) {
        const prefix = pattern[1]
        const suffix = pattern[3]

        downloadAllFiles(prefix, suffix, destinationFolder)
            .then(() => {
                exec(`python D:/Code/tool-download/scripts-to-download/list_parts.py "${nameVideo}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error when execute script: ${error}`)
                        return
                    }
                    console.error(`stderr: ${stderr}`)
                    console.log(pc.green(`stdout: ${stdout}`))
                    console.log('Finished')
                })
                res.send('Files downloaded it and saved it, Script Executed')
            })
            .catch(error => {
                console.error(`Error during download: ${error}`)
                res.status(500).send('Error to file download')
            })
    }
})

module.exports = app
