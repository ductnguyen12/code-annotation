package com.ntd.unipassau.codeannotation.export;

import lombok.NonNull;

import java.util.Arrays;
import java.util.stream.Stream;

public final class ExportFileUtil {
    /**
     * Get filename from http file path
     *
     * @param httpPath http path to file (e.g. https://github.com/scylladb/seastar/blob/master/src/core/alien.cc)
     * @return a filename in which domain was removed and slashes were replaced by dot ".".
     */
    public static String getFilenameFromHttpPath(String httpPath) {
        String[] subs = httpPath.split("/");
        // Cut down the domain path (e.g. remove "https://github.com/") and concatenate substrings by dot
        return String.join(".", Arrays.copyOfRange(subs, 3, subs.length));
    }

    /**
     * Get base filename from filename (remove extension part such as .json, .xml, ...)
     *
     * @param filename full name with extension (e.g. metadata.json)
     * @return a base filename without extension (e.g. metadata.json -> metadata).
     */
    public static String getBaseFilename(String filename) {
        String[] subs = filename.split("\\.");
        return String.join(".", Arrays.copyOfRange(subs, 0, subs.length - 1));
    }

    /**
     * Compute filename based on path by replacing "/" by ".".
     * Call {getFilenameFromHttpPath} if path is http path
     *
     * @param path filepath or http path
     * @return filename
     */
    public static String getFilenameFromPath(@NonNull String path) {
        if (isHttpPath(path))
            return getFilenameFromHttpPath(path);
        return path.replaceAll("/", ".");
    }

    /**
     * Check whether path is an http path
     *
     * @param path filepath or http path
     * @return true if path is http path
     */
    public static boolean isHttpPath(@NonNull String path) {
        return path.startsWith("http://") || path.startsWith("https://");
    }

    public static boolean isSourceCodeFile(@NonNull String filename) {
        String[] parts = filename.split("\\.");
        return Stream.of(SOURCE_CODE_EXT).anyMatch(ext -> ext.equals(parts[parts.length - 1]));
    }

    private final static String[] SOURCE_CODE_EXT = new String[]{
            "c", "cc", "cpp", "cs", "swift",
            "java", "groovy", "ktl", "kt", "scala",
            "js", "jsx", "ts", "tsx",
            "go", "py", "rs",
            "sh"
    };

    private ExportFileUtil() {
    }
}
