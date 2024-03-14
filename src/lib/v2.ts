export type V2 = { x: number; y: number };

export function isAdjacentV2(pos1: V2, pos2: V2) {
	return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) === 1;
}

export function equalsV2(pos1: V2, pos2: V2) {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function getAdjacentV2(pos: V2): V2[] {
	return [
		{ x: pos.x, y: pos.y - 1 },
		{ x: pos.x + 1, y: pos.y },
		{ x: pos.x, y: pos.y + 1 },
		{ x: pos.x - 1, y: pos.y }
	];
}

export function getAdjacentV2Bound(pos: V2, width: number, height: number): V2[] {
	return getAdjacentV2(pos).filter((p) => p.x >= 0 && p.x < width && p.y >= 0 && p.y < height);
}

export function v2FromString(str: string): V2 {
	const [x, y] = str.split(',').map(Number);
	return { x, y };
}

export function sortV2(v2: V2[]): V2[] {
	return v2.sort((a, b) => (a.y - b.y) * 100 + b.x - a.x);
}

export function includesV2(v2: V2, arr: V2[]): boolean {
	return arr.some((v) => v.x === v2.x && v.y === v2.y);
}
