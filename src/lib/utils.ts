export function createZeroMatrix(width: number, height: number) : number[][] {
    return createMatrix(width, height, 0);
}

export function createMatrix<T>(width: number, height: number, value: T) : T[][] {
    return new Array(height).fill(0).map(() => new Array(width).fill(value));
}
