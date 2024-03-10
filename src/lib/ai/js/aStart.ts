import { type V2, equalsV2, getAdjacentV2Bound } from '$lib/v2';
import type { AiTileData } from '../ai';

export function aStar(field: AiTileData[][], start: V2, goal: V2) {
	const openSet = new Set<V2>();
	const cameFrom = new Map<V2, V2>();
	const gScore = new Map<V2, number>();
	const fScore = new Map<V2, number>();

	openSet.add(start);
	gScore.set(start, 0);
	fScore.set(start, heuristic(start, goal));

	while (openSet.size > 0) {
		let current: V2 = openSet.values().next().value as V2;
		let lowestFScore = Infinity;
		for (const node of openSet) {
			const score = fScore.get(node)!;
			if (score < lowestFScore) {
				lowestFScore = score;
				current = node;
			}
		}

		if (!current) throw new Error('No current node');

		if (equalsV2(current, goal)) return reconstructPath(cameFrom, current);

		openSet.delete(current);

		for (const neighbor of getAdjacentV2Bound(current, field[0].length, field.length)) {
			const tentativeGScore = gScore.get(current)! + 1;
			if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
				cameFrom.set(neighbor, current);
				gScore.set(neighbor, tentativeGScore);
				fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));
				openSet.add(neighbor);
			}
		}
	}

	return [];
}

function heuristic(start: V2, goal: V2): number {
	return Math.abs(start.x - goal.x) + Math.abs(start.y - goal.y);
}

function reconstructPath(cameFrom: Map<V2, V2>, current: V2) {
	const totalPath = [current];
	while (cameFrom.has(current)) {
		current = cameFrom.get(current)!;
		totalPath.unshift(current);
	}
	return totalPath;
}
