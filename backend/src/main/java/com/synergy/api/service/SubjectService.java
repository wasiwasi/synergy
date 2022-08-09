package com.synergy.api.service;

import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.SubjectSet;
import com.synergy.db.entity.SubjectSetDto;
import com.synergy.db.entity.User;

import java.util.List;

public interface SubjectService {
    public List<SubjectSetDto> getSubjectSets(List<Long> ids);

    public List<Bodytalk> getBodytalk(Long subjectId);
    public SubjectSet getSubjectSet(Long subjectId);
    public void createSubjectSet(String subjectName, List<Bodytalk> list, User user, String gameTitle);
    public void deleteSubjectSet( Long subjectId);
    public void deleteAllSubjectSet(Long userId);
}
