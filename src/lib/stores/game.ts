import {writable} from 'svelte/store';

export type Player = 'Red' | 'Yellow' | null;
export const rows = 6;
export const cols = 7;

// Initialize the board
export const board = writable<Player[][]>(
    Array.from({length: rows}, () => Array(cols).fill(null))
);

export const currentPlayer = writable<Player>('Red');
export const winner = writable<Player>(null);

/**
 * Checks if the current player has won the game.
 * @param board - The current state of the game board.
 * @param row - The row index of the last placed piece.
 * @param col - The column index of the last placed piece.
 * @param player - The player to check for a win condition.
 * @returns `true` if the player has won, otherwise `false`.
 */
function checkWinner(board: Player[][], row: number, col: number, player: Player): boolean {
    if (!player) return false;

    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal \
        [[1, -1], [-1, 1]], // Diagonal /
    ];

    for (const [[dx1, dy1], [dx2, dy2]] of directions) {
        let count = 1;

        for (const [dx, dy] of [[dx1, dy1], [dx2, dy2]]) {
            let r = row + dx;
            let c = col + dy;

            while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
                count++;
                r += dx;
                c += dy;
            }
        }

        if (count >= 4) return true;
    }

    return false;
}

/**
 * Handles the logic for dropping a piece into the specified column.
 * Updates the board, checks for a winner, and switches the current player.
 * @param col - The column index where the piece is dropped.
 */
export function dropPiece(col: number): void {
    board.update((b) => {
        for (let row = rows - 1; row >= 0; row--) {
            if (!b[row][col]) {
                // Get the current player
                let player: Player | null = null;
                currentPlayer.subscribe((value) => (player = value))();

                // Place the piece
                b[row][col] = player;

                // Check for a winner
                if (checkWinner(b, row, col, player!)) {
                    winner.set(player);
                } else {
                    // Switch the current player
                    currentPlayer.set(player === 'Red' ? 'Yellow' : "Red");
                }

                break;
            }
        }
        return b;
    });
}

/**
 * Resets the game to its initial state.
 */
export function resetGame(): void {
    board.set(Array.from({length: rows}, () => Array(cols).fill(null)));
    currentPlayer.set('Red');
    winner.set(null);
}
