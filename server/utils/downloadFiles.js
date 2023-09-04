const fs = require('fs')
const path = require('path')
const axios = require('axios')
const pc = require('picocolors')

async function downloadAllFiles (prefix, suffix, destinationFolder) {
    let numberPartFile = 1

    while (true) {
        const newUrl = `${prefix}${numberPartFile}${suffix}`
        const success = await downloadFile(newUrl, destinationFolder)

        if (!success) {
            console.log(pc.green(`Stopping download at segment ${numberPartFile}`))
            break
        }

        numberPartFile++
    }
}

async function downloadFile (url, destinationFolder) {
    const fileName = url.split('/').pop()
    try {
        const response = await axios({
            method: 'GET',
            url,
            responseType: 'stream'
        })
        const outputPath = path.join(destinationFolder, fileName)
        const writer = fs.createWriteStream(outputPath)
        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`File ${fileName} downloaded successfully.`)
                resolve(true)
            })
            writer.on('error', () => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(false)
            })
        })
    } catch (error) {
        console.error(`Error downloading file: ${error}`)
        return false
    }
}

function formatVideoTitle (urlActualTab) {
    const rawTitle = urlActualTab.substring(urlActualTab.lastIndexOf('/') + 1)
    const cleanTitle = rawTitle.replace(/^\d+-/, '')

    let words = cleanTitle.split('-')

    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))

    const formattedTitle = words.join(' ')

    return formattedTitle
}

module.exports = {
    formatVideoTitle,
    downloadAllFiles
}
