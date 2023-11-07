const fs = require('fs');
const FILE_PATH = 'stats.json'
const FILE_MESSAGE_PATH = 'message.json'

const readStats = () => {
    let result = {}
    try {
        result = JSON.parse(fs.readFileSync(FILE_PATH))
    } catch (err) {
        console.error(err)
    }
    return result
}
    
// dump json object to file
const dumpStats = (stats) => {
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(stats), { flag: 'w+' })
    } catch (err) {
        console.error(err)
    }
}

const readMessages = () => {
    let result = {}
    try {
        result = JSON.parse(fs.readFileSync(FILE_MESSAGE_PATH))
    } catch (err) {
        console.error(err)
    }
    return result
}

// dump json object to file
const writeMessage = (message) => {
    try {
        fs.writeFileSync(FILE_MESSAGE_PATH, JSON.stringify(message), { flag: 'w+' })
    } catch (err) {
        console.error(err)
    }
}
//On efface les fichiers json des données
const clearJsonDataFiles = () => {
    try {
        fs.writeFileSync(FILE_PATH, "{}", { flag: 'w+' })
        fs.writeFileSync(FILE_MESSAGE_PATH, "[]", { flag: 'w+' })
    } catch (err) {
        console.error(err)
    }

    console.log("clearing files done")
}

module.exports = { readStats, dumpStats,clearJsonDataFiles, readMessages, writeMessage };