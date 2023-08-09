package com.ntd.unipassau.codeannotation.export;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public final class ZipUtil {
    public static void zipDirectory(Path dir, Path outPath) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(outPath.toFile()))) {
            Files.walkFileTree(dir, new ZipPathVisitor(dir, zos));
        }
    }

    static class ZipPathVisitor extends SimpleFileVisitor<Path> {
        private final Path input;
        private final ZipOutputStream zos;

        public ZipPathVisitor(Path input, ZipOutputStream zos) {
            this.input = input;
            this.zos = zos;
        }

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
            Path targetFile = input.relativize(file);

            zos.putNextEntry(new ZipEntry(targetFile.toString()));
            byte[] bytes = Files.readAllBytes(file);
            zos.write(bytes, 0, bytes.length);
            zos.closeEntry();

            return FileVisitResult.CONTINUE;
        }
    }

    private ZipUtil() {}
}
