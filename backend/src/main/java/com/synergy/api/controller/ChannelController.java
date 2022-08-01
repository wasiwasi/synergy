package com.synergy.api.controller;

import com.synergy.api.request.channel.ParticipantPostReq;
import com.synergy.api.response.channel.ChannelInfoReq;
import com.synergy.api.service.channel.ChannelService;
import com.synergy.db.entity.Participant;
import io.swagger.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.openvidu.java.client.*;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Api(value = "channel 과 관련된 API", tags = {"channel","room"})
@RestController
@CrossOrigin("*")
@RequestMapping("/api/channels")// 나중에 channel과 관련된거 넣을때 하는거
public class ChannelController {

    private final Logger log = LoggerFactory.getLogger(ChannelController.class);

    @Autowired
    ChannelService channelService;

    @ApiOperation(value = "채널의 존재 유무")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200 ,message = "채널 존재함"),
                    @ApiResponse(code = 404 ,message = "채널을 찾을 수 없음")

            }
    )
    @GetMapping("/{channelId}")
    public ResponseEntity findChannel(@ApiParam(value = "",required = true)@PathVariable String channelId){
        channelId = channelId.trim();
        return channelService.findChannel(channelId);
    }


    //프론트 엔드에서 방을 생성후 -> 백엔드에게 알리고, 유저를host로 지정
    @ApiOperation(value = "채널 생성후, 생성한 사람을 host 로 지정.")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200 ,message = "채널 존재함"),
                    @ApiResponse(code = 404 ,message = "채널을 찾을 수 없음"),
                    @ApiResponse(code = 406 ,message = "채널을 찾을 수 없음")

            }
    )
    @PutMapping("/{channelId}")
    public ResponseEntity createChannel(@ApiParam(value = "openvidu 에서 생성한 channel code",required = true)@PathVariable String channelId,
                                        @ApiParam(value = "channel host 정보")@RequestBody ParticipantPostReq participantPostReq){
        channelId = channelId.trim();
        if(!channelService.channelExistenceOnOV(channelId)){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(channelService.checkChannelNickNameDuplicate(channelId, participantPostReq.getNickName())){
            return new ResponseEntity(HttpStatus.IM_USED); // 226 이미 사용중임
        }

        Participant participant = new Participant();
        participant.setChannelId(participantPostReq.getConnectionId());
        participant.setNickName(participantPostReq.getNickName());
        participant.setEmail(participantPostReq.getUserEmail());
        if(channelService.joinChannel(participant)){
            return new ResponseEntity(HttpStatus.OK);
        }else{
            return new ResponseEntity(HttpStatus.NOT_ACCEPTABLE);
        }

    }

    @ApiOperation(value = "방생성 하기 위한 방코드")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200,message = "방생성 성공")
            }
    )
    @GetMapping("/create")
    public ResponseEntity beforeCreateChannel(){
        String channelId = channelService.getRandomChannelId();
        return new ResponseEntity(channelId,HttpStatus.OK);
    }

    @ApiOperation(value = "원하는 방에 조인", notes = "방이 존재하는지, 닉네임은 중복되는 지 여부 체크")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200,message = "조인 성공"),
                    @ApiResponse(code = 226,message = "닉네임 중복"),
                    @ApiResponse(code = 404,message = "방이 서버상 존재하지 않음"),
                    @ApiResponse(code = 406,message = "인원초과")
            }
    )
    @PostMapping("/join/{channelId}")
    public ResponseEntity joinChannel(@PathVariable String channelId, @RequestBody ParticipantPostReq participantPostReq){
        channelId = channelId.trim();

        if(!channelService.channelExistenceOnOV(channelId)) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        if(channelService.checkChannelNickNameDuplicate(channelId, participantPostReq.getNickName())){
            return new ResponseEntity(HttpStatus.IM_USED);
        }

        Participant participant = new Participant();
        participant.setChannelId(channelId);
        participant.setEmail(participantPostReq.getUserEmail());
        participant.setNickName(participantPostReq.getNickName());
        participant.setConnectionId(participantPostReq.getConnectionId());
        if(channelService.joinChannel(participant)){
            return new ResponseEntity(HttpStatus.OK);
        }
        else {
            return new ResponseEntity(HttpStatus.NOT_ACCEPTABLE);
        }


    }

    @ApiOperation(value = "방 떠나기",notes = "뒤로가기를 눌러도, 나갈떄도 호출")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200,message = "방 떠나기 성공")
            }
    )
    @PostMapping("/leave/{channelId}")
    public ResponseEntity leaveChannel(@PathVariable String channelId,@RequestBody ParticipantPostReq participantPostReq){
        channelId = channelId.trim();
        channelService.leaveChannel(channelId, participantPostReq.getNickName());
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "방장이 방 떠나기",notes = "방장이 방을 나갈때 호출 -> 서버에서도 삭제")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200,message = "방 떠나기 성공")
            }
    )
    @PostMapping("/delete/{channelId}")
    public ResponseEntity deleteChannel(@PathVariable String channelId,@RequestBody ParticipantPostReq participantPostReq){
        channelId = channelId.trim();
        channelService.deleteChannel(channelId, participantPostReq.getNickName());
        return new ResponseEntity(HttpStatus.OK);
    }

    @ApiOperation(value = "방 정보 얻기")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200,message = "방 정보 얻기 성공"),
                    @ApiResponse(code = 404,message = "방 존재하지 않음")
            }
    )
    @GetMapping("/info/{channelId}")
    public ResponseEntity getChannelInfo(@PathVariable String channelId){
        channelId = channelId.trim();
        ChannelInfoReq channelInfoReq = channelService.getChannelInfo(channelId);
        if(channelInfoReq==null) return new ResponseEntity(HttpStatus.NOT_FOUND);
        return new ResponseEntity(channelInfoReq,HttpStatus.OK);
    }

    @ApiOperation(value = "존재하는 모든 방 정보 얻기")
    @ApiResponses(
            value = {
                    @ApiResponse(code = 200,message = "방 정보 얻기 성공"),
                    @ApiResponse(code = 404,message = "방 존재하지 않음")
            }
    )
    @PostMapping("/infoList")
    public ResponseEntity getChannelInfoList(){
        ArrayList<ChannelInfoReq> channelList = channelService.getChannelList();
        return new ResponseEntity(channelList,HttpStatus.OK);
    }



}
