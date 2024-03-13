<script lang="ts">
	export let show: boolean = false;
</script>

{#if show}
	<button
		class="absolute top-0 left-0 right-0 bottom-0 bg-gray-500/40 flex justify-center items-center cursor-default"
		on:click={() => (show = false)}
	>
		<button
			class="absolute top-4 right-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
			on:click={() => (show = false)}>Hide</button
		>
		<div class="max-w-[50vw] space-y-4">
			<div class="p-3 rounded-md bg-gray-100">
				<h2 class="text-center text-lg font-semibold">Tutorial</h2>
			</div>
			<div class="p-3 rounded-md bg-gray-100">
				<div class="flex gap-2 mt-1">
					<img src="/tiles/player.png" alt="Breeze" />
					<span>Player</span>
				</div>
				<p class="mt-4">Player must find the treasure and avoid the wumpus and pits.</p>
			</div>
			<div class="p-3 rounded-md bg-gray-100">
				<div class="flex gap-2 mt-1">
					<img src="/perceptions/breeze.png" alt="Breeze" />
					<span>Breeze</span>
				</div>
				<p class="mt-4">Breeze means that there is a pit in one of the adjacent cells.</p>
			</div>
			<div class="p-3 rounded-md bg-gray-100">
				<div class="flex gap-2 mt-1">
					<img src="/perceptions/stench.png" alt="Stench" />
					<span>Stench</span>
				</div>
				<p class="mt-4">Stench means that there is a wumpus in one of the adjacent cells.</p>
			</div>
			<div class="p-3 rounded-md bg-gray-100">
				<div class="flex gap-2 mt-1">
					<img src="/perceptions/glitter.png" alt="Treasure" />
					<span>Glitter</span>
				</div>
				<p class="mt-4">Glitter means that there is treasure in the current cell.</p>
			</div>
		</div>
	</button>
{/if}

<style>
	img {
		width: 2rem;
		height: 2rem;
	}
</style>
