/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.util.Properties;

/**
 * Downloads the Maven Wrapper JAR from the configured URL if it does not already exist.
 */
public final class MavenWrapperDownloader {

    private static final String WRAPPER_PROPERTIES_PATH = ".mvn/wrapper/maven-wrapper.properties";
    private static final String WRAPPER_JAR_PATH = ".mvn/wrapper/maven-wrapper.jar";
    private static final String PROPERTY_NAME_WRAPPER_URL = "wrapperUrl";

    private MavenWrapperDownloader() {
    }

    public static void main(String[] args) {
        System.out.println("- Downloader started");
        File baseDirectory = new File(args.length > 0 ? args[0] : ".");
        System.out.println("- Using base directory: " + baseDirectory.getAbsolutePath());

        File wrapperJar = new File(baseDirectory, WRAPPER_JAR_PATH);
        if (wrapperJar.exists()) {
            System.out.println("- Wrapper jar already exists: " + wrapperJar.getAbsolutePath());
            return;
        }

        File propertiesFile = new File(baseDirectory, WRAPPER_PROPERTIES_PATH);
        if (!propertiesFile.exists()) {
            System.out.println("- ERROR: " + WRAPPER_PROPERTIES_PATH + " not found.");
            return;
        }

        Properties properties = new Properties();
        try (InputStream in = propertiesFile.toURI().toURL().openStream()) {
            properties.load(in);
        } catch (IOException e) {
            System.out.println("- ERROR loading properties: " + e.getMessage());
            return;
        }

        String url = properties.getProperty(PROPERTY_NAME_WRAPPER_URL);
        if (url == null || url.trim().isEmpty()) {
            System.out.println("- ERROR: " + PROPERTY_NAME_WRAPPER_URL + " property not found in " + WRAPPER_PROPERTIES_PATH);
            return;
        }

        System.out.println("- Downloading from: " + url);
        System.out.println("- Downloading to: " + wrapperJar.getAbsolutePath());

        try {
            downloadFileFromURL(url, wrapperJar);
            System.out.println("- Finished downloading Maven Wrapper Jar");
        } catch (IOException e) {
            System.out.println("- ERROR downloading: " + e.getMessage());
        }
    }

    private static void downloadFileFromURL(String urlString, File destination) throws IOException {
        if (!destination.getParentFile().exists() && !destination.getParentFile().mkdirs()) {
            throw new IOException("Failed to create directories for " + destination.getAbsolutePath());
        }

        URL website = new URL(urlString);
        try (ReadableByteChannel rbc = Channels.newChannel(website.openStream());
             FileOutputStream fos = new FileOutputStream(destination)) {
            fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
        }
    }
}


