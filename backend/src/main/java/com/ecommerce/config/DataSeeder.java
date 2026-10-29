package com.ecommerce.config;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

/**
 * Popula o H2 na inicialização.
 * Nicho: Eletrônicos e periféricos de informática.
 * Usuários: admin@ecommerce.com/admin123 (ADMIN) e user@ecommerce.com/user123 (USER).
 * As imagens ficam em frontend/public/images/products (servidas pelo Vite em /images/products/...);
 * cada arquivo corresponde exatamente ao produto do mesmo nome (ver docs/Documentacao.md).
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(UserRepository users, ProductRepository products, PasswordEncoder encoder) {
        return args -> {
            users.save(new User("Administrador", "admin@ecommerce.com", encoder.encode("admin123"), Role.ADMIN));
            users.save(new User("Cliente Teste", "user@ecommerce.com", encoder.encode("user123"), Role.USER));

            // {nome, descrição, preço, arquivo de imagem, estoque, categoria, especificações (separadas por \n)}
            String[][] data = {
                {"Headphone Bluetooth com Cancelamento de Ruído",
                 "Headphone over-ear sem fio com cancelamento ativo de ruído, almofadas macias e estojo rígido de transporte.",
                 "899.90", "fone-bluetooth", "25", "Áudio",
                 "Tipo: Over-ear\nConexão: Bluetooth 5.0 + cabo P2\nCancelamento de ruído: Ativo\nBateria: até 20 h\nInclui: estojo rígido"},
                {"Caixa de Som Bluetooth Portátil",
                 "Caixa de som portátil com som estéreo, alça de transporte e conexão sem fio.",
                 "249.00", "caixa-de-som", "0", "Áudio",
                 "Conexão: Bluetooth\nPotência: 20 W RMS\nBateria: recarregável\nUso: portátil, interno/externo"},
                {"Smartwatch Fitness com Pulseira Cinza",
                 "Relógio inteligente com tela retangular, monitoramento de atividades físicas e pulseira de silicone.",
                 "549.00", "smartwatch", "12", "Wearables",
                 "Tela: retangular AMOLED\nMonitoramento: frequência cardíaca e sono\nPulseira: silicone cinza\nCompatível: Android e iOS"},
                {"Teclado Mecânico Gamer RGB",
                 "Teclado mecânico com iluminação RGB por tecla e estrutura firme para jogos e digitação intensa.",
                 "389.50", "teclado", "30", "Periféricos",
                 "Switch: mecânico\nIluminação: RGB\nLayout: ABNT2\nConexão: USB"},
                {"Mouse Gamer Sem Fio",
                 "Mouse gamer sem fio de alta precisão com botões programáveis e receptor USB.",
                 "329.90", "mouse", "18", "Periféricos",
                 "Conexão: sem fio 2,4 GHz (receptor USB)\nSensor: óptico de alta precisão\nBotões: programáveis\nIluminação: RGB"},
                {"Webcam Full HD 1080p",
                 "Webcam Full HD com microfone integrado e clipe universal para monitor ou notebook.",
                 "299.00", "webcam", "40", "Periféricos",
                 "Resolução: 1080p (Full HD)\nMicrofone: estéreo integrado\nConexão: USB\nFixação: clipe universal"},
                {"Fone de Ouvido Bluetooth TWS com Case",
                 "Fones intra-auriculares totalmente sem fio (true wireless) com case de carregamento compacto.",
                 "179.90", "earbuds", "22", "Áudio",
                 "Tipo: intra-auricular true wireless\nConexão: Bluetooth\nCarregamento: case portátil\nCor: branco"},
                {"SSD NVMe M.2 1 TB",
                 "SSD NVMe M.2 2280 de 1 TB para upgrade de notebooks e desktops, com alta velocidade de leitura e gravação.",
                 "429.90", "ssd", "35", "Armazenamento",
                 "Capacidade: 1 TB\nFormato: M.2 2280\nInterface: NVMe (PCIe)\nUso: notebook e desktop"},
                {"Hub USB-C Multiportas",
                 "Hub USB-C compacto em alumínio que adiciona portas USB-A, USB-C e leitores de cartão SD/microSD ao seu notebook.",
                 "199.00", "hub-usbc", "50", "Acessórios",
                 "Conexão: USB-C\nPortas: USB-A 3.0, USB-C e leitores SD/microSD\nAcabamento: alumínio\nCompatível: MacBook, notebooks e tablets USB-C"}
            };
            for (String[] d : data) {
                products.save(new Product(d[0], d[1], new BigDecimal(d[2]),
                        "/images/products/" + d[3] + ".jpg", Integer.parseInt(d[4]), d[5], d[6]));
            }
        };
    }
}
