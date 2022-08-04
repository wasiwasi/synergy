package com.synergy.api.controller;

import com.synergy.api.response.BodytalkRes;
import com.synergy.api.response.SubjectSetRes;
import com.synergy.api.service.SubjectService;
import com.synergy.api.service.UserService;
import com.synergy.common.auth.UserDetails;
import com.synergy.common.model.response.BaseResponseBody;
import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.BodytalkDto;
import com.synergy.db.entity.SubjectSetDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

@Api(value = "게임설정 API", tags = {"Subject", "Bodytalk", "Goldenbell"})
@RestController
@RequestMapping("/subjects")
public class SubjectController {

    @Autowired
    SubjectService subjectService;

    @GetMapping("")
    @ApiOperation(value = "문제집 리스트 조회", notes = "기본 문제집과 유저가 만든 문제집에 대한 정보를 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 조회 완료"),
            @ApiResponse(code = 404, message = "문제집이 없습니다."),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> getSubjects(@ApiIgnore Authentication authentication){
        UserDetails userDetails = (UserDetails)authentication.getDetails();
        Long userId = Long.valueOf(userDetails.getUsername());
        List<SubjectSetDto> list = null;
        //0번은 기본의 문제집
        list = subjectService.getSubjectSets(Arrays.asList(0L, userId));
        if(list.size() == 0) {
            return ResponseEntity.status(404).body(SubjectSetRes.of(404, "문제집이 없습니다."));
        }
        return ResponseEntity.status(200).body(SubjectSetRes.of(200, "문제집 조회 완료", list));

    }

    @GetMapping("/{subjectId}")
    @ApiOperation(value = "문제집 리스트 조회", notes = "기본 문제집과 유저가 만든 문제집에 대한 정보를 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 조회 완료"),
            @ApiResponse(code = 403, message = "본인의 문제집만 조회 가능합니다."),
            @ApiResponse(code = 404, message = "문제집이 존재하지 않습니다.")
    })
    public ResponseEntity<? extends BaseResponseBody> getSubjects(@ApiIgnore Authentication authentication,
                                                                  @PathVariable(value = "subjectId") Long subjectId){

        UserDetails userDetails = (UserDetails)authentication.getDetails();
        Long userId = Long.valueOf(userDetails.getUsername());

        // 본인의 문제집이 맞는지 검증
        try {
            Long subjectOwner = subjectService.getSubjectSet(subjectId).getUser().getId();
            if (subjectOwner != 0 && subjectOwner != userId) {
                return ResponseEntity.status(403).body(BodytalkRes.of(403, "본인의 문제집만 조회 가능합니다."));
            }
        } catch(NoSuchElementException exception) {
            return ResponseEntity.status(403).body(BodytalkRes.of(500, "문제집이 존재하지 않습니다."));
        }

        List<Bodytalk> list = subjectService.getBodytalk(subjectId);
        return ResponseEntity.status(200).body(BodytalkRes.of(200, "문제집 조회 완료", list));

    }

}
