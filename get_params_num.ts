/**
 * Extracts and calculates the number of parameters from a given model string.
 *
 * The model string is expected to have a format where parameters are separated by a colon (`:`).
 * If the parameter part contains an 'x', it splits the parameters and multiplies them.
 * Otherwise, it converts the parameter part directly to a number.
 *
 * @param model - The model string containing the parameters.
 * @returns The calculated number of parameters.
 */
export default function getParamsNumber(model: string) {
    const paramStr = model.split(":")[1].replace("b", "");
    if (paramStr.includes("x")) {
        const [a, b] = paramStr.split("x");
        return Number(a) * Number(b);
    }
    return Number(paramStr);
}
