package com.zheenbek.music_learn.service;

import javax.annotation.PostConstruct;

import com.zheenbek.music_learn.entity.FileEntity;
import com.zheenbek.music_learn.entity.course.Category;
import com.zheenbek.music_learn.repository.FileRepository;
import com.zheenbek.music_learn.repository.course.CategoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;

import static com.zheenbek.music_learn.service.ServerFileStorageService.fileEntityFromFile;

@Service
public class DataInitializer {
    @Value("${static-directory}")
    private String CATEGORIES_PICTURES_DIRECTORY;
    private final CategoryRepository categoryRepository;
    private final FileRepository fileRepository;
    public DataInitializer(CategoryRepository categoryRepository,
                           FileRepository fileRepository) {
        this.categoryRepository = categoryRepository;
        this.fileRepository = fileRepository;
    }

    @PostConstruct
    public void init() {
        createCategoryIfNotFound("String Instruments", "category_string_instruments.png");
        createCategoryIfNotFound("Wind Instruments", "category_wind_instruments.png");
        createCategoryIfNotFound("Percussion Instruments", "category_percussion_instruments.png");
        createCategoryIfNotFound("Keyboard Instruments", "category_keyboard_instruments.png");
        createCategoryIfNotFound("Music Theory", "category_music_theory.png");
        createCategoryIfNotFound("Songwriting and Arrangement", "category_songwriting_and_arrangement.png");
        createCategoryIfNotFound("Music Production", "category_music_production.png");
        createCategoryIfNotFound("Vocal", "category_vocal.png");
        createCategoryIfNotFound("Tech Music", "category_tech_music.png");
    }

    private void createCategoryIfNotFound(String name, String filename) {
        if (categoryRepository.findByName(name) != null) {
            return;
        }
        Path filePath = Paths.get(CATEGORIES_PICTURES_DIRECTORY, filename);
        FileEntity pictureEntity = fileRepository.save(fileEntityFromFile(filePath.toFile(), "image/png"));
        categoryRepository.save(new Category(name, pictureEntity));
    }
}
