<script lang="ts">
	import type { AiTileData } from '$lib/ai/ai';

	export let knowledge: AiTileData[][];
</script>

<table class="absolute top-0 left-0 w-full h-full pointer-events-none">
	{#each knowledge as row}
		<tr>
			{#each row as cell}
				<td class="cell">
					<div class="w-full h-full text-left text-xs">
						W: {cell.w}
						<br />
						P: {cell.p}
						<br />
						G: {cell.g}
					</div>
				</td>
			{/each}
		</tr>
	{/each}
</table>
