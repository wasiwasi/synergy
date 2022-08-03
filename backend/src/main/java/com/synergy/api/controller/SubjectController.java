package com.synergy.api.controller;

import com.synergy.api.response.SubjectSetRes;
import com.synergy.api.service.SubjectService;
import com.synergy.api.service.UserService;
import com.synergy.common.model.response.BaseResponseBody;
import com.synergy.db.entity.SubjectSetDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Arrays;
import java.util.List;

@Api(value = "게임설정 API", tags = {"Subject", "Bodytalk", "Goldenbell"})
@RestController
@RequestMapping("/game")
public class SubjectController {

    @Autowired
    UserService userService;
    @Autowired
    SubjectService subjectService;

    @GetMapping("/subjects")
    @ApiOperation(value = "문제집 리스트 조회", notes = "기본 문제집과 유저가 만든 문제집에 대한 정보를 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 조회 완료"),
            @ApiResponse(code = 400, message = "해당 유저가 존재하지 않습니다."),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> getSubjects(@ApiIgnore Authentication authentication){
        //TODO: JWT 토큰에서 UserId를 가져와 조회
        //UserDetails userDetails = (UserDetails)authentication.getDetails();
        //String userId = userDetails.getUsername();
        long userId = 59;
        List<SubjectSetDto> list = null;
        list = subjectService.getSubjectSet(Arrays.asList(0L, 59L));
        if(list.size() == 0) {
            return ResponseEntity.status(404).body(SubjectSetRes.of(404, "문제집이 없습니다."));
        }
        return ResponseEntity.status(200).body(SubjectSetRes.of(200, "문제집 조회 완료", list));

    }

}
