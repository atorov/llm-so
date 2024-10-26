/**
 * Sorts an array of objects by specified properties and order.
 *
 * @template T - The type of the objects in the array.
 * @param {T[]} objects - The array of objects to be sorted.
 * @param {(keyof T)[]} properties - The properties to sort by, in order of precedence.
 * @param {("asc" | "desc")[]} [order=[]] - The order for each property, either "asc" for ascending or "desc" for descending. Defaults to ascending if not specified.
 * @returns {T[]} The sorted array of objects.
 */
export default function sortObjectsByProperties<T>(
    objects: T[],
    properties: (keyof T)[],
    order: ("asc" | "desc")[] = []
) {
    return objects.sort((a, b) => {
        for (const [index, property] of properties.entries()) {
            if (a[property] > b[property]) {
                if (!order[index] || order[index] === "asc") return 1;
                return -1;
            }
            if (a[property] < b[property]) {
                if (!order[index] || order[index] === "asc") return -1;
                return 1;
            }
        }
        return 0;
    });
}
