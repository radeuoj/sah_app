export interface Vector2 {
    x: number;
    y: number;
}

export function vec2(x: number, y: number): Vector2 {
    return { x, y };
}

export function vec2ToChessNotation(vec: Vector2): string {
    let result = "";

    switch (vec.x) {
        case 1: result += "a"; break;
        case 2: result += "b"; break;
        case 3: result += "c"; break;
        case 4: result += "d"; break;
        case 5: result += "e"; break;
        case 6: result += "f"; break;
        case 7: result += "g"; break;
        case 8: result += "h"; break;
    }

    result += vec.y.toString();

    return result;
}