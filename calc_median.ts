export default function calcMedian(data: number[]) {
    const sortedData = data.sort((a, b) => a - b);
    const length = sortedData.length;
    if (length % 2 === 0) {
        const mid = length / 2;

        return (sortedData[mid - 1] + sortedData[mid]) / 2;
    }

    return sortedData[Math.floor(length / 2)];
}
