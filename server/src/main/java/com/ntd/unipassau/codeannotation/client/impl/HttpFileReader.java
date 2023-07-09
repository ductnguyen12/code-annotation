package com.ntd.unipassau.codeannotation.client.impl;

import com.ntd.unipassau.codeannotation.client.RemoteFileReader;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class HttpFileReader implements RemoteFileReader {
    @Override
    public Collection<String> readFileLines(URI uri, Integer fromLine, Integer toLine) throws IOException {
        Path path = Files.createTempFile("", ".tmp");
        Files.createDirectories(path.getParent());

        Flux<DataBuffer> dataBufferFlux = WebClient.builder()
                .baseUrl(uri.toString())
                .build()
                .get()
                .retrieve()
                .bodyToFlux(DataBuffer.class);
        DataBufferUtils.write(dataBufferFlux, path, StandardOpenOption.CREATE).block();

        List<String> lines = new LinkedList<>();
        try (BufferedReader br = Files.newBufferedReader(path)) {
            AtomicInteger counter = new AtomicInteger();
            final int from = fromLine == null ? 1 : fromLine;
            final int to = toLine == null ? Integer.MAX_VALUE : toLine;
            br.lines()
                    .forEach(line -> {
                        int lineNumber = counter.addAndGet(1);
                        if (lineNumber >= from && lineNumber <= to)
                            lines.add(line);
                    });
        }
        Files.deleteIfExists(path);

        return lines;
    }
}
