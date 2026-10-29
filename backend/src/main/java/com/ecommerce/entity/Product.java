package com.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    // BigDecimal: nunca usar double para valores monetários
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String imageUrl;

    private Integer stock = 0;

    private String category;

    // Especificações técnicas exibidas no detalhe (texto, uma por linha)
    @Column(length = 2000)
    private String specs;

    public Product() {}

    public Product(String name, String description, BigDecimal price, String imageUrl, Integer stock,
                   String category, String specs) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.stock = stock;
        this.category = category;
        this.specs = specs;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSpecs() { return specs; }
    public void setSpecs(String specs) { this.specs = specs; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
