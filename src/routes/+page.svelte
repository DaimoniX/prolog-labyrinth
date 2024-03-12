<script lang="ts">
	import type { AIAgent } from '$lib/ai/aiAgent';
	import { JSAgent } from '$lib/ai/js/jsAgent';
	import { PrologAgent } from '$lib/ai/prolog/prologAgent';
	import Knowledge from '$lib/components/Knowledge.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { Game } from '$lib/game';
	import type { Prolog } from '$lib/prolog/prolog';
	import { loadProlog } from '$lib/prolog/loader';
	import { type V2, isAdjacentV2, equalsV2 } from '$lib/v2';
	import { onMount } from 'svelte';

	// Game setup
	let width = 5;
	let height = 5;
	let game = new Game(width, height);
	let aiAgent: AIAgent = new JSAgent(game);

	$: create(width, height);

	function create(width: number, height: number) {
		game = new Game(width, height);
		aiAgent = createAgentByName(selectedAgent);
		nextAiTarget = aiAgent.nextTarget();
		nextAiMove = aiAgent.nextMove();
	}

	function reset() {
		create(width, height);
	}

	function movePlayer(pos: V2) {
		if (!game.movePlayer(pos)) return;
		game = game;
		aiAgent.addVisited(pos);
		nextAiTarget = aiAgent.nextTarget();
		nextAiMove = aiAgent.nextMove();
		aiAgent = aiAgent;
	}

	// UI state
	let cheat = true;
	let aiEnabled = true;
	let displayKnowledge = true;
	let autoplay = false;
	let selectedAgent = 'js';

	$: selectAgent(selectedAgent);

	let nextAiTarget = aiAgent.nextTarget();
	let nextAiMove = aiAgent.nextMove();

	function createAgentByName(agent: string) {
		if (agent === 'js') return new JSAgent(game);
		else if (agent === 'prolog') return new PrologAgent(game, prolog);
		throw new Error(`Unknown agent: ${agent}`);
	}

	function selectAgent(agent: string) {
		aiAgent = createAgentByName(agent);
		reset();
	}

	// Auto play
	let autoplayInteval: number | undefined;

	function toggleAutoPlay(enable: boolean) {
		if (enable) startAutoPlay();
		else stopAutoPlay();
	}

	function startAutoPlay() {
		stopAutoPlay();
		autoplayInteval = setInterval(() => {
			movePlayer(aiAgent.nextMove());
		}, 250);
	}

	function stopAutoPlay() {
		if (autoplayInteval) {
			clearInterval(autoplayInteval);
			autoplayInteval = undefined;
		}
	}

	$: toggleAutoPlay(autoplay);

	// Prolog
	let prolog: Prolog;

	onMount(async () => {
		prolog = await loadProlog();
	});
</script>

<div class="flex gap-4">
	<div class="relative bg-gray-50 select-none">
		<table>
			{#each game.field as row, y}
				<tr>
					{#each row as cell, x}
						<td
							class="cell border border-black"
							class:bg-blue-200={isAdjacentV2(game.playerPosition, { x, y })}
							class:!cursor-pointer={!autoplay && isAdjacentV2(game.playerPosition, { x, y })}
							class:!bg-blue-700={aiEnabled && equalsV2(nextAiTarget, { x, y })}
							class:!bg-blue-500={aiEnabled && equalsV2(nextAiMove, { x, y })}
							on:click={() =>
								!autoplay && isAdjacentV2(game.playerPosition, { x, y }) && movePlayer({ x, y })}
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
		{#if aiEnabled && displayKnowledge}
			<Knowledge knowledge={aiAgent.knowledge} visited={aiAgent.visited} />
		{/if}
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

	<div class="flex flex-col gap-2 controls">
		<h2 class="text-lg font-semibold">Controls</h2>
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
			AI:
			<input bind:checked={aiEnabled} type="checkbox" />
		</label>

		{#if aiEnabled}
			<label>
				Agent:
				<select
					bind:value={selectedAgent}
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				>
					<option value="js" selected>JS</option>
					<option value="prolog">Prolog</option>
				</select>
			</label>
			<label>
				Knowledge:
				<input bind:checked={displayKnowledge} type="checkbox" />
			</label>
			<label>
				Auto Play:
				<input bind:checked={autoplay} type="checkbox" />
			</label>
		{/if}

		<div class="flex-1"></div>
		<button
			class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
			on:click={reset}
		>
			New Game
		</button>
	</div>
</div>

<style lang="postcss">
	.controls > label {
		@apply grid grid-cols-2 items-center p-1;
	}

	.controls > label input[type='number'] {
		@apply text-center;
	}

	.controls > label select {
		@apply text-center;
	}
</style>
