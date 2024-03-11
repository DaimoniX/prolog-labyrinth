import SWIPL from 'swipl-wasm';

export class Prolog {
	private readonly prolog: SWIPL.Prolog;

	public constructor(prolog: SWIPL.Prolog) {
		this.prolog = prolog;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public queryOnce(query: string, bindings?: Record<string, unknown>): any {
		return this.query(query, bindings).once();
	}

	public query(query: string, bindings?: Record<string, unknown>): SWIPL.Query {
		return this.prolog.query(query, bindings);
	}
}
