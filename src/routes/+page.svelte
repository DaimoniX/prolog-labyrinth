<script lang="ts">
	import Tile from '$lib/components/Tile.svelte';
	import { Game } from '$lib/game';
	import { type V2, isAdjacentV2, equalsV2 } from '$lib/v2';

	let width = 3;
	let height = 3;
	let cheat = false;
	let displayKnowledge = true;
	let game = new Game(width, height);

	$: create(width, height);

	function movePlayer(pos: V2) {
		if (!game.movePlayer(pos)) return;
		game = game;
	}

	function create(width: number, height: number) {
		game = new Game(width, height);
	}

	function reset() {
		create(width, height);
	}
</script>

<div class="flex gap-4">
	<div class="relative bg-gray-50 select-none">
		<table class="w-full h-full">
			{#each game.field as row, y}
				<tr>
					{#each row as cell, x}
						<td
							class="cell border border-black"
							class:!bg-blue-200={isAdjacentV2(game.playerPosition, { x, y })}
							on:click={() => isAdjacentV2(game.playerPosition, { x, y }) && movePlayer({ x, y })}
						>
							{#if equalsV2(game.playerPosition, { x, y }) || cheat || game.gameOver}
								<Tile
									{cell}
									player={equalsV2(game.playerPosition, { x, y })}
									perceptions={game.perceptions}
								/>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</table>
		{#if game.gameOver}
			<div
				class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
			>
				<div class="bg-white p-4 rounded-lg">
					{#if game.playerHasGold}
						You won in {game.moves} moves!
					{:else}
						You lost!
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<label>
			<span class="inline-block w-16">Width:</span>
			<input bind:value={width} type="number" min="1" max="20" placeholder="Width" />
		</label>
		<label>
			<span class="inline-block w-16">Height:</span>
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
