let content = "";
for await (const dirEntry of Deno.readDir(".")) {
    if (dirEntry.isFile && dirEntry.name.startsWith("results_") && dirEntry.name.endsWith(".txt")) {
        content += await Deno.readTextFile(dirEntry.name);
    }
}
const lines = content.split("\n").filter((line) => line.length);
content = `[${lines.join(",")}]`;
const data = JSON.parse(content);
console.log("::: Combined results:", data);

Deno.writeTextFile("results.txt", JSON.stringify(data));
