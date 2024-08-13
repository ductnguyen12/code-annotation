package com.ntd.unipassau.codeannotation.util;

import java.util.Set;

public final class CodeUtil {
    public static String SCRATCH_FILE_EXT = "sb3";
    public static Set<String> HASHTAG_COMMENT_PL = Set.of("py", "sh");

    public static String getLineCommentToken(String programmingLanguage) {
        if (HASHTAG_COMMENT_PL.contains(programmingLanguage))
            return "#";
        return "//";
    }
}
