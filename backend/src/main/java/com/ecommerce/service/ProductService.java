package com.ecommerce.service;

import com.ecommerce.dto.Dtos.*;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public PageResponse<ProductResponse> list(String search, String category, int page, int size) {
        // Limita size para evitar consultas gigantes
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), Sort.by("id"));
        boolean hasSearch = search != null && !search.isBlank();
        boolean hasCategory = category != null && !category.isBlank();
        var result = hasSearch && hasCategory ? repository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(search.trim(), category.trim(), pageable)
                : hasSearch ? repository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : hasCategory ? repository.findByCategoryIgnoreCase(category.trim(), pageable)
                : repository.findAll(pageable);
        return PageResponse.from(result);
    }

    public java.util.List<String> categories() {
        return repository.findDistinctCategories();
    }

    public ProductResponse findById(Long id) {
        return repository.findById(id).map(ProductResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado"));
    }

    public ProductResponse create(ProductRequest req) {
        Product p = new Product(req.name().trim(), req.description(), req.price(), req.imageUrl(), req.stock(),
                req.category(), req.specs());
        return ProductResponse.from(repository.save(p));
    }
}
