package io.ssafy.gatee.config.security;

import io.ssafy.gatee.domain.member.entity.Privilege;
import io.ssafy.gatee.global.security.user.CustomUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

public class CustomWithMockUserSecurityContextFactory implements WithSecurityContextFactory<CustomWithMockUser> {
    @Override
    public SecurityContext createSecurityContext(CustomWithMockUser annotation) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(annotation.role()));
        CustomUserDetails customUserDetails = CustomUserDetails.builder()
                .username(annotation.memberId())
                .password(UUID.randomUUID().toString())
                .authorities(authorities)
                .privilege(annotation.role())
                .isAccountNonLocked(true)
                .isEnabled(true)
                .isCredentialsNonExpired(true)
                .isAccountNonExpired(true)
                .build();
        Authentication authentication = new UsernamePasswordAuthenticationToken(customUserDetails, null, authorities);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);
        return securityContext;
    }
}