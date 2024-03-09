<script lang="ts">
	import { perceptionsToTileData, type AiTileData } from '$lib/ai';
	import Knowledge from '$lib/components/Knowledge.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { generateField, getPerceptions } from '$lib/game';
	import { createMatrix } from '$lib/utils';
	import { type V2, isAdjacentV2, equalsV2, getAdjacentV2Bound } from '$lib/v2';

	let width = 4;
	let height = 4;
	let cheat = true;
	let displayKnowledge = true;
	let playerPosition = { x: 0, y: 0 };
	let visited: V2[] = [{ x: 0, y: 0 }];
	let field = generateField(width, height);
	let perceptions = getPerceptions(field, playerPosition);
	let knowledge = createMatrix<AiTileData>(width, height, { w: 0, p: 0, g: 0 });
	let result = '';

	$: create(width, height);

	function movePlayer(pos: V2) {
		if (!isAdjacentV2(playerPosition, pos)) return;
		playerPosition = pos;
		perceptions = getPerceptions(field, playerPosition);

		if (visited.some((p) => equalsV2(p, pos))) return;

		visited = [...visited, pos];
		knowledge[pos.y][pos.x] = { w: 0, p: 0, g: 0 };

		const adjacents = getAdjacentV2Bound(pos, width, height).filter(
			(adj) => !visited.some((v) => equalsV2(v, adj))
		);

		if (perceptions.length === 0) {
			for (const adjacent of adjacents) knowledge[adjacent.y][adjacent.x] = { w: 0, p: 0, g: 0 };
		} else {
			const aiTileData = perceptionsToTileData(perceptions);
			for (const adjacent of adjacents) {
				const cellData = knowledge[adjacent.y][adjacent.x];
				const newCellData: AiTileData = {
					w: cellData.w + aiTileData.w,
					p: cellData.p + aiTileData.p,
					g: cellData.g + aiTileData.g
				};
				knowledge[adjacent.y][adjacent.x] = newCellData;
			}
		}
	}

	function create(width: number, height: number) {
		visited = [{ x: 0, y: 0 }];
		field = generateField(width, height);
		playerPosition = { x: 0, y: 0 };
		perceptions = getPerceptions(field, playerPosition);
		knowledge = createMatrix<AiTileData>(width, height, { w: 0, p: 0, g: 0 });
	}

	function reset() {
		create(width, height);
	}
</script>

<div class="flex gap-4">
	<div class="relative bg-gray-50 select-none">
		<table class="w-full h-full">
			{#each field as row, y}
				<tr>
					{#each row as cell, x}
						<td
							class="cell border border-black m-0.5"
							class:bg-gray-200={visited.some((v) => equalsV2(v, { x, y }))}
							class:!bg-blue-200={isAdjacentV2(playerPosition, { x, y })}
							on:click={() => isAdjacentV2(playerPosition, { x, y }) && movePlayer({ x, y })}
						>
							{#if equalsV2(playerPosition, { x, y }) || cheat}
								<Tile {cell} player={equalsV2(playerPosition, { x, y })} {perceptions} />
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</table>
		{#if displayKnowledge}
			<Knowledge knowledge={knowledge} />
		{/if}
		{#if result}
			<div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
				<div class="bg-white p-4 rounded-lg">
					{result}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<label>
			Width:
			<input bind:value={width} type="number" min="1" max="20" placeholder="Width" />
		</label>
		<label>
			Height:
			<input bind:value={height} type="number" min="1" max="20" placeholder="Height" />
		</label>
		<label>
			Cheat:
			<input bind:checked={cheat} type="checkbox" />
		</label>
		<label>
			Display Knowledge:
			<input bind:checked={displayKnowledge} type="checkbox" />
		</label>
		<button
			class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
			on:click={reset}
		>
			New Game
		</button>
	</div>
</div>
