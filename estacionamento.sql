CREATE DATABASE estacionamento;
USE estacionamento;

CREATE TABLE IF NOT EXISTS automovel (
    auto_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    auto_modelo VARCHAR(100) NOT NULL,
    auto_preco DECIMAL(10, 2) NOT NULL,
    
    PRIMARY KEY (auto_id)
);

INSERT INTO automovel (auto_id, auto_modelo, auto_preco) VALUES
(1, 'Fiat Strada', 43115.00),
(2, 'Fiat Argo', 47660.00),
(3, 'Fiat Mobi', 32102.00),
(4, 'Jeep Compass', 34950.00),
(5, 'Hyundai HB20', 49302.00),
(6, 'Jeep Renegade', 36661.00),
(7, 'Volkswagen T-Cross', 38182.00),
(8, 'Fiat Toro', 57733.00),
(9, 'Hyundai Creta', 55998.00),
(10, 'Chevrolet S10', 51035.00),
(11, 'Toyota Corolla Cross', 34544.00),
(12, 'Toyota Hilux', 53937.00),
(13, 'Toyota Corolla', 55022.00),
(14, 'Volkswagen Gol', 48253.00),
(15, 'Honda HR-V', 53438.00),
(16, 'Renault Kwid', 31810.00),
(17, 'Volkswagen Nivus', 35104.00),
(18, 'Hyundai HB20S', 31855.00),
(19, 'Ford Ranger', 48927.00),
(20, 'Fiat Uno', 38111.00),
(21, 'Fiat Cronos', 36515.00),
(22, 'Citroën C4 Cactus', 53654.00),
(23, 'Toyota Yaris Hatchback', 55869.00),
(24, 'Volkswagen Voyage', 30954.00),
(25, 'Honda Civic', 30871.00),
(26, 'Volkswagen Saveiro', 32306.00),
(27, 'Caoa Chery Tiggo 5x', 30069.00),
(28, 'Volkswagen Virtus', 40689.00),
(29, 'Fiat Grand Siena', 33469.00),
(30, 'Caoa Chery Tiggo 8', 48481.00),
(31, 'Chevrolet Tracker', 30648.00),
(32, 'Peugeot 208', 46934.00),
(33, 'Toyota SW4', 54252.00),
(34, 'Nissan Frontier', 32596.00),
(35, 'Honda WR-V', 35139.00),
(36, 'Volkswagen Taos', 47546.00),
(37, 'Mitsubishi L200', 57049.00),
(38, 'Renault Oroch', 48756.00),
(39, 'Toyota Yaris Sedan', 43077.00),
(40, 'Renault Duster', 52641.00);

CREATE TABLE IF NOT EXISTS cliente (
    cliente_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    cliente_nome VARCHAR(100),
    
    PRIMARY KEY (cliente_id)
);

INSERT INTO cliente (cliente_id, cliente_nome) VALUES
(1, 'Adalberto Martins da Silva'),
(2, 'Adan Roger Guimarães Dias'),
(3, 'Adão Walter Gomes de Sousa'),
(4, 'Adelson Fernandes Sena'),
(5, 'Ademir Augusto Simões'),
(6, 'Ademir Borges dos Santos'),
(7, 'Adilio José da Silva Santos'),
(8, 'Adriana Ferreira de Lima Teodoro'),
(9, 'Adriano Bezerra Apolinario'),
(10, 'Adriano Heleno Basso'),
(11, 'Adriano Lourenço do Rego'),
(12, 'Adriano Matos Santos'),
(13, 'Adriano Pires Caetano'),
(14, 'Adriano Prada de Campos'),
(15, 'Adriel Alberto dos Santos'),
(16, 'Agner Vinicius Marques de Camargo'),
(17, 'Agrinaldo Ferreira Soares'),
(18, 'Alan Jhonnes Banlian da Silva e Sá'),
(19, 'Alberto Ramos Rodrigues'),
(20, 'Alcides José Ramos'),
(21, 'Aldemir SantAna dos Santos'),
(22, 'Aleksandro Marcelo da Silva'),
(23, 'Alessandro Martins Silva'),
(24, 'Alessandro Sanches'),
(25, 'Alex dos Reis de Jesus'),
(26, 'Alex Ferreira Soares'),
(27, 'Alex Sandro Oliveira'),
(28, 'Alex Souza Farias'),
(29, 'Alexandra de Lima Silva'),
(30, 'Alexandre Clemente da Costa');

CREATE TABLE IF NOT EXISTS concessionaria (
    conc_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    conc_nome VARCHAR(100) NOT NULL,
    
    PRIMARY KEY(conc_id)
);

INSERT INTO concessionaria (conc_id, conc_nome) VALUES
(1, 'Atena concessionária'),
(2, 'Deméter concessionária'),
(3, 'Hera concessionária'),
(4, 'Estia concessionária'),
(5, 'Perséfone concessionária');

CREATE TABLE IF NOT EXISTS alocacao (
    alocacao_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    alocacao_area INT NOT NULL,
    alocacao_automovel INT NOT NULL,
    alocacao_concessionaria INT NOT NULL,
    alocacao_quantidade INT NOT NULL,
    
    PRIMARY KEY(alocacao_id),

    FOREIGN KEY (alocacao_automovel) REFERENCES automovel(auto_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (alocacao_concessionaria) REFERENCES concessionaria(conc_id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO alocacao (alocacao_id, alocacao_area, alocacao_automovel, alocacao_concessionaria, alocacao_quantidade) VALUES
(1, 1, 1, 1, 8),
(2, 2, 2, 2, 1),
(3, 4, 3, 3, 4),
(4, 7, 4, 4, 6),
(5, 8, 5, 5, 4),
(6, 9, 6, 1, 4),
(7, 10, 7, 2, 1),
(8, 1, 8, 2, 7),
(9, 2, 9, 3, 2),
(10, 4, 10, 4, 6),
(11, 7, 11, 5, 3),
(12, 8, 12, 1, 9),
(13, 9, 13, 2, 9),
(14, 10, 14, 3, 6),
(15, 1, 15, 3, 4),
(16, 2, 16, 4, 1),
(17, 4, 17, 5, 8),
(18, 7, 18, 1, 4),
(19, 8, 19, 2, 10),
(20, 9, 20, 3, 10),
(21, 10, 21, 4, 7),
(22, 1, 22, 4, 3),
(23, 2, 23, 5, 5),
(24, 4, 24, 1, 4),
(25, 7, 25, 2, 3),
(26, 8, 26, 3, 3),
(27, 9, 27, 4, 10),
(28, 10, 28, 5, 4),
(29, 1, 29, 1, 2),
(30, 2, 30, 2, 3),
(31, 4, 31, 3, 4),
(32, 7, 32, 4, 2),
(33, 8, 33, 5, 3),
(34, 9, 34, 1, 4),
(35, 10, 35, 2, 3),
(36, 1, 36, 3, 2),
(37, 2, 37, 4, 3),
(38, 4, 38, 5, 3),
(39, 7, 39, 1, 2),
(40, 8, 40, 2, 1);

CREATE TABLE IF NOT EXISTS venda (
    venda_id INT NOT NULL UNIQUE AUTO_INCREMENT,
    venda_automovel INT NOT NULL,
    venda_cliente INT NOT NULL,
    venda_conc INT NOT NULL,
    venda_data DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY(venda_id),

    FOREIGN KEY (venda_automovel) REFERENCES automovel(auto_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (venda_cliente) REFERENCES cliente(cliente_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (venda_conc) REFERENCES concessionaria(conc_id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO venda (venda_id, venda_automovel, venda_cliente, venda_conc)  VALUES 
(1,1,1,1),
(2,23,22,5),
(3,21,20,4),
(4,34,2,1),
(5,19,24,2),
(6,33,21,5),
(7,4,23,4),
(8,31,24,3),
(9,4,30,4);

