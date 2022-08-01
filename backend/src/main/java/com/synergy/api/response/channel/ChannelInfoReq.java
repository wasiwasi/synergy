package com.synergy.api.response.channel;

import com.synergy.db.entity.Participant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
public class ChannelInfoReq {
    final  String channelId;
    final String hostEmail;
    final Integer currentParticipantNumber;
    final ArrayList<Participant> participantList;
}
