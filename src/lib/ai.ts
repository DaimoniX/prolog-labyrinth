import { PerceptionEnum } from './game';

export type AiTileData = {
	w: number;
	p: number;
	g: number;
};

export function perceptionsToTileData(perceptions: PerceptionEnum[]): AiTileData {
	return {
		w: perceptions.includes(PerceptionEnum.Stench) ? 0.25 : 0,
		p: perceptions.includes(PerceptionEnum.Breeze) ? 0.25 : 0,
		g: perceptions.includes(PerceptionEnum.Glitter) ? 0.25 : 0
	};
}
