import type { Game } from '$lib/game';
import { getAdjacentV2Bound, isAdjacentV2, v2FromString, type V2, equalsV2 } from '$lib/v2';
import { AIAgent } from '../aiAgent';

export class JSAgent extends AIAgent {
	public constructor(game: Game) {
		super(game);
	}

	private calculateDanger(v: V2): number {
		const { wumpus, pit, gold } = this.knowledge[v.y][v.x];
		const goldMultiplier = gold > 0.5 ? gold * 2 : gold / 2;
		const safeZone = v.x <= 1 && v.y <= 1 ? 0.5 : 0;
		return wumpus + pit - goldMultiplier - safeZone;
	}

	public override nextTarget(): V2 {
		if (this.game.playerHasGold) return this.game.playerPosition;

		let best: V2 = { x: 0, y: 0 };
		let leastDanger = Infinity;

		for (let y = 0; y < this.game.height; y++) {
			for (let x = this.game.width - 1; x >= 0; x--) {
				if (this.visited.includes(`${x},${y}`)) continue;
				if (!this.visited.some((v) => isAdjacentV2({ x, y }, v2FromString(v)))) continue;

				const danger = this.calculateDanger({ x, y });

				if (danger < leastDanger) {
					leastDanger = danger;
					best = { x, y };
				}
			}
		}

		return best;
	}

	public override nextMove(): V2 {
		const nextTarget = this.nextTarget();
		return (
			aStar(
				this.game.playerPosition,
				nextTarget,
				[...this.visited, `${nextTarget.x},${nextTarget.y}`],
				this.game.width,
				this.game.height
			)[1] ?? this.game.playerPosition
		);
	}
}

function aStar(from: V2, to: V2, visited: string[], width: number, height: number): V2[] {
	const openSet = new Set<V2>();
	const cameFrom = new Map<V2, V2>();
	const gScore = new Map<V2, number>();
	const fScore = new Map<V2, number>();

	openSet.add(from);
	gScore.set(from, 0);
	fScore.set(from, heuristic(from, to));

	while (openSet.size > 0) {
		let current: V2 = { x: 0, y: 0 };
		let lowestFScore = Infinity;
		for (const v of openSet) {
			if (fScore.get(v)! < lowestFScore) {
				lowestFScore = fScore.get(v)!;
				current = v;
			}
		}

		if (equalsV2(current, to)) return reconstructPath(cameFrom, current);

		openSet.delete(current);

		for (const neighbor of getAdjacentV2Bound(current, width, height)) {
			if (!visited.includes(`${neighbor.x},${neighbor.y}`)) continue;

			const tentativeGScore = gScore.get(current)! + 1;

			if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
				cameFrom.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(neighbor, tentativeGScore + heuristic(neighbor, to));
				if (!openSet.has(neighbor)) openSet.add(neighbor);
			}
		}
	}

	return [from];
}

function heuristic(from: V2, to: V2): number {
	return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

function reconstructPath(cameFrom: Map<V2, V2>, current: V2): V2[] {
	const totalPath = [current];
	while (cameFrom.has(current)) {
		current = cameFrom.get(current)!;
		totalPath.unshift(current);
	}
	return totalPath;
}
