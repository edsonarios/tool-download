const { exec } = require('child_process')

function getResolution (locationVideo) {
    const command = `ffmpeg -i "${locationVideo}"`
    // eslint-disable-next-line n/handle-callback-err
    exec(command, (error, stdout, stderr) => {
        const resolution = stderr.match(/(\d{3,4}x\d{3,4})/)

        if (resolution) {
            console.log(`Video Resolution: ${resolution[0]}`)
        } else {
            console.log('Error.')
        }
    })
}

const args = process.argv.slice(2)

if (args.length < 1) {
    console.log('One args is required')
    process.exit(1)
}
const locationVideo = args[0]
getResolution(locationVideo)
