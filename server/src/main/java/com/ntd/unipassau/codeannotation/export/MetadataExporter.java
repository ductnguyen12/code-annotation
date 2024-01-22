package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.export.model.DemographicQuestionDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import com.ntd.unipassau.codeannotation.export.model.SolutionDoc;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Set;

public interface MetadataExporter {
    /**
     * Export a snippet metadata to path.
     *
     * @param path    Destination path that contains result.
     * @param snippet Snippet metadata.
     * @throws IOException if there is any error during serialization.
     */
    void exportSnippetMetadata(Path path, SnippetDoc snippet) throws IOException;

    /**
     * Export solutions and questions to specified directory.
     *
     * @param path         Destination directory that contains result.
     * @param questionDocs Collection of demographic questions
     * @param solutionDocs Collection of solutions that are need to be exported.
     * @throws IOException if there is any error occurs during saving.
     */
    void exportDemographicSolutions(
            Path path,
            Set<DemographicQuestionDoc> questionDocs,
            Set<SolutionDoc> solutionDocs
    ) throws IOException;

    /**
     * Read snippet metadata from file path.
     *
     * @param path path to metadata file.
     * @return Snippet metadata.
     * @throws IOException if there is any error during deserialization.
     */
    SnippetDoc readSnippetMetadata(Path path) throws IOException;

    /**
     * Get filename extension.
     *
     * @return String might be (xml, json, ...)
     */
    String getFilenameExtension();
}
