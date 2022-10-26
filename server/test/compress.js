import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import fs from 'fs/promises';

const folderPath = "./tmp/9de75ed4-27a2-44fa-9b3b-01fc6bc551ac";
const imagePool = new ImagePool(cpus().length);

var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
let pages = (await fs.readdir(folderPath)).sort(collator.compare);

const promises = [];
for (const file of pages) {
    const image = imagePool.ingestImage(`${folderPath}/${file}`);

    promises.push(new Promise(async (resolve, reject) => {
        await image.encode({
            mozjpeg: {
                quality: 50,
            },
            oxipng: {
                effort: 2
            }
        });
        const { extension, binary } = await image.encodedWith.mozjpeg;
        await fs.writeFile(`./images/${file}.jpg`, binary);
        resolve();
    }))

}

await Promise.all(promises);
await imagePool.close();
