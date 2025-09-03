const ALPHABET_NUMS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function makeSlug(length = 7) {
    if (typeof length !== "number" || length < 1) length = 7;

    let alphLen = ALPHABET_NUMS.length
    let result = '';

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * alphLen)
        const char = ALPHABET_NUMS.charAt(index);
        result += char;
    }
    
    return result;
}
