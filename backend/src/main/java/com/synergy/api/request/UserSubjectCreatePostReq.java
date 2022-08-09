package com.synergy.api.request;

import com.synergy.db.entity.Bodytalk;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("User create subject set and bodytalk")
public class UserSubjectCreatePostReq {
    String subjectName;
    String gameTitle;
    List<Bodytalk> bodytalkList;
}
