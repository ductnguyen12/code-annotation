package com.ntd.unipassau.codeannotation.export;

import java.util.Arrays;

public final class ExportFileUtil {
    /**
     * Get filename from http file path
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
     * @param filename full name with extension (e.g. metadata.json)
     * @return a base filename without extension (e.g. metadata.json -> metadata).
     */
    public static String getBaseFilename(String filename) {
        String[] subs = filename.split("\\.");
        return String.join(".", Arrays.copyOfRange(subs, 0, subs.length - 1));
    }

    private ExportFileUtil() {}
}
