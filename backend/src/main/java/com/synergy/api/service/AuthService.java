package com.synergy.api.service;

import com.synergy.api.request.UserLoginPostReq;
import com.synergy.api.response.TokenRes;
import com.synergy.common.auth.RefreshToken;
import com.synergy.common.util.JwtTokenUtil;
import com.synergy.config.TokenConfig;
import com.synergy.db.entity.User;
import com.synergy.db.repository.LogoutAccessTokenRepository;
import com.synergy.db.repository.RefreshTokenRedisRepository;
import com.synergy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRedisRepository refreshTokenRedisRepository;
    private final LogoutAccessTokenRepository logoutAccessTokenRepository;

    public TokenRes login(UserLoginPostReq req) {
        // 이메일과 비밀번호 모두 비어서는 안됨
        if(req.getEmail() == null || req.getEmail().equals("") ||
                req.getPassword() == null || req.getPassword().equals(""))
            throw new IllegalArgumentException("이메일과 비밀번호를 입력해주세요");

        // 사용자 이메일로 (현재 기존 코드는 userId로 찾는다) 사용자가 존재하는지 확인
        User user = userRepository.findByUserId(req.getEmail()).orElseThrow(NoSuchElementException::new);

        // 비밀번호가 맞는지 확인
        checkPassword(req.getPassword(), user.getPassword());
    }

    public void checkPassword(String rawPass, String encodedPassword) {
        if(!passwordEncoder.matches(rawPass, encodedPassword)) {
            throw new IllegalArgumentException("비밀번호가 맞지 않습니다");
        }
    }

    public RefreshToken saveRefreshToken(String userEmail) {
        return refreshTokenRedisRepository.save(RefreshToken.createRefreshToken(userEmail,
                JwtTokenUtil.getToken(userEmail), TokenConfig.DEFAULT_EXPIRE_SEC));
    }

    // TODO: 여기부터 다시 시작
    public String resolveToken(String token) {
        return null;
    }

    public TokenRes reissue(String refreshToken) {
        return null;
    }

    public TokenRes reissueRefreshToken(String refreshToken, String userId) {
        return null;
    }

    public boolean lessThenReissueExpirationTimesLeft(String refreshToken) {
        return false;
    }
}
