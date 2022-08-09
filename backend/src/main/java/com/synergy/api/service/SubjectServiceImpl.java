package com.synergy.api.service;

import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.SubjectSet;
import com.synergy.db.entity.SubjectSetDto;
import com.synergy.db.entity.User;
import com.synergy.db.repository.SubjectSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.security.auth.Subject;
import java.util.ArrayList;
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

    @Override
    public void createSubjectSet(String subjectName, List<Bodytalk> list, User user,String gameTitle) {
        SubjectSet subjectSet = new SubjectSet();
        List<Bodytalk> bodytalk = new ArrayList<>();

        subjectSet.setSubjectName(subjectName);
        //user 랑 서브젝트 네임 / 게임 제목
//        subjectSet.setGameTitle();
//        subjectSet.setUser(user);
        subjectSet.setBodytalks(bodytalk);
        subjectSetRepository.save(subjectSet);
    }

    @Override
    public void deleteSubjectSet( Long subjectId) {
        subjectSetRepository.deleteById(subjectId);
        //궁금한점 -> subjectSetid만 삭제하면 속해있는 bodytalk도 삭제가 되나??
    }

    @Override
    public void deleteAllSubjectSet(Long userId) {
        subjectSetRepository.deleteByuser_id(userId);
    }


}
