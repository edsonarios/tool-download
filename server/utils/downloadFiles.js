const fs = require('fs')
const path = require('path')
const axios = require('axios')

async function downloadFile (url, destinationFolder) {
    const fileName = url.split('/').pop()

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
            resolve()
        })
        writer.on('error', reject)
    })
}

function formatVideoTitle (rawTitle) {
    const cleanTitle = rawTitle.replace(/^\d+-/, '')

    let words = cleanTitle.split('-')

    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))

    const formattedTitle = words.join(' ')

    return formattedTitle
}

module.exports = {
    downloadFile,
    formatVideoTitle
}
