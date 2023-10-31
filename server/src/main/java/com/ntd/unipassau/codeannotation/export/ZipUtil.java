package com.ntd.unipassau.codeannotation.export;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public final class ZipUtil {
    private final static String ANTI_FILENAME_PATTERN = ".*(__MACOSX|.DS_Store).*";

    public static void zipDirectory(Path dir, Path outPath) throws IOException {
        try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(outPath.toFile()))) {
            Files.walkFileTree(dir, new ZipPathVisitor(dir, zos));
        }
    }

    public static void unzip(InputStream inputStream, Path outPath) throws IOException {
        try (ZipInputStream zis = new ZipInputStream(inputStream)) {
            ZipEntry zipEntry = zis.getNextEntry();

            while (zipEntry != null) {
                Path newPath = zipSlipProtect(zipEntry, outPath);

                // Prevent extracting weird files
                if (newPath.toString().matches(ANTI_FILENAME_PATTERN)) {
                    zipEntry = zis.getNextEntry();
                    continue;
                }

                if (zipEntry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {
                    if (newPath.getParent() != null) {
                        if (Files.notExists(newPath.getParent())) {
                            Files.createDirectories(newPath.getParent());
                        }
                    }
                    Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);
                }

                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
        }
    }

    /**
     * Protect zip slip attack. Reference: https://security.snyk.io/research/zip-slip-vulnerability
     * @param zipEntry Item in zip file
     * @param targetDir Output path
     * @return
     * @throws IOException
     */
    private static Path zipSlipProtect(ZipEntry zipEntry, Path targetDir)
            throws IOException {
        Path targetDirResolved = targetDir.resolve(zipEntry.getName());

        // make sure normalized file still has targetDir as its prefix
        // else throws exception
        Path normalizePath = targetDirResolved.normalize();
        if (!normalizePath.startsWith(targetDir)) {
            throw new IOException("Bad zip entry: " + zipEntry.getName());
        }

        return normalizePath;
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
