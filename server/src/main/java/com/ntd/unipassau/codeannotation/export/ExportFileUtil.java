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

    private ExportFileUtil() {}
}
