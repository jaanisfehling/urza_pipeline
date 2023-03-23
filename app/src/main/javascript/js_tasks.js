import {argv} from 'node:process';

let args = argv.slice(2);

let article = new Readability(document).parse();