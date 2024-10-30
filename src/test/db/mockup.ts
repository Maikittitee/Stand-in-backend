import './connection.js';
import * as documents from './model.js';


for (const [key, doc] of Object.entries(documents)) {
    console.log(`Document: ${key}`);
    console.log(doc);
    console.log('-----------------------------------\n');

    await doc.save();
}


process.exit(0);