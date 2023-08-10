package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.export.model.SnippetDoc;

import java.io.IOException;
import java.nio.file.Path;

public interface MetadataExporter {
    /**
     * Export a snippet metadata to path.
     * @param path Destination path that contains result.
     * @param snippet Snippet metadata.
     * @throws IOException if there is any error during serialization.
     */
    void exportSnippetMetadata(Path path, SnippetDoc snippet) throws IOException;
}
