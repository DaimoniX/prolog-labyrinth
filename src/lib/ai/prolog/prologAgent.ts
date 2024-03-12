import type { Game } from '$lib/game';
import type { Prolog } from '$lib/prolog/prolog';
import { v2FromString, type V2, getAdjacentV2Bound } from '$lib/v2';
import { perceptionsToTileData, type AiTileData } from '../ai';
import { AIAgent } from '../aiAgent';

export class PrologAgent extends AIAgent {
	private readonly prolog: Prolog;

	public constructor(game: Game, prolog: Prolog) {
		super(game);
		this.prolog = prolog;
	}

	private getAdjacentNotVisited(v: V2): V2[] {
		return getAdjacentV2Bound(v, this.game.width, this.game.height).filter(
			(adj) => !this.visited.includes(`${adj.x},${adj.y}`)
		);
	}

	public override addVisited(v: V2): void {
		super.addVisited(v);

		const perceptions = this.game.perceptions;
		const tileData = perceptionsToTileData(perceptions);
		const adjacents = this.getAdjacentNotVisited(v);

		this.knowledge[v.y][v.x] = {
			wumpus: 0,
			pit: 0,
			gold: 0
		};

		adjacents.forEach(
			(adj) =>
				(this.knowledge[adj.y][adj.x] = {
					wumpus: this.knowledge[adj.y][adj.x].wumpus + tileData.wumpus,
					pit: this.knowledge[adj.y][adj.x].pit + tileData.pit,
					gold: this.knowledge[adj.y][adj.x].gold + tileData.gold
				})
		);
	}

	public override nextTarget(): V2 {
		if (this.game.playerHasGold) return this.game.playerPosition;

		const nextTarget = this.prolog.queryOnce(
			'next_target(Knowledge, Visited, Width, Height, Target).',
			{
				Knowledge: knowledgeToProlog(this.knowledge),
				Visited: this.visited.map(v2FromString).map(v2ToProlog),
				Width: this.game.width,
				Height: this.game.height
			}
		);

		return v2FromProlog(nextTarget.Target ?? [0, 0]);
	}

	public override nextMove(): V2 {
		const nextMove = this.prolog.queryOnce('next_move(From, Target, Visited, Move).', {
			From: v2ToProlog(this.game.playerPosition),
			Target: v2ToProlog(this.nextTarget()),
			Visited: this.visited.map(v2FromString).map(v2ToProlog)
		});
		if (!nextMove.success) return this.game.playerPosition;
		return v2FromProlog(nextMove.Move[1] ?? nextMove.Move[0]);
	}
}

function v2FromProlog([x, y]: [number, number]): V2 {
	return { x, y };
}

function v2ToProlog(v2: V2): [number, number] {
	return [v2.x, v2.y];
}

function knowledgeToProlog(knowledge: AiTileData[][]): [number, number, number][][] {
	return knowledge.map((row) => row.map(tileDataToProlog));
}

function tileDataToProlog(tileData: AiTileData): [number, number, number] {
	return [tileData.wumpus, tileData.pit, tileData.gold];
}
