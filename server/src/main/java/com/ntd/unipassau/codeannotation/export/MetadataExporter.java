package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;

import java.io.IOException;
import java.nio.file.Path;

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
     * Read snippet metadata from file path.
     *
     * @param path path to metadata file.
     * @return Snippet metadata.
     * @throws IOException if there is any error during deserialization.
     */
    SnippetDoc readSnippetMetadata(Path path) throws IOException;

    /**
     * Get filename extension.
     * @return String might be (xml, json, ...)
     */
    String getFilenameExtension();
}
