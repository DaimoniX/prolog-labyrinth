<script lang="ts">
	import type { AiTileData } from '$lib/ai/ai';

	export let visited: string[];
	export let knowledge: AiTileData[][];
</script>

<table class="absolute top-0 left-0 w-full h-full pointer-events-none">
	{#each knowledge as row, y}
		<tr>
			{#each row as cell, x}
				<td class="cell" class:visited-tile={visited.includes(`${x},${y}`)}>
					<div class="w-full h-full text-left text-xs">
						W: {cell.wumpus}
						<br />
						P: {cell.pit}
						<br />
						G: {cell.gold}
						<br />
						E: {cell.empty === undefined ? '?' : cell.empty}
					</div>
				</td>
			{/each}
		</tr>
	{/each}
</table>

<style lang="postcss">
	.visited-tile {
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>
