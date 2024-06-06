import {describe, expect, test} from "vitest";
import {findModes} from "./mode";

describe("Modes", () => {
    test("Empty Array", () => {
        expect(findModes([])).toEqual([])
    })

    test("Single Element Array", () => {
        expect(findModes([1])).toEqual([1])
    })

    test("All Unique Elements", () => {
        expect(findModes([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5])
    })

    test("Multiple Modes", () => {
        expect(findModes([1, 2, 2, 3, 3, 4])).toEqual([2, 3])
    })

    test("Single Mode", () => {
        expect(findModes([1, 1, 2, 3, 4])).toEqual([1])
    })

    test("All Same Elements", () => {
        expect(findModes([2, 2, 2, 2])).toEqual([2])
    })

    test("Mixed Positive and Negative Numbers", () => {
        expect(findModes([-1, 1, -1, 1, 2])).toEqual([-1, 1])
    })

    test("Zeroes", () => {
        expect(findModes([0, 0, 1, 1, 2])).toEqual([0, 1])
    })

    test("Decimals/Floats", () => {
        expect(findModes([1.5, 1.5, 2.5, 3.5])).toEqual([1.5])
    })

    test("Large Array", () => {
        const largeArray = Array.from({length: 1000}, (_, i) => i + 1)
        expect(findModes(largeArray)).toEqual(largeArray)
    })
})