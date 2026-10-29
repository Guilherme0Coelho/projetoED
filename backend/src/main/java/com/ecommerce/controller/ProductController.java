package com.ecommerce.controller;

import com.ecommerce.dto.Dtos.*;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<ProductResponse> list(@RequestParam(required = false) String search,
                                              @RequestParam(required = false) String category,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "8") int size) {
        return service.list(search, category, page, size);
    }

    // Declarado antes de "/{id}" por clareza; o mapeamento literal tem precedência
    @GetMapping("/categories")
    public java.util.List<String> categories() {
        return service.categories();
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    // Proteção por perfil definida no SecurityConfig (hasRole ADMIN)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest req) {
        return service.create(req);
    }
}
