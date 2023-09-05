export class BsMath {
    static isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    static precicse_lerp(a, b, f) {
        return a * (1.0 - f) + (b * f);
    }

    static lerp(a, b, f) {
        return a + f * (b - a);
    }
}