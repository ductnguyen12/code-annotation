package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import com.ntd.unipassau.codeannotation.domain.rater.Solution;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Collection;

public interface DatasetExporter {

    /**
     * Export snippets and annotation to specified directory.
     *
     * @param dir      Destination directory that contains result.
     * @param snippets Snippets that would be exported.
     * @throws IOException when there is any error occurs during metadata serialization or source code file saving.
     */
    void exportSnippets(Path dir, Collection<Snippet> snippets) throws IOException;

    /**
     * Export solutions and questions to specified directory.
     *
     * @param path      Output path.
     * @param solutions Solutions that are need to be exported.
     * @throws IOException when there is any error occurs during saving.
     */
    void exportDemographicSolutions(Path path, Collection<Solution> solutions) throws IOException;

    /**
     * Parse the content of file to extract snippets and annotation
     *
     * @param dataset Dataset that snippets will be imported to
     * @param dir     Path to the extracted data to be imported
     * @return Dataset with imported snippets
     * @throws IOException when there is any error occurs during metadata de-serialization or source code file reading.
     */
    Dataset importSnippets(Dataset dataset, Path dir) throws IOException;
}
