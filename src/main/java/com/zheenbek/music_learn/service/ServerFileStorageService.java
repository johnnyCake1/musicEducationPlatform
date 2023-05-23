package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.FileEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.activation.MimeType;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ServerFileStorageService {

    @Value("${storage.profile-pictures}")
    private String PROFILES_DIRECTORY;
    @Value("${storage.message-attachments}")
    private String MESSAGE_ATTACHMENTS_DIRECTORY;
    @Value("${storage.message-course-file}")
    private String COURSE_FILES_DIRECTORY;

    public ServerFileStorageService() {

    }

    public File storeFile(byte[] fileData, String contentType, String filenamePrefix, final String storageDirectoryPath) throws IOException {
        String filename = filenamePrefix + '-' + UUID.randomUUID() + fileExtensionFromMediaType(contentType);
        Path filePath = Paths.get(storageDirectoryPath, filename);
        Files.write(filePath, fileData);
        return filePath.toFile();
    }

    public File storeProfilePicture(byte[] fileData, String contentType, String filenamePrefix) throws IOException {
        return storeFile(fileData, contentType, filenamePrefix, PROFILES_DIRECTORY);
    }

    public File storeMessageAttachment(byte[] fileData, String contentType, String filenamePrefix) throws IOException {
        return storeFile(fileData, contentType, filenamePrefix, MESSAGE_ATTACHMENTS_DIRECTORY);
    }

    public File storeCourseFile(byte[] fileData, String contentType, String filenamePrefix) throws IOException {
        return storeFile(fileData, contentType, filenamePrefix, COURSE_FILES_DIRECTORY);
    }

    public void deleteProfilePicture(String filename) {
        File file = new File(PROFILES_DIRECTORY + '/' + filename);
        file.delete();
    }
    public void deleteMessageAttachment(String filename) {
        File file = new File(MESSAGE_ATTACHMENTS_DIRECTORY + '/' + filename);
        file.delete();
    }

    private static String fileExtensionFromMediaType(String mediaType) {
        try {
            MimeType mimeType = new MimeType(mediaType);
            return '.' + mimeType.getSubType();
        } catch (Exception e) {
            //ignore
        }
        return "";
    }

    public static FileEntity fileEntityFromFile(File file, String mediaType) {
        FileEntity fileEntity = new FileEntity();
        fileEntity.setFilePath(file.getPath());
        fileEntity.setFileName(file.getName());
        fileEntity.setMediaType(mediaType);
        return fileEntity;
    }

//    public FileEntity storeTopicFile(MultipartFile file) {
//
//        // Get the original file name
//        String originalFileName = file.getOriginalFilename();
//
//        // Get the file's content type
//        String contentType = file.getContentType();
//
//        // Generate a new file name with the desired name and file extension
//        String newFilePath = destinationPath + File.separator + newFileName + getFileExtension(originalFileName);
//
//        // Create a new File object with the destination path and new file name
//        File newFile = new File(newFilePath);
//
//        // Move the file to the new location
//        file.transferTo(newFile);
//
//        return newFilePath;
//        file.transferTo();
//        file.getContentType();
//        file.getOriginalFilename();
//
//        return null;
//    }
}
