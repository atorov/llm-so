# Experiment on JSON Output Generation Using Various LLM Models

## Introduction

This document summarizes an experiment evaluating JSON output generation capabilities of various LLM models.

I extend my gratitude to the creators of [**Ollama**](https://ollama.com/) and [**Deno**](https://deno.com/). Without these excellent tools, this study would not have been possible.

The findings here are presented as insights from a personal experiment rather than as formal scientific results. This summary represents observations under specific conditions and may differ significantly when applied to other projects.

## Objective

The goal of this experiment is to evaluate the ability of 28 different LLM models to generate valid, schema-compliant JSON objects from a given text prompt.

## Tested Models

The tested models include:

-   `codegemma:2b`
-   `codegemma:7b`
-   `command-r:35b`
-   `deepseek-coder-v2:16b`
-   `deepseek-coder-v2:23b`
-   `gemma2:27b`
-   `gemma2:2b`
-   `gemma2:9b`
-   `llama3.2:1b`
-   `llama3.2:3b`
-   `llava:13b`
-   `llava:34b`
-   `llava:7b`
-   `mistral:7b`
-   `mistral-nemo:12b`
-   `mistral-small:22b`
-   `mixtral:8x7b`
-   `nomotron-mini:4b`
-   `phi3.5:3b`
-   `qwen2.5:0.5b`
-   `qwen2.5:14b`
-   `qwen2.5:1.5b`
-   `qwen2.5:32b`
-   `qwen2.5:3b`
-   `qwen2.5:72b`
-   `qwen2.5:7b`
-   `starcoder2:3b`
-   `starcoder2:7b`

## Methodology

Each model received the same task: transforming input text into JSON with valid syntax and data matching a specified schema.

Each model was assessed at five levels of increasing complexity. Each level introduces a progressively more complex data structure, leading to a more intricate JSON output. The levels are:

1. **Level 1**: Input is a simple, unordered list close to a list of key-value pairs.
2. **Level 2**: A brief product description with concise and clear data points.
3. **Level 3**: Text extracted from a scanned order form via OCR, presented in a pseudo-tabular format.
4. **Level 4**: A fictional scientific project description, based on a brief article from a news source.
5. **Level 5**: A fictional podcast transcript discussing a university program in Artificial Intelligence and Robotics at the University of Advanced Technologies in Bulgaria.

## Evaluation Criteria

A total of 1400 tests were conducted to assess:

-   JSON validity.
-   JSON schema adherence.
-   Data validity.

Each model could achieve a maximum score of **1500 points** across all tests, with 0 as the minimum.

## Results Overview

### Performance Scores Across Models

![](https://github.com/atorov/llm-so/blob/master/chart_performance.png)

This chart ranks model performance by total points in descending order. In case of equal scores, models with fewer parameters are ranked higher. Six models achieved the maximum score:

1. `qwen2.5:7b`
2. `gemma2:9b`
3. `qwen2.5:14b`
4. `gemma2:27b`
5. `qwen2.5:32b`
6. `qwen2.5:72b`

### Model Performance vs. Parameter Count

(TODO: _Insert Model Performance vs. Parameter Count_)

This chart illustrates that models with a higher parameter count generally perform better, but it also highlights that 7B parameters are sufficient to achieve maximum scores. Certain high-parameter models underperform despite their size.

### Model Performance by Difficulty Level

(TODO: _Insert Chart Model Performance by Difficulty Level_)

This chart shows how each model performed across the five difficulty levels, providing insights into how well models adapt to increasing complexity.

### Model Response Time vs. Parameter Count

(TODO: _Insert Chart Model Response Time vs. Parameter Count_)

This chart shows a linear relationship between parameter count and average response time, which aligns with expectations.

### Model Performance vs. Response Time

(TODO: _Insert Chart Model Performance vs. Response Time_)

As indicated in the previous chart, response time generally correlates with higher scores. However, some smaller models achieve high scores with shorter response times, demonstrating that more parameters do not guarantee better performance.

### Model Performance vs. Response Time by Difficulty Level

(TODO: _Insert Chart Model Performance vs. Response Time by Difficulty Level_)

This chart, broken down by difficulty levels, shows that while longer response times often correlate with better performance, some smaller models outperform larger ones under certain conditions.

## Conclusion

The experiment suggests a general correlation between parameter count, response time, and model performance, but these are not the only factors influencing success. Notably, the **qwen2.5** and **gemma2** models produced the best results, with smaller models in these categories often outperforming larger models from other groups.

In summary, while parameter count and response time do affect model performance, they are not definitive indicators. Smaller models in the **qwen2.5** and **gemma2** categories showed strong results, implying that model architecture and training data quality may play a more significant role than sheer model size.

## Note

_This document provides a high-level overview of experimental results meant as personal research insights rather than definitive scientific conclusions. Outcomes may vary significantly in different applications._
