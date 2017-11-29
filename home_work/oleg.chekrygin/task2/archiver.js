// - Create gzip archiver and un-archiver -> archive un-archive js files only.

const zlib = require('zlib');
const gzip = zlib.createGzip();
const path = require('path');
const fs = require('fs');

class Archiver {
    constructor () {}

    zip (files) {
        const jsFiles = this.filterJsFiles(files);

        for (let i in jsFiles) {
            const fileName = jsFiles[i].split('.')[0];

            fs.createReadStream(jsFiles[i]).pipe(gzip).pipe(fs.createWriteStream(`${fileName}.gz`));
        }
    }

    unZip (archive) {
        const archiveFiles = this.filterArchiveFiles(archive);

        for (let i in archiveFiles) {
            let fileName = archiveFiles[i].split('.')[0];
            console.log(fileName);

            fs.createReadStream(archiveFiles[i])
                .pipe(zlib.createUnzip())
                .pipe(fs.createWriteStream(`${fileName}.js`))
                .on('finish', () => console.log('Done'));
        }
    }

    filterJsFiles (files) {
        return files.filter( (file) => file.indexOf('.js') !== -1);
    }

    filterArchiveFiles (files) {
        return files.filter( (file) => file.indexOf('.gz') !== -1);
    }
}

const archiver = new Archiver();

archiver.zip(fs.readdirSync(__dirname));
// archiver.unZip(fs.readdirSync(__dirname));