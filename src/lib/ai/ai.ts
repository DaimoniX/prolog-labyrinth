import { PerceptionEnum } from '../game';

export type AiTileData = {
	wumpus: number;
	pit: number;
	gold: number;
	empty?: boolean;
};

export function perceptionsToTileData(perceptions: PerceptionEnum[]): AiTileData {
	return {
		wumpus: perceptions.includes(PerceptionEnum.Stench) ? 0.25 : 0,
		pit: perceptions.includes(PerceptionEnum.Breeze) ? 0.25 : 0,
		gold: perceptions.includes(PerceptionEnum.Glitter) ? 0.25 : 0
	};
}
