package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entity.Conversation;
import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.Message;
import com.zheenbek.music_learn.entity.User;
import com.zheenbek.music_learn.repository.ConversationRepository;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.MessageRepository;
import com.zheenbek.music_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Date;

import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;

@Service
public class FileService {

    private final FileRepository fileRepository;

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final ServerFileStorageService serverFileStorageService;


//    @Value("${storage.profile-pictures}")
//    private String PROFILES_DIRECTORY;
//    @Value("${storage.message-attachments}")
//    private String MESSAGES_DIRECTORY;

    @Autowired
    public FileService(FileRepository fileRepository, MessageRepository messageRepository,
                       UserRepository userRepository, ConversationRepository conversationRepository,
                       ServerFileStorageService serverFileStorageService) {
        this.fileRepository = fileRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.serverFileStorageService = serverFileStorageService;
    }

    public void saveProfilePicture(Long userId, byte[] fileData, String contentType) throws IOException {
        // store in the file system
        File file = serverFileStorageService.storeProfilePicture(fileData, contentType, String.valueOf(userId));
        // store in the database
        FileEntity fileEntity = fileRepository.save(fileEntityFromFile(file, contentType));
        //update corresponding user's profile picture
        //TODO: implement update query in UserRepository instead of manual update
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));;
        user.setProfilePic(fileEntity);
        userRepository.save(user);
    }

    public void saveMessageFile(byte[] fileData, String contentType, Long conversationId, Long userId) throws IOException {
        // store in the file system
        File file = serverFileStorageService.storeMessageAttachment(fileData, contentType, String.valueOf(conversationId));
        // store in the database
        FileEntity fileEntity = fileRepository.save(fileEntityFromFile(file, contentType));
        //save as a separate message
        Message message = new Message();
        message.setFile(fileEntity);
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found with ID: " + conversationId));
        message.setConversation(conversation);
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        message.setSender(sender);
        message.setTimestamp(new Date());

        messageRepository.save(message);
    }

    public File getProfilePictureByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));;
        return new File(user.getProfilePic().getFilePath());
    }

//    public void deleteById (Long fileId) {
//        fileRepository.deleteById(fileId);
//    }
//
//    public void deleteFile (FileEntity fileEntity) {
//        fileRepository.deleteById(fileId);
//    }

    /**
     * Queries a message object that contains a file and returns it as a File object along with its media type.
     *
     * @param messageId id of the message that needs to be queried. The mentioned message is supposed to have a file within it.
     * @return a pair where first value is the file and second is its media type.
     */
    public Pair<File, String> getMessageFile(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found with ID: " + messageId));
        if (message.getFile() == null){
            throw new RuntimeException("Message with ID " + messageId + " does not contain a file");
        }
        File file = new File(message.getFile().getFilePath());
        String mediaType = message.getFile().getMediaType();
        return Pair.of(file, mediaType);
    }

//    private FileEntity saveFileInStorageAndRepo(byte[] fileData, String contentType, String filePrefix, final String storageDirectoryPath) throws IOException {
//        FileEntity fileEntity = new FileEntity();
//        String filename = filePrefix + '-' + UUID.randomUUID() + getFileExtension(contentType);
//        fileEntity.setFileName(filename);
//        fileEntity.setFilePath(storageDirectoryPath + '/' + filename);
//        fileEntity.setMediaType(contentType);
//        //save it in the file system
//        Path filePath = Paths.get(storageDirectoryPath, filename);
//        Files.write(filePath, fileData);
//        //save it in the database
//        return fileRepository.save(fileEntity);
//    }

//    private static String getFileExtension(String mediaType) {
//        try {
//            MimeType mimeType = new MimeType(mediaType);
//            return '.' + mimeType.getSubType();
//        } catch (Exception e) {
//            //ignore
//        }
//        return "";
//    }
}
