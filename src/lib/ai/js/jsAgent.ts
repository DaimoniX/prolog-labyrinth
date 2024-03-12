import type { Game } from '$lib/game';
import { getAdjacentV2Bound, isAdjacentV2, v2FromString, type V2 } from '$lib/v2';
import { perceptionsToTileData } from '../ai';
import { AIAgent } from '../aiAgent';

export class JSAgent extends AIAgent {
	public constructor(game: Game) {
		super(game);
	}

	private getAdjacentNotVisited(v: V2): V2[] {
		return getAdjacentV2Bound(v, this.game.width, this.game.height).filter(
			(adj) => !this.visited.includes(`${adj.x},${adj.y}`)
		);
	}

	private updateKnowledge(v: V2): void {
		const perceptions = this.game.perceptions;
		const tileData = perceptionsToTileData(perceptions);
		const adjacents = this.getAdjacentNotVisited(v);

		if (perceptions.length === 0)
			adjacents.forEach(
				(adj) => (this.knowledge[adj.y][adj.x] = { wumpus: 0, pit: 0, gold: 0, empty: true })
			);
		else
			adjacents
				.filter((a) => !this.knowledge[a.y][a.x].empty)
				.forEach((adj) => {
					this.knowledge[adj.y][adj.x] = {
						wumpus: this.knowledge[adj.y][adj.x].wumpus + tileData.wumpus,
						pit: this.knowledge[adj.y][adj.x].pit + tileData.pit,
						gold: this.knowledge[adj.y][adj.x].gold + tileData.gold
					};
					const sum =
						this.knowledge[adj.y][adj.x].wumpus +
						this.knowledge[adj.y][adj.x].pit +
						this.knowledge[adj.y][adj.x].gold;
					this.knowledge[adj.y][adj.x].empty = sum >= 0.49 ? false : undefined;
				});

		if (this.game.field.some((row, y) => row.some((_, x) => this.knowledge[y][x].wumpus >= 0.5)))
			this.knowledge.forEach((row) =>
				row.forEach((tile) => (tile.wumpus = tile.wumpus >= 0.5 ? 1 : 0))
			);

		if (this.game.field.some((row, y) => row.some((_, x) => this.knowledge[y][x].gold >= 0.5)))
			this.knowledge.forEach((row) =>
				row.forEach((tile) => (tile.gold = tile.gold >= 0.5 ? 1 : 0))
			);
	}

	public override addVisited(v: V2): void {
		if (this.visited.includes(`${v.x},${v.y}`)) return;
		super.addVisited(v);
		this.knowledge[v.y][v.x] = { wumpus: 0, pit: 0, gold: 0, empty: true };

		this.updateKnowledge(v);
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
			for (let x = 0; x < this.game.width; x++) {
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

		if (current.x === to.x && current.y === to.y) return reconstructPath(cameFrom, current);

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
