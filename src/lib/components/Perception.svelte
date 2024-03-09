<script lang="ts">
	import { PerceptionEnum } from "$lib/game";

    export let perception : PerceptionEnum;

    const src : {
        [key in PerceptionEnum]: string;
    } = {
        [PerceptionEnum.None]: "",
        [PerceptionEnum.Breeze]: "perceptions/breeze.png",
        [PerceptionEnum.Stench]: "perceptions/stench.png",
        [PerceptionEnum.Glitter]: "perceptions/glitter.png"
    };
</script>

<div class="w-6 h-6">
    <img draggable="false" src={src[perception]} alt="Breeze" class="w-full h-full" />
</div>