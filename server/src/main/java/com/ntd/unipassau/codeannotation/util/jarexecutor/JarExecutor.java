package com.ntd.unipassau.codeannotation.util.jarexecutor;

import java.util.List;

public interface JarExecutor {
    List<String> executeJar(String jarFilePath, List<String> args) throws JarExecutionException;

    List<String> executeJar(String jarFilePath, String classpath, List<String> args) throws JarExecutionException;
}
