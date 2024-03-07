package com.ntd.unipassau.codeannotation.integration.prolific;

import com.ntd.unipassau.codeannotation.integration.prolific.dto.PageDTO;
import com.ntd.unipassau.codeannotation.integration.prolific.dto.SubmissionDTO;

import javax.annotation.Nullable;

public interface ProlificClient {
    PageDTO<SubmissionDTO> listSubmissions(@Nullable String study);

    default PageDTO<SubmissionDTO> listSubmissions() {
        return listSubmissions(null);
    }
}
