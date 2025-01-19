<script lang="ts">
    import {board, currentPlayer, winner, dropPiece, resetGame} from '$lib/stores/game';
    import type {Writable} from 'svelte/store';

    // Define the type for a single cell and the board
    type Cell = 'Red' | 'Yellow' | null;
    type Board = Cell[][];

    // Reactive store subscriptions
    let boardData: Board; // Explicitly typed as a 2D array of cells
    $: board.subscribe((data) => (boardData = data));

    $: $currentPlayer;
    $: $winner;
</script>

<h1 class="text-3xl font-bold text-center mt-8">Connect 4</h1>

<div class="text-center my-4">
    {#if $winner}
        <h2 class="text-2xl font-semibold text-green-500">{$winner} wins!</h2>
    {:else}
        <h2 class="text-xl font-medium">Current Player:
            {#if $currentPlayer === 'Red'}
                <span class="text-red-500">Red</span>
            {:else if $currentPlayer === 'Yellow'}
                <span class="text-yellow-500">Yellow</span>
            {/if}
        </h2>
    {/if}
</div>

<div class="grid grid-cols-7 gap-2 mx-auto w-max mt-4">
    {#each boardData as row, rowIndex}
        {#each row as cell, colIndex}
            <div
                    class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                    class:red={cell === 'Red'}
                    class:yellow={cell === 'Yellow'}
                    on:click={() => !$winner && dropPiece(colIndex)}
            >
            </div>
        {/each}
    {/each}
</div>

<div class="text-center mt-8">
    <button
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            on:click={resetGame}
    >
        Restart Game
    </button>
</div>

<style>
    .red {
        background-color: #f87171; /* Tailwind Red-400 */
    }

    .yellow {
        background-color: #facc15; /* Tailwind Yellow-400 */
    }
</style>
