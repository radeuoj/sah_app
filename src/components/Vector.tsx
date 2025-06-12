export class Vector2 {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }
};

export function gamePosToScreenPos(position: Vector2, playingAsWhite: boolean): Vector2 {
    if (playingAsWhite) return new Vector2(position.x - 1, 8 - position.y);
    else return new Vector2(8 - position.x, position.y - 1);
}

export function screenPosToGamePos(position: Vector2, playingAsWhite: boolean): Vector2 {
    if (playingAsWhite) return new Vector2(position.x + 1, 8 - position.y);
    else return new Vector2(8 - position.x, position.y + 1);
    // return new Vector2(Math.abs(position.x - 1 - +playingAsWhite * 7), Math.abs(position.y - 1 - +!playingAsWhite * 7));
}