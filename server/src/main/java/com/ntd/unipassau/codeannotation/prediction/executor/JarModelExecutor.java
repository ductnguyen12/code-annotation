package com.ntd.unipassau.codeannotation.prediction.executor;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.prediction.Model;
import com.ntd.unipassau.codeannotation.domain.prediction.PredictedRating;
import com.ntd.unipassau.codeannotation.export.ExportFileUtil;
import com.ntd.unipassau.codeannotation.prediction.reader.PredictionReader;
import com.ntd.unipassau.codeannotation.util.jarexecutor.BasicJarExecutor;
import com.ntd.unipassau.codeannotation.util.jarexecutor.JarExecutor;
import lombok.SneakyThrows;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.MessageFormat;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class JarModelExecutor implements ModelExecutor {
    private final static String KEY_JAR_PATH = "jarFilePath";
    private final static String KEY_MODEL_PATH = "modelPath";
    private final static String KEY_METRIC_CLASSPATH = "metricClasspath";
    private final static String KEY_REQUIRE_MODEL_COPY = "requireModelCopy";
    private final static String CURRENT_DIR = System.getProperty("user.dir");
    private final static String DIR_DATASET_SNIPPETS = "JarModelExecutor_dataset-{0}-snippets";

    private final JarExecutor jarExecutor;
    private final PredictionReader predictionReader;

    public JarModelExecutor(
            PredictionReader predictionReader) {
        this.predictionReader = predictionReader;
        this.jarExecutor = new BasicJarExecutor();
    }

    @SneakyThrows
    @Override
    public Collection<PredictedRating> predict(Model model, Dataset dataset) {
        Map<String, Object> config = model.getConfig();
        final String jarFilePath = config.get(KEY_JAR_PATH).toString();
        final String modelPath = config.get(KEY_MODEL_PATH).toString();
        final String metricClasspath = config.getOrDefault(KEY_METRIC_CLASSPATH, "").toString();
        final boolean requireCopyModel = Boolean.parseBoolean(
                config.getOrDefault(KEY_REQUIRE_MODEL_COPY, "false").toString()
        );
        Path modelFilePath = Paths.get(modelPath);
        if (requireCopyModel && !modelFilePath.toFile().exists()) {
            Files.copy(
                    modelFilePath,
                    Paths.get(CURRENT_DIR).resolve(modelFilePath.getFileName()),
                    StandardCopyOption.REPLACE_EXISTING);
        }

        final Path tmpDir = Files.createTempDirectory(MessageFormat.format(DIR_DATASET_SNIPPETS, dataset.getId()));
        tmpDir.toFile().deleteOnExit();

        Map<Path, Snippet> pathSnippetMap = saveSnippetFiles(tmpDir, dataset);
        Map<String, Double> snippetRating =
                predictRating(jarFilePath, pathSnippetMap.keySet().stream().map(Path::toString).toList());

        return pathSnippetMap.keySet().stream()
                .map(path -> {
                    Snippet snippet = pathSnippetMap.get(path);
                    Double rating = snippetRating.getOrDefault(path.toString(), null);
                    if (rating == null)
                        return null;
                    Map<String, Double> metrics = getMetrics(jarFilePath, metricClasspath, path.toString());
                    return PredictedRating.builder()
                            .id(PredictedRating.PRatingId.builder()
                                    .modelId(model.getId())
                                    .snippetId(snippet.getId())
                                    .build())
                            .model(model)
                            .snippet(snippet)
                            .value(rating)
                            .metrics(metrics)
                            .build();
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private Map<Path, Snippet> saveSnippetFiles(Path dir, Dataset dataset) {
        return dataset.getSnippets().stream()
                .map(snippet -> {
                    String sourceCodeFilename = ExportFileUtil.getFilenameFromPath(snippet.getPath());
                    Path sourceCodePath = dir.resolve(sourceCodeFilename);
                    try {
                        Files.writeString(sourceCodePath, snippet.getCode(), StandardCharsets.UTF_8);
                    } catch (IOException e) {
                        // Simply ignore this snippet
                        return null;
                    }
                    return Map.entry(sourceCodePath, snippet);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    private Map<String, Double> predictRating(String jarFilePath, List<String> paths) {
        List<String> stdout = jarExecutor.executeJar(jarFilePath, paths);
        return predictionReader.readLines(stdout);
    }

    private Map<String, Double> getMetrics(String jarFilePath, String metricClasspath, String path) {
        List<String> stdout = jarExecutor.executeJar(jarFilePath, metricClasspath, List.of(path));
        return predictionReader.readLines(stdout);
    }
}
