package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.dataset.Dataset;
import com.ntd.unipassau.codeannotation.domain.dataset.Snippet;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Collection;

public interface DatasetExporter {
    /**
     * Export all snippets of a dataset to a zip file in OS-temporary directory.
     *
     * @param dataset dataset would be exported.
     * @return a reference to zip file in temporary directory.
     * @throws IOException if there is any error during operating files or snippet metadata serialization.
     */
    Resource exportSnippets(Dataset dataset) throws IOException;

    /**
     * Export snippets and annotation to specified directory.
     *
     * @param dir      Destination directory that contains result.
     * @param snippets Snippets that would be exported.
     * @throws IOException when there is any error occurs during metadata serialization or source code file saving.
     */
    void exportSnippets(Path dir, Collection<Snippet> snippets) throws IOException;

    /**
     * Parse the content of file to extract snippets and annotation
     * @param dataset Dataset that snippets will be imported to
     * @param resource Reference to file
     * @return Dataset with imported snippets
     * @throws IOException when there is any error occurs during metadata de-serialization or source code file reading.
     */
    Dataset importSnippets(Dataset dataset, Resource resource) throws IOException;
}
