import { createZeroMatrix } from './utils';
import { getAdjacentV2, isAdjacentV2, type V2 } from './v2';

export enum TileEnum {
	Empty = 0,
	Pit = 1,
	Wumpus = 2,
	Gold = 3
}

export enum PerceptionEnum {
	None = 0,
	Breeze = 1,
	Stench = 2,
	Glitter = 3
}

function pickRandomPosition(width: number, height: number): V2 {
	const x = Math.floor(Math.random() * width);
	const y = Math.floor(Math.random() * height);
	return { x, y };
}

function pickRandomPositionWithExclusions(width: number, height: number, exclusions: V2[]) {
	let position = pickRandomPosition(width, height);
	while (exclusions.some((e) => e.x === position.x && e.y === position.y))
		position = pickRandomPosition(width, height);
	return position;
}

function setTile(tiles: TileEnum[][], pos: V2, value: TileEnum) {
	tiles[pos.y][pos.x] = value;
}

export function getPerceptions(tiles: TileEnum[][], pos: V2): PerceptionEnum[] {
	const set = new Set<PerceptionEnum>();
	for (const relPos of getAdjacentV2(pos)) {
		const { x, y } = relPos;
		if (x < 0 || x >= tiles[0].length || y < 0 || y >= tiles.length) continue;
		const tile = tiles[y][x];
		if (tile === TileEnum.Pit) set.add(PerceptionEnum.Breeze);
		if (tile === TileEnum.Wumpus) set.add(PerceptionEnum.Stench);
		if (tile === TileEnum.Gold) set.add(PerceptionEnum.Glitter);
	}
	return Array.from(set).sort((a, b) => a - b);
}

export function generateField(width: number, height: number): TileEnum[][] {
	width = Math.max(3, width);
	height = Math.max(3, height);

	const tiles = createZeroMatrix(width, height);

	const pitCount = Math.floor((width * height) / 8);

	const filledTiles: V2[] = [
		{ x: 0, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 }
	];

	const wumpusPos = pickRandomPositionWithExclusions(width, height, filledTiles);
	setTile(tiles, wumpusPos, TileEnum.Wumpus);
	filledTiles.push(wumpusPos);

	const goldPos = pickRandomPositionWithExclusions(width, height, filledTiles);
	setTile(tiles, goldPos, TileEnum.Gold);
	filledTiles.push(goldPos);

	for (let i = 0; i < pitCount; i++) {
		const pitPos = pickRandomPositionWithExclusions(width, height, filledTiles);
		setTile(tiles, pitPos, TileEnum.Pit);
		filledTiles.push(pitPos);
	}

	return tiles;
}

export class Game {
	private _tiles: TileEnum[][];
	private _playerPosition: V2;
	private _playerHasGold: boolean;
	private _gameOver: boolean;
	private _moves: number;

	public get field() {
		return this._tiles;
	}

	public get playerPosition() {
		return this._playerPosition;
	}

	public get playerHasGold() {
		return this._playerHasGold;
	}

	public get gameOver() {
		return this._gameOver;
	}

	public get perceptions() {
		return getPerceptions(this._tiles, this._playerPosition);
	}

	public get moves() {
		return this._moves;
	}

	public get width() {
		return this._tiles[0].length;
	}

	public get height() {
		return this._tiles.length;
	}

	private isValidMove(pos: V2) {
		return (
			pos.x >= 0 &&
			pos.x < this.width &&
			pos.y >= 0 &&
			pos.y < this.height &&
			isAdjacentV2(this._playerPosition, pos)
		);
	}

	public movePlayer(pos: V2) {
		if (!this.isValidMove(pos) || this._gameOver) return false;

		this._moves++;
		this._playerPosition = pos;
		const tile = this._tiles[pos.y][pos.x];
		if (tile === TileEnum.Gold) this._playerHasGold = true;
		if (tile !== TileEnum.Empty) this._gameOver = true;
		return true;
	}

	constructor(width: number, height: number) {
		this._tiles = generateField(width, height);
		this._playerPosition = { x: 0, y: 0 };
		this._playerHasGold = false;
		this._gameOver = false;
		this._moves = 0;
	}
}
