import type { Game } from '$lib/game';
import type { Prolog } from '$lib/prolog/prolog';
import { v2FromString, type V2, equalsV2, includesV2, sortV2 } from '$lib/v2';
import { type AiTileData } from '../ai';
import { AIAgent } from '../aiAgent';

export class PrologAgent extends AIAgent {
	private readonly prolog: Prolog;
	private previousTarget: V2 = { x: 0, y: 0 };
	private currentPath: V2[] = [];

	public constructor(game: Game, prolog: Prolog) {
		super(game);
		this.prolog = prolog;
	}

	public override nextTarget(): V2 {
		if (this.game.playerHasGold) return this.game.playerPosition;

		const nextTarget = this.prolog.queryOnce(
			'next_target(Knowledge, Visited, Width, Height, Target).',
			{
				Knowledge: knowledgeToProlog(this.knowledge),
				Visited: sortV2(this.visited.map(v2FromString)).map(v2ToProlog),
				Width: this.game.width,
				Height: this.game.height
			}
		);

		return v2FromProlog(nextTarget.Target ?? [0, 0]);
	}

	public override nextMove(): V2 {
		if (
			equalsV2(this.previousTarget, this.nextTarget()) &&
			includesV2(this.game.playerPosition, this.currentPath)
		)
			return nextPathPoint(this.currentPath, this.game.playerPosition);

		const nextMove = this.prolog.queryOnce('next_move(From, Target, Visited, Path).', {
			From: v2ToProlog(this.game.playerPosition),
			Target: v2ToProlog(this.nextTarget()),
			Visited: this.visited.map(v2FromString).map(v2ToProlog)
		});

		if (!nextMove.success) return this.game.playerPosition;

		this.previousTarget = this.nextTarget();
		this.currentPath = nextMove.Path.map(v2FromProlog);
		return v2FromProlog(nextMove.Path[1] ?? nextMove.Path[0]);
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

function nextPathPoint(path: V2[], current: V2): V2 {
	if (path.length === 0) return current;
	const index = path.findIndex((v) => v.x === current.x && v.y === current.y);
	if (index === -1) return current;
	return path[index + 1] ?? current;
}
