import calcMedian from "./calc_median.ts";
import exportToCsv from "./export_to_csv.ts";
import getParamsNumber from "./get_params_num.ts";
import sortObjectsByProperties from "./sort_objects_by_properties.ts";
import type { Result } from "./types.ts";

const results = JSON.parse(await Deno.readTextFile("results.txt")) as Result[];
// console.log("::: Results:", results);

const models = [...new Set(results.map((result) => result.model))];
console.log("::: models:", models);

const params = [...new Set(models.map(getParamsNumber))].toSorted((a, b) => a - b);
console.log("::: params:", params);

const difficultyLevels = [...new Set(results.map((result) => result.difficultyLevel))].toSorted((a, b) => a - b);
console.log("::: difficultyLevels:", difficultyLevels);

type DataEntry = {
    model: string;
    params: number;
    count: number;
    totalDuration: number;
    difficultyLevel: number;
    totalHasValidJsonFormat: number;
    totalHasValidSchema: number;
    totalHasValidData: number;
    totalAbsoluteScore: number;
    totalRelativeScore: number;
    totalIsSuccessful: number;
    averageDuration: number;
    averageHasValidJsonFormat: number;
    averageHasValidSchema: number;
    averageHasValidData: number;
    averageAbsoluteScore: number;
    averageRelativeScore: number;
    averageIsSuccessful: number;
    medianDuration: number;
    medianAbsoluteScore: number;
    medianRelativeScore: number;
};

type DataModelEntry = Omit<DataEntry & { difficultyLevels: Record<number, DataEntry> }, "difficultyLevel">;

type Data = Record<string, DataModelEntry>;

const data: Data = {};
for (const model of models) {
    if (!data[model]) {
        const modelResults = results.filter((result) => result.model === model);

        const durationItems = modelResults.map((result) => result.duration).filter(Boolean) as NonNullable<
            Result["duration"]
        >[];
        const hasValidJsonFormatItems = modelResults.map((result) => result.hasValidJsonFormat);
        const hasValidSchemaItems = modelResults.map((result) => result.hasValidSchema);
        const hasValidDataItems = modelResults.map((result) => result.hasValidData);
        const absoluteScoreItems = modelResults.map((result) => result.absoluteScore);
        const relativeScoreItems = modelResults.map((result) => result.relativeScore);
        const isSuccessfulItems = modelResults.map((result) => result.isSuccessful);

        data[model] = {
            model: model,
            params: getParamsNumber(model),
            count: modelResults.length,

            totalDuration: durationItems.reduce((acc, duration) => acc + duration, 0),
            totalHasValidJsonFormat: hasValidJsonFormatItems.filter(Boolean).length,
            totalHasValidSchema: hasValidSchemaItems.filter(Boolean).length,
            totalHasValidData: hasValidDataItems.filter(Boolean).length,
            totalAbsoluteScore: absoluteScoreItems.reduce((acc, score) => acc + score, 0),
            totalRelativeScore: relativeScoreItems.reduce((acc, score) => acc + score, 0),
            totalIsSuccessful: isSuccessfulItems.filter(Boolean).length,

            averageDuration: 0,
            averageHasValidJsonFormat: 0,
            averageHasValidSchema: 0,
            averageHasValidData: 0,
            averageAbsoluteScore: 0,
            averageRelativeScore: 0,
            averageIsSuccessful: 0,

            medianDuration: 0,
            medianAbsoluteScore: 0,
            medianRelativeScore: 0,

            difficultyLevels: {},
        };

        data[model].averageDuration = data[model].totalDuration / data[model].count;
        data[model].averageHasValidSchema = data[model].totalHasValidSchema / data[model].count;
        data[model].averageHasValidData = data[model].totalHasValidData / data[model].count;
        data[model].averageAbsoluteScore = data[model].totalAbsoluteScore / data[model].count;
        data[model].averageRelativeScore = data[model].totalRelativeScore / data[model].count;
        data[model].averageIsSuccessful = data[model].totalIsSuccessful / data[model].count;

        data[model].medianDuration = calcMedian(durationItems);
        data[model].medianAbsoluteScore = calcMedian(absoluteScoreItems);
        data[model].medianRelativeScore = calcMedian(relativeScoreItems);

        data[model].difficultyLevels = difficultyLevels.reduce((acc, difficultyLevel) => {
            const dlModelResults = modelResults.filter((result) => result.difficultyLevel === difficultyLevel);

            acc[difficultyLevel] = {
                model,
                params: getParamsNumber(model),
                count: dlModelResults.length,
                difficultyLevel,

                totalDuration: dlModelResults.reduce((acc, result) => acc + (result.duration ?? 0), 0),
                totalHasValidJsonFormat: dlModelResults.filter((result) => result.hasValidJsonFormat).length,
                totalHasValidSchema: dlModelResults.filter((result) => result.hasValidSchema).length,
                totalHasValidData: dlModelResults.filter((result) => result.hasValidData).length,
                totalAbsoluteScore: dlModelResults.reduce((acc, result) => acc + result.absoluteScore, 0),
                totalRelativeScore: dlModelResults.reduce((acc, result) => acc + result.relativeScore, 0),
                totalIsSuccessful: dlModelResults.filter((result) => result.isSuccessful).length,

                averageDuration: 0,
                averageHasValidJsonFormat: 0,
                averageHasValidSchema: 0,
                averageHasValidData: 0,
                averageAbsoluteScore: 0,
                averageRelativeScore: 0,
                averageIsSuccessful: 0,

                medianDuration: 0,
                medianAbsoluteScore: 0,
                medianRelativeScore: 0,
            };

            acc[difficultyLevel].averageDuration = acc[difficultyLevel].totalDuration / acc[difficultyLevel].count;
            acc[difficultyLevel].averageHasValidJsonFormat =
                acc[difficultyLevel].totalHasValidJsonFormat / acc[difficultyLevel].count;
            acc[difficultyLevel].averageHasValidSchema =
                acc[difficultyLevel].totalHasValidSchema / acc[difficultyLevel].count;
            acc[difficultyLevel].averageHasValidData =
                acc[difficultyLevel].totalHasValidData / acc[difficultyLevel].count;
            acc[difficultyLevel].averageAbsoluteScore =
                acc[difficultyLevel].totalAbsoluteScore / acc[difficultyLevel].count;
            acc[difficultyLevel].averageRelativeScore =
                acc[difficultyLevel].totalRelativeScore / acc[difficultyLevel].count;
            acc[difficultyLevel].averageIsSuccessful =
                acc[difficultyLevel].totalIsSuccessful / acc[difficultyLevel].count;

            acc[difficultyLevel].medianDuration = calcMedian(
                dlModelResults.map((result) => result.duration).filter(Boolean) as NonNullable<Result["duration"]>[]
            );
            acc[difficultyLevel].medianAbsoluteScore = calcMedian(dlModelResults.map((result) => result.absoluteScore));
            acc[difficultyLevel].medianRelativeScore = calcMedian(dlModelResults.map((result) => result.relativeScore));

            return acc;
        }, {} as Record<number, DataEntry>);
    }
}
// console.log("::: Data:", data);

const resultEntries = Object.values(data).reduce(
    (acc, entry) => [...acc, ...Object.values(entry.difficultyLevels)],
    [] as DataEntry[]
);
// console.log("::: resultEntries:", resultEntries);

// --------------------------------------------------------------------------------------------

// + score >, params <, duration <
const performanceScoresAcrossModels = sortObjectsByProperties(
    Object.values(data),
    ["totalRelativeScore", "params", "medianDuration"],
    ["desc"]
).map((entry) => ({
    model: entry.model,
    score: entry.totalRelativeScore,
    params: entry.params,
    duration: entry.medianDuration,
}));
// console.log("::: performanceScoresAcrossModels:", performanceScoresAcrossModels);
exportToCsv({
    data: performanceScoresAcrossModels,
    filename: "stats_performance_scores_across_models.csv",
    separator: "\t",
});

// --------------------------------------------------------------------------------------------

// - score, params, duration
// const modelsTotalRelativeScoreVsParams = sortObjectsByProperties(Object.values(data), [
//     "totalRelativeScore",
//     "params",
//     "totalDuration",
// ]).map((entry) => ({
//     model: entry.model,
//     score: entry.totalRelativeScore,
//     params: entry.params,
//     duration: entry.totalDuration,
// }));
// console.log("::: modelsTotalRelativeScoreVsParams:", modelsTotalRelativeScoreVsParams);

// - score, duration, params
// const modelsTotalRelativeScoreVsDuration = sortObjectsByProperties(Object.values(data), [
//     "totalRelativeScore",
//     "totalDuration",
//     "params",
// ]).map((entry) => ({
//     model: entry.model,
//     score: entry.totalRelativeScore,
//     params: entry.params,
//     duration: entry.totalDuration,
// }));
// console.log("::: modelsTotalRelativeScoreVsDuration:", modelsTotalRelativeScoreVsDuration);

// √ params, score, duration
const modelPerformanceVsParameterCount = sortObjectsByProperties(Object.values(data), [
    "params",
    "totalRelativeScore",
    "medianDuration",
]).map((entry) => ({
    model: entry.model,
    score: entry.totalRelativeScore,
    params: entry.params,
    duration: entry.medianDuration,
}));
// console.log("::: modelPerformanceVsParameterCount:", modelPerformanceVsParameterCount);
exportToCsv({
    data: modelPerformanceVsParameterCount,
    filename: "stats_model_performance_vs_parameter_count.csv",
    separator: "\t",
});

// √ params, duration, score
const modelResponseTimeVsParameterCount = sortObjectsByProperties(Object.values(data), [
    "params",
    "medianDuration",
    "totalRelativeScore",
]).map((entry) => ({
    model: entry.model,
    score: entry.totalRelativeScore,
    params: entry.params,
    duration: entry.medianDuration,
}));
// console.log("::: modelResponseTimeVsParameterCount:", modelResponseTimeVsParameterCount);
exportToCsv({
    data: modelResponseTimeVsParameterCount,
    filename: "stats_model_response_time_vs_parameter_count.csv",
    separator: "\t",
});

// √ duration, score, params
const modelPerformanceVsResponseTime = sortObjectsByProperties(Object.values(data), [
    "medianDuration",
    "totalRelativeScore",
    "params",
]).map((entry) => ({
    model: entry.model,
    score: entry.totalRelativeScore,
    params: entry.params,
    duration: entry.medianDuration,
}));
// console.log("::: modelPerformanceVsResponseTime:", modelPerformanceVsResponseTime);
exportToCsv({
    data: modelPerformanceVsResponseTime,
    filename: "stats_model_performance_vs_response_time.csv",
    separator: "\t",
});

// - duration, params, score
// const modelsDurationVsParams = sortObjectsByProperties(Object.values(data), [
//     "totalDuration",
//     "params",
//     "totalRelativeScore",
// ]).map((entry) => ({
//     model: entry.model,
//     duration: entry.totalDuration,
//     params: entry.params,
//     score: entry.totalRelativeScore,
// }));
// console.log("::: modelsDurationVsParams:", modelsDurationVsParams);

// --------------------------------------------------------------------------------------------

// score, params, duration, dl
// score, params, dl, duration
// score, duration, params, dl
// score, duration, dl, params
// score, dl, params, duration
// score, dl, duration, params
// params, score, duration, dl

// √ params, score, dl, duration
const dlPerformanceVsParameterCount = sortObjectsByProperties(resultEntries, [
    "params",
    "totalRelativeScore",
    "difficultyLevel",
    "medianDuration",
]).map((entry) => ({
    model: entry.model,
    score: entry.totalRelativeScore,
    params: entry.params,
    duration: entry.medianDuration,
    difficultyLevel: entry.difficultyLevel,
}));
// console.log("::: dlPerformanceVsParameterCount:", dlPerformanceVsParameterCount);
exportToCsv({
    data: dlPerformanceVsParameterCount,
    filename: "stats_dl_performance_vs_parameter_count.csv",
    separator: "\t",
});

// -------------

// params, duration, score, dl
// params, duration, dl, score
// params, dl, score, duration
// params, dl, duration, score
// duration, score, params, dl

// √ duration, score, dl, params
const dlPerformanceVsResponseTime = sortObjectsByProperties(resultEntries, [
    "medianDuration",
    "totalRelativeScore",
    "difficultyLevel",
    "params",
]).map((entry) => ({
    model: entry.model,
    score: entry.totalRelativeScore,
    params: entry.params,
    duration: entry.medianDuration,
    difficultyLevel: entry.difficultyLevel,
}));
// console.log("::: dlPerformanceVsResponseTime:", dlPerformanceVsResponseTime);
exportToCsv({
    data: dlPerformanceVsResponseTime,
    filename: "stats_dl_performance_vs_response_time.csv",
    separator: "\t",
});

// duration, params, score, dl
// duration, params, dl, score
// duration, dl, score, params
// duration, dl, params, score
// dl, score, params, duration
// dl, score, duration, params
// dl, params, score, duration
// dl, params, duration, score
// dl, duration, score, params
// dl, duration, params, score
