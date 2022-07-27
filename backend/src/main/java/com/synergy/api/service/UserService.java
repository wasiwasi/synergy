package com.synergy.api.service;

import com.synergy.api.request.UserRegisterPostReq;
import com.synergy.db.entity.User;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserRegisterPostReq userRegisterInfo);
	User getUserByUserId(String userId);
    boolean isExistEmail(String email);
    boolean isExistNickname(String nickname);
    boolean authorizeUser(String id, String code);
}