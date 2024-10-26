export default function exportToCsv<T extends Record<string, unknown>>({
    data,
    filename,
    separator = ",",
    hasHeader = true,
}: {
    data: T[];
    filename: string;
    separator?: string;
    hasHeader?: boolean;
}) {
    const header = hasHeader ? Object.keys(data[0]).join(separator) + "\n" : "";
    const rows = data.map((row) => Object.values(row).join(separator)).join("\n");
    const csv = header + rows;
    Deno.writeTextFile(filename, csv);
}
