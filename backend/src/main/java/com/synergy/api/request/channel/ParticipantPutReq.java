package com.synergy.api.request.channel;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ParticipantPutReq {
    @ApiModelProperty(name = "참가자 닉네임", example = "alice")
    String nickName;
    @ApiModelProperty(name = "참가자 openvidu  connection id" ,example = "")
    String connectionId;

}
