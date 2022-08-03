package com.synergy.api.service;

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
    public List<SubjectSetDto> getSubjectSet(List<Long> ids) {
        return subjectSetRepository.findByuser_idIn(ids);
    }

}
