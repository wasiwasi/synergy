package com.synergy.api.service;

import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.SubjectSetDto;

import java.util.List;

public interface SubjectService {
    public List<SubjectSetDto> getSubjectSet(List<Long> ids);

    public List<Bodytalk> getBodytalk(Long subjectId);
}
