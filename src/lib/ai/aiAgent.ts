import type { Game } from '$lib/game';
import { createMatrix } from '$lib/utils';
import { getAdjacentV2Bound, type V2 } from '$lib/v2';
import { perceptionsToTileData, type AiTileData } from './ai';

export abstract class AIAgent {
	private _game: Game;
	private _visited: Set<string>;
	private _knowledge: AiTileData[][];

	protected get game() {
		return this._game;
	}

	public get knowledge() {
		return this._knowledge;
	}

	public get visited() {
		return [...this._visited.values()];
	}

	public addVisited(v: V2) {
		if (this.visited.includes(`${v.x},${v.y}`)) return;

		this._visited.add(`${v.x},${v.y}`);

		this.knowledge[v.y][v.x] = { wumpus: 0, pit: 0, gold: 0, empty: true };

		updateKnowledge(this.game, this.visited, this.knowledge, v);
	}

	public abstract nextTarget(): V2;

	public abstract nextMove(): V2;

	constructor(game: Game) {
		this._game = game;
		this._visited = new Set();
		this._knowledge = createMatrix(game.width, game.height, () => ({ wumpus: 0, pit: 0, gold: 0 }));
		this.addVisited(game.playerPosition);
	}
}

export function getAdjacentNotVisited(game: Game, visited: string[], v: V2): V2[] {
	return getAdjacentV2Bound(v, game.width, game.height).filter(
		(adj) => !visited.includes(`${adj.x},${adj.y}`)
	);
}

function updateKnowledge(game: Game, visited: string[], knowledge: AiTileData[][], v: V2) {
	const perceptions = game.perceptions;
	const tileData = perceptionsToTileData(perceptions);
	const adjacents = getAdjacentNotVisited(game, visited, v);

	if (perceptions.length === 0)
		adjacents.forEach(
			(adj) => (knowledge[adj.y][adj.x] = { wumpus: 0, pit: 0, gold: 0, empty: true })
		);
	else
		adjacents
			.filter((a) => !knowledge[a.y][a.x].empty)
			.forEach((adj) => {
				knowledge[adj.y][adj.x] = {
					wumpus: knowledge[adj.y][adj.x].wumpus + tileData.wumpus,
					pit: knowledge[adj.y][adj.x].pit + tileData.pit,
					gold: knowledge[adj.y][adj.x].gold + tileData.gold
				};
				const sum =
					knowledge[adj.y][adj.x].wumpus +
					knowledge[adj.y][adj.x].pit +
					knowledge[adj.y][adj.x].gold;
				knowledge[adj.y][adj.x].empty = sum >= 0.49 ? false : undefined;
			});

	if (game.field.some((row, y) => row.some((_, x) => knowledge[y][x].wumpus >= 0.5)))
		knowledge.forEach((row) => row.forEach((tile) => (tile.wumpus = tile.wumpus >= 0.5 ? 1 : 0)));

	if (game.field.some((row, y) => row.some((_, x) => knowledge[y][x].gold >= 0.5)))
		knowledge.forEach((row) => row.forEach((tile) => (tile.gold = tile.gold >= 0.5 ? 1 : 0)));
}
