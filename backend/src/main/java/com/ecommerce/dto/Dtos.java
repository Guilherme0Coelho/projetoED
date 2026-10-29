package com.ecommerce.dto;

import com.ecommerce.entity.Product;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

// Records agrupados em um arquivo para manter o projeto enxuto.
public final class Dtos {
    private Dtos() {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password) {}

    public record RegisterRequest(
            @NotBlank @Size(min = 2, max = 100) String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, max = 72) String password) {}

    public record AuthResponse(String token, String name, String email, String role) {}

    public record ProductRequest(
            @NotBlank String name,
            @Size(max = 2000) String description,
            @NotNull @DecimalMin("0.01") BigDecimal price,
            String imageUrl,
            @NotNull @Min(0) Integer stock,
            String category,
            @Size(max = 2000) String specs) {}

    public record ProductResponse(Long id, String name, String description,
                                  BigDecimal price, String imageUrl, Integer stock,
                                  String category, String specs) {
        public static ProductResponse from(Product p) {
            return new ProductResponse(p.getId(), p.getName(), p.getDescription(),
                    p.getPrice(), p.getImageUrl(), p.getStock(), p.getCategory(), p.getSpecs());
        }
    }

    // Wrapper próprio: evita serializar PageImpl diretamente (estrutura instável).
    public record PageResponse<T>(List<T> content, int page, int size,
                                  long totalElements, int totalPages) {
        public static PageResponse<ProductResponse> from(Page<Product> p) {
            return new PageResponse<>(p.getContent().stream().map(ProductResponse::from).toList(),
                    p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
        }
    }

    public record ErrorResponse(String message) {}
}
