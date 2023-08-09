package com.ntd.unipassau.codeannotation.export;

import com.ntd.unipassau.codeannotation.domain.Dataset;
import org.springframework.core.io.Resource;

import java.io.IOException;

public interface DatasetExporter {
    Resource exportSnippets(Dataset dataset) throws IOException;
}
