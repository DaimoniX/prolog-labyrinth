import type { Game } from "$lib/game";
import { createMatrix } from "$lib/utils";
import type { V2 } from "$lib/v2";
import type { AiTileData } from "./ai";

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
        this._visited.add(`${v.x},${v.y}`);
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
