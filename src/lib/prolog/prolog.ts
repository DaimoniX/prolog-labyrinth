import SWIPL from 'swipl-wasm';

export class Prolog {
	private readonly prolog: SWIPL.Prolog;

	public constructor(prolog: SWIPL.Prolog) {
		this.prolog = prolog;
	}

	public queryOnce(query: string, bindings?: Record<string, unknown>) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return this.query(query, bindings).once() as Record<string, any> & { success: boolean };
	}

	public query(query: string, bindings?: Record<string, unknown>): SWIPL.Query {
		return this.prolog.query(query, bindings);
	}
}
