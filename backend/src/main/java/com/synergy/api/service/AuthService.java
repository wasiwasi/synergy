package com.synergy.api.service;

import com.synergy.api.request.UserLoginPostReq;
import com.synergy.api.response.TokenRes;
import com.synergy.common.auth.RefreshToken;
import com.synergy.common.auth.UserDetails;
import com.synergy.common.util.JwtTokenUtil;
import com.synergy.config.TokenConfig;
import com.synergy.db.entity.User;
import com.synergy.db.repository.LogoutAccessTokenRepository;
import com.synergy.db.repository.RefreshTokenRedisRepository;
import com.synergy.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Slf4j
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
//        if(req.getEmail() == null || req.getEmail().equals("") ||
//                req.getPassword() == null || req.getPassword().equals(""))
//            throw new IllegalArgumentException("이메일과 비밀번호를 입력해주세요");

        if(req.getEmail() == null || req.getPassword() == null)
            throw new IllegalArgumentException("please enter email and password");

        log.info("req email: "+req.getEmail()+" req password: "+req.getPassword());

        // 사용자 이메일로 사용자가 존재하는지 확인
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(NoSuchElementException::new);

        log.info("user info:"+user.toString());

        // 입력으로 들어온 비밀번호와 DB에 저장된 암호를 비교해 비밀번호가 맞는지 확인
        //checkPassword(req.getPassword(), user.getPassword());

        //
        String accessToken = JwtTokenUtil.getToken(req.getEmail());
        log.debug("created access token "+accessToken);
        RefreshToken refreshToken = saveRefreshToken(req.getEmail());
        log.debug("created refresh token "+refreshToken);

        return new TokenRes(accessToken, refreshToken.getRefreshToken());
    }

    public void checkPassword(String rawPass, String encodedPassword) {
        if(!passwordEncoder.matches(rawPass, encodedPassword)) {
            throw new IllegalArgumentException("wrong password");
        }
    }

    public RefreshToken saveRefreshToken(String userEmail) {
        return refreshTokenRedisRepository.save(RefreshToken.createRefreshToken(userEmail,
                JwtTokenUtil.getToken(userEmail), TokenConfig.DEFAULT_EXPIRE_SEC));
    }

    // TODO: 여기부터 다시 시작
    public String resolveToken(String token) {
        int headerLength = 7;
        return token.substring(headerLength);
    }

    public TokenRes reissue(String refreshToken) {
        refreshToken = resolveToken(refreshToken);
        String email = getCurrentUserEmail();
        RefreshToken redisRefreshToken = refreshTokenRedisRepository.findById(email).orElseThrow(NoSuchElementException::new);

        if(refreshToken.equals(redisRefreshToken.getRefreshToken())) {
            return reissueRefreshToken(refreshToken, email);
        }
        throw new IllegalArgumentException("토큰이 일치하지 않습니다");
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails principal = (UserDetails) authentication.getPrincipal();
        return principal.getUsername();
    }

    public TokenRes reissueRefreshToken(String refreshToken, String userId) {
        return null;
    }

    public boolean lessThenReissueExpirationTimesLeft(String refreshToken) {
        return false;
    }
}
