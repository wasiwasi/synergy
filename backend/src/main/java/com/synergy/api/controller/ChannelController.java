package com.synergy.api.controller;

import com.synergy.api.request.channel.ParticipantPostReq;
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





}
