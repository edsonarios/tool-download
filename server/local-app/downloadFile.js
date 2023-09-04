const path = require('path')
const fs = require('node:fs')
const { exec } = require('child_process')
const { downloadAllFiles } = require('../utils/downloadFiles')
const pc = require('picocolors')

function downloadFile (name, url) {
    const destinationFolder = path.join('D:/Code/dev-talles-download/server/routes', 'videos')
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder)
    }
    const firstUrl = url
    const pattern = firstUrl.match(/(.*\/seg-)(\d+)(-v\d+-a\d+\.ts)/)
    if (pattern && pattern.length === 4) {
        const prefix = pattern[1]
        const suffix = pattern[3]

        downloadAllFiles(prefix, suffix, destinationFolder)
            .then(() => {
                exec(`python D:/Code/dev-talles-download/scripts-to-download/list_parts.py "${name}"`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error when execute script: ${error}`)
                        return
                    }
                    console.error(`stderr: ${stderr}`)
                    console.log(pc.green(`stdout: ${stdout}`))
                    console.log('Finished')
                    process.exit(0)
                })
            })
            .catch(error => {
                console.error(`Error during download: ${error}`)
            })
    }
}

const args = process.argv.slice(2)

if (args.length < 2) {
    console.log('Two args is required')
    process.exit(1)
}
const nameVideo = args[0]
const urlVideo = args[1]
downloadFile(nameVideo, urlVideo)
