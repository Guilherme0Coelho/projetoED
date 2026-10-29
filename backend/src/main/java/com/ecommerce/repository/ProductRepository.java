package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndCategoryIgnoreCase(String name, String category, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("select distinct p.category from Product p where p.category is not null order by p.category")
    java.util.List<String> findDistinctCategories();
}
