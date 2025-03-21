-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mar 21, 2025 alle 18:12
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `marketplace`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti`
--

CREATE TABLE `prodotti` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descrizione` text NOT NULL,
  `prezzo` decimal(10,2) NOT NULL,
  `quantita` int(11) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `data_aggiunta` timestamp NOT NULL DEFAULT current_timestamp(),
  `percorso_immagine` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `prodotti`
--

INSERT INTO `prodotti` (`id`, `nome`, `descrizione`, `prezzo`, `quantita`, `categoria`, `data_aggiunta`, `percorso_immagine`) VALUES
(10, 'Basetta ricarica wirless', 'una basetta di ricarica qirless a 45W', 29.99, 10, 'elettronica', '2025-03-21 16:49:38', 'prod_67dd98a2a73de.jpg'),
(11, 'Sedia ergonomica ', 'una bella sedia ergonomica da ufficio per chi passa tante ore al telefono ', 129.99, 5, 'ufficio', '2025-03-21 16:50:40', 'prod_67dd98e08215b.jpg'),
(12, 'Scrivania signorile', 'la scrivania sigorile piu costosa che ci sia', 999.99, 5, 'arredamento', '2025-03-21 16:51:33', 'prod_67dd9915bf54c.jpg'),
(13, 'comodino', 'il miglior comodino che ci sia', 99.99, 4, 'arredamento', '2025-03-21 16:52:07', 'prod_67dd9937280d0.jpg'),
(14, 'tr3 Phone gen1', 'Cuore del dispositivo è il Teraflux Quantum Core, un chipset a 12nm con architettura quantistica a 12 core (4x 4.0 GHz + 8x 3.2 GHz), abbinato a una GPU olografica XR-Engine per rendering in tempo reale di realtà aumentata e mondi virtuali. Supporta 24GB di RAM LPDDR6X e archiviazione 2TB UFS 5.0, espandibile tramite cloud quantistico integrato.', 1300.00, 100, 'elettronica', '2025-03-21 16:54:09', 'prod_67dd99b15dc2b.jpg'),
(15, 'Letto comodissimo', 'Un letto estremamente comodo ', 550.00, 5, 'arredamento', '2025-03-21 16:55:43', 'prod_67dd9a0fd1026.jpg'),
(16, 'Mega portatile', 'Poetatile con M4 , 36 gb di ram e 8TB di ssd m.2', 4560.00, 7, 'elettronica', '2025-03-21 16:57:03', 'prod_67dd9a5f60e94.jpg'),
(17, 'Macchinina Radio comandata', 'La miglior macchinina radiocomandata che ci sia , con velocita fenomelanle', 79.99, 16, 'Giochi', '2025-03-21 16:58:16', 'prod_67dd9aa8c3b6e.jpg');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `prodotti`
--
ALTER TABLE `prodotti`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `prodotti`
--
ALTER TABLE `prodotti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
