import SWIPL from 'swipl-wasm';
import { Prolog } from './prolog';

export async function loadProlog() {
	const swipl = await SWIPL({
		arguments: ['-q']
	});

	const prologArraysFile = await fetch('prolog/arrays.pl');
	const prologAstarFile = await fetch('prolog/astar.pl');
	const wumpusPrologFile = await fetch('prolog/wumpus.pl');

	const combinedPrologFile = [
		await prologArraysFile.text(),
		await prologAstarFile.text(),
		await wumpusPrologFile.text()
	].join('\n');

	swipl.FS.writeFile('wumpus.pl', combinedPrologFile);

	const prolog = swipl.prolog;

	prolog.query('[wumpus].').once();

	console.debug('Prolog loaded');
	return new Prolog(prolog);
}
