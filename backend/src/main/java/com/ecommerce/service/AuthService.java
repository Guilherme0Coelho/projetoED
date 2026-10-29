package com.ecommerce.service;

import com.ecommerce.dto.Dtos.*;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }
        // Cadastro público sempre cria USER; ADMIN só via seed/banco (evita escalada de privilégio)
        User user = userRepository.save(
                new User(req.name().trim(), email, passwordEncoder.encode(req.password()), Role.USER));
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        // Lança BadCredentialsException (tratada no handler global -> 401)
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.password()));
        User user = userRepository.findByEmail(email).orElseThrow();
        return toResponse(user);
    }

    private AuthResponse toResponse(User u) {
        return new AuthResponse(tokenProvider.generateToken(u.getEmail(), u.getRole().name()),
                u.getName(), u.getEmail(), u.getRole().name());
    }
}
