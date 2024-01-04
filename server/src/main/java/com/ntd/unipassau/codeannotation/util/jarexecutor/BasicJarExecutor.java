package com.ntd.unipassau.codeannotation.util.jarexecutor;

import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
public class BasicJarExecutor implements JarExecutor {
    @Override
    public List<String> executeJar(String jarFilePath, List<String> args) throws JarExecutionException {
        final List<String> actualArgs = new ArrayList<String>();
        actualArgs.add(0, "java");
        actualArgs.add(1, "-jar");
        actualArgs.add(2, jarFilePath);
        actualArgs.addAll(args);
        return executeCommand(actualArgs);
    }

    @Override
    public List<String> executeJar(String jarFilePath, String classpath, List<String> args)
            throws JarExecutionException {
        final List<String> actualArgs = new ArrayList<String>();
        actualArgs.add("java");
        actualArgs.add("-cp");
        actualArgs.add(jarFilePath);
        actualArgs.add(classpath);
        actualArgs.addAll(args);
        return executeCommand(actualArgs);
    }

    protected List<String> executeCommand(final List<String> args) {
        try {
            final Runtime re = Runtime.getRuntime();
            final Process command = re.exec(args.toArray(new String[0]));
            try (
                    BufferedReader stderr = new BufferedReader(new InputStreamReader(command.getErrorStream()));
                    BufferedReader stdout = new BufferedReader(new InputStreamReader(command.getInputStream()));
            ) {
                // Wait for the application to Finish
                command.waitFor();
                int exitVal = command.exitValue();
                String errorMsg = stderr.lines().collect(Collectors.joining("\n"));
                if (exitVal != 0) {
                    throw new IOException("Failed to execute jar, " + errorMsg);
                }
                log.warn("Jar execution warning: {}", errorMsg);

                return stdout.lines().toList();
            }
        } catch (final IOException | InterruptedException e) {
            throw new JarExecutionException(e);
        }
    }
}
