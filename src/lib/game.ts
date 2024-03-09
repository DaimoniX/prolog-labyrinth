import { createZeroMatrix } from "./utils";
import { getAdjacentV2, type V2 } from "./v2";

export enum TileEnum {
    Empty = 0,
    Pit = 1,
    Wumpus = 2,
    Gold = 3,
}

export enum PerceptionEnum {
    None = 0,
    Breeze = 1,
    Stench = 2,
    Glitter = 3,
}

function pickRandomPosition(width: number, height: number) : V2 {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return { x, y };
}

function pickRandomPositionWithExclusions(width: number, height: number, exclusions: V2[]) {
    let position = pickRandomPosition(width, height);
    while (exclusions.some(e => e.x === position.x && e.y === position.y))
        position = pickRandomPosition(width, height);
    return position;
}

function setTile(tiles: TileEnum[][], pos: V2, value: TileEnum) {
    tiles[pos.y][pos.x] = value;
}

export function getPerceptions(tiles: TileEnum[][], pos: V2) : PerceptionEnum[] {
    const set = new Set<PerceptionEnum>();
    for (const relPos of getAdjacentV2(pos)) {
        const { x, y } = relPos;
        if (x < 0 || x >= tiles[0].length || y < 0 || y >= tiles.length)
            continue;
        const tile = tiles[y][x];
        if (tile === TileEnum.Pit)
            set.add(PerceptionEnum.Breeze);
        if (tile === TileEnum.Wumpus)
            set.add(PerceptionEnum.Stench);
        if (tile === TileEnum.Gold)
            set.add(PerceptionEnum.Glitter);
    }
    return Array.from(set).sort((a, b) => a - b);
}

export function generateField(width: number, height: number) : TileEnum[][] {
    if(width < 3 || height < 3)
        throw new Error('Field must be at least 3x3');
	const tiles = createZeroMatrix(width, height);

    const pitCount = Math.floor((width * height) / 8);

    const filledTiles : V2[] = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
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
    private tiles: TileEnum[][];
    private playerPos: V2;
    private playerHasGold: boolean;
    private playerHasArrow: boolean;

    public getTiles() {
        return this.tiles;
    }

    public getPlayerPos() {
        return this.playerPos;
    }

    public getPlayerHasGold() {
        return this.playerHasGold;
    }

    public getPlayerHasArrow() {
        return this.playerHasArrow;
    }

    public getPerceptions() {
        return getPerceptions(this.tiles, this.playerPos);
    }

    public movePlayer(pos: V2) {
        if(!getAdjacentV2(this.playerPos).some(p => p.x === pos.x && p.y === pos.y))
            throw new Error('Invalid move');
        this.playerPos = pos;
    }

    constructor(width: number, height: number) {
        this.tiles = generateField(width, height);
        this.playerPos = { x: 0, y: 0 };
        this.playerHasGold = false;
        this.playerHasArrow = true;
    }
}
