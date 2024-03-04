<script lang="ts">
	let width = 8;
	let height = 8;

    $: width = Math.min(20, Math.max(1, width));
    $: height = Math.min(20, Math.max(1, height));
</script>

<div>
	<div>
		{#each Array.from({ length: height }, (_, i) => i) as row}
			<div class="flex">
				{#each Array.from({ length: width }, (_, i) => i) as col}
					<div class="w-10 h-10 border border-black m-0.5"></div>
				{/each}
			</div>
		{/each}
	</div>

	<div>
        <label for="width">
            Width:
            <input bind:value={width} type="number" min="1" max="20" placeholder="Width" />
        </label>
        <label for="height">
            Height:
            <input bind:value={height} type="number" min="1" max="20" placeholder="Height" />
        </label>
	</div>
</div>
