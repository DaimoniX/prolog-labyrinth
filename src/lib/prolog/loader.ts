import SWIPL from 'swipl-wasm';
import { Prolog } from './prolog';

export async function loadProlog() {
	const swipl = await SWIPL({
		arguments: ['-q']
	});

	const wumpusPrologFile = await fetch('prolog/wumpus.pl');

	swipl.FS.writeFile('wumpus.pl', await wumpusPrologFile.text());

	const prolog = swipl.prolog;

	prolog.query('[wumpus].').once();

	console.debug('Prolog loaded');
	return new Prolog(prolog);
}
