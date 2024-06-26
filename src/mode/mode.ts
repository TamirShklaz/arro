export function findModes(numbers: number[]): number[] {
    if (numbers.length === 0) return []

    const freqMap = new Map<number, number>()
    let maxFreq = 0
    for (const num of numbers) {
        const freq = freqMap.get(num)
        if (freq) {
            freqMap.set(num, freq + 1)
        } else {
            freqMap.set(num, 1)
        }
        if (freqMap.get(num)! > maxFreq) {
            maxFreq = freqMap.get(num)!
        }
    }
    const modes: number[] = []
    for (const [key, val] of freqMap) {
        if (val === maxFreq) {
            modes.push(key)
        }
    }
    return modes
}

