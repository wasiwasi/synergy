package com.synergy.api.service;

import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.SubjectSet;
import com.synergy.db.entity.SubjectSetDto;
import com.synergy.db.repository.SubjectSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    SubjectSetRepository subjectSetRepository;

    @Override
    public List<SubjectSetDto> getSubjectSets(List<Long> ids) {
        return subjectSetRepository.findByuser_idIn(ids);
    }

    @Override
    public List<Bodytalk> getBodytalk(Long subjectId) {
        SubjectSet subjectSet = subjectSetRepository.findById(subjectId).get();
        return subjectSet.getBodytalks();
    }

    @Override
    public SubjectSet getSubjectSet(Long subjectId) {
        return subjectSetRepository.findById(subjectId).get();
    }
}
