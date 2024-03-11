import type { Game } from '$lib/game';
import type { Prolog } from '$lib/prolog/prolog';
import type { V2 } from '$lib/v2';
import { AIAgent } from '../aiAgent';

export class PrologAgent extends AIAgent {
	private readonly prolog: Prolog;

	public constructor(game: Game, prolog: Prolog) {
		super(game);
		this.prolog = prolog;
	}

	public nextTarget(): V2 {
		throw new Error('Method not implemented.');
	}

	public nextMove(): V2 {
		throw new Error('Method not implemented.');
	}
}
