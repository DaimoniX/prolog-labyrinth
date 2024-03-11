<script lang="ts">
	import { PerceptionEnum, TileEnum } from '../game';
	import Perception from './Perception.svelte';

	export let perceptions: PerceptionEnum[];
	export let cell: TileEnum;
	export let player: boolean;
</script>

<div class="h-full w-full relative p-2">
	{#if player}
		<img
			draggable="false"
			src="tiles/player.png"
			alt="Player"
			class="top-0 left-0 p-4 mt-2 absolute w-full h-full"
		/>
		<div class="absolute flex">
			{#each perceptions as perception}
				<Perception {perception} />
			{/each}
		</div>
	{/if}
	{#if cell === TileEnum.Wumpus}
		<img draggable="false" src="tiles/wumpus.png" alt="Wumpus" class="w-full h-full" />
	{:else if cell === TileEnum.Gold}
		<img draggable="false" src="tiles/gold.png" alt="Gold" class="w-full h-full" />
	{:else if cell === TileEnum.Pit}
		<img draggable="false" src="tiles/pit.png" alt="Pit" class="w-full h-full" />
	{:else}
		<div />
	{/if}
</div>
