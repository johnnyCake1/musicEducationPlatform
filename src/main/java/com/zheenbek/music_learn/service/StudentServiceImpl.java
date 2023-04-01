package com.zheenbek.music_learn.service;

import com.zheenbek.music_learn.entities.Student;
import com.zheenbek.music_learn.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService{

    private StudentRepository studentRepository;

    @Override
    public Student saveStudent(Student s) {
        return studentRepository.save(s);
    }

    @Autowired
    public void setStudentRepository(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    static boolean isDominating(int x, int y)
    {
        // Assuming 32-bit Integer
        for(int i = 31; i >= 0; i--)
        {
            // Find current bits in x and y
            int b1 = ((x & (1 << i)) == 0 ) ? 0 : 1;
            int b2 = ((y & (1 << i)) == 0 ) ? 0 : 1;
            if ((b1^b2) < (b1&b2)){
                return false;
            }
        }
        return true;
    }

    public static long dominatingXorPairs(List<Integer> arr){
        long result = 0;
        for (int i = 0; i < arr.size(); i++) {
            for (int j = i+1; j < arr.size(); j++) {
                System.out.println(i + ":" + j);
                if (isDominating(arr.get(i), arr.get(j))) {
                    System.out.println("yes");
                    result++;
                }
            }
        }
        return result;
    }
    public static void main(String[] args) {
        int numOfRows = 10;
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < numOfRows; i++) {
            List<Integer> row = Arrays.asList(new Integer[i+1]);
            row.set(0,1);
            row.set(i,1);
            for (int j = 1; j < i; j++){
                int sum = res.get(i-1).get(j-1) + res.get(i-1).get(j);
                row.set(j, sum);
            }
            res.add(row);
        }
        System.out.println(res);
    }
}

