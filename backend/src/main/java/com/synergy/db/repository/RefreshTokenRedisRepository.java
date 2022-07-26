package com.synergy.db.repository;

import com.synergy.common.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRedisRepository extends JpaRepository<RefreshToken, String> {
}
