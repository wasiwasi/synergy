package com.synergy.db.repository;

import com.synergy.common.auth.LogoutAccessToken;
import org.springframework.data.repository.CrudRepository;

public interface LogoutAccessTokenRepository extends CrudRepository<LogoutAccessToken, String> {
}
