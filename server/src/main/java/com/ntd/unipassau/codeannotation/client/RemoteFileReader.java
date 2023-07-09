package com.ntd.unipassau.codeannotation.client;

import java.io.IOException;
import java.net.URI;
import java.util.Collection;

public interface RemoteFileReader {
    Collection<String> readFileLines(URI uri, Integer fromLine, Integer toLine) throws IOException;
}
