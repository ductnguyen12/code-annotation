package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.export.model.DemographicQuestionDoc;
import com.ntd.unipassau.codeannotation.export.model.RaterActionDoc;
import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;
import com.ntd.unipassau.codeannotation.export.model.SolutionDoc;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Collection;
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
     * Export raters actions to specified directory.
     *
     * @param path    Destination directory that contains result.
     * @param actions Raters' actions that are need to be exported.
     * @throws IOException if there is any error occurs during saving.
     */
    void exportRaterActions(Path path, Collection<RaterActionDoc> actions) throws IOException;

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

    /**
     * Determine if a file is a metadata file.
     *
     * @param file metadata file.
     * @return true if the file ends with a certain file extension that depends on current exporter.
     */
    default boolean isMetadataFile(File file) {
        return file.getName().endsWith("." + getFilenameExtension());
    }

    /**
     * Test whether related snippet file exists.
     *
     * @param metadataFile metadata file.
     * @return true if the related snippet file already existed.
     */
    default boolean hasRelatedSnippetFile(File metadataFile) {
        String snippetFilename = getRelatedSnippetFilename(metadataFile);
        File snippetFile = metadataFile.getParentFile().toPath()
                .resolve(snippetFilename)
                .toFile();
        return snippetFile.isFile();
    }

    /**
     * Get the snippet filename by removing filename extension part from the metadata filename
     * (e.g. abc.txt.json => abc.txt)
     *
     * @param metadataFile metadata file.
     * @return Filename of related snippet.
     */
    default String getRelatedSnippetFilename(File metadataFile) {
        String metadataFilename = metadataFile.getName();
        return metadataFilename.substring(0, metadataFilename.length() - getFilenameExtension().length() - 1);
    }
}
