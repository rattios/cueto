-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-10-2017 a las 22:39:39
-- Versión del servidor: 10.1.21-MariaDB
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdcueto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carteras`
--

CREATE TABLE `carteras` (
  `id` int(10) UNSIGNED NOT NULL,
  `numero` int(11) NOT NULL,
  `descripcion` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(10) UNSIGNED NOT NULL,
  `tipo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `apellido_1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apellido_2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dni` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `f_nacimiento` date NOT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sexo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `cuota` double(8,2) DEFAULT NULL,
  `f_moroso` date DEFAULT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `cartera_id` int(10) UNSIGNED DEFAULT NULL,
  `convenio_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contratos`
--

CREATE TABLE `contratos` (
  `id` int(10) UNSIGNED NOT NULL,
  `num_contrato` int(11) NOT NULL,
  `num_documento` int(11) NOT NULL,
  `ruta_documento` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `convenios`
--

CREATE TABLE `convenios` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `empresa` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docs_canceladores`
--

CREATE TABLE `docs_canceladores` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `recibo_id` int(10) UNSIGNED NOT NULL,
  `rendicion_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre_1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apellido_1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apellido_2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dni` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `f_nacimiento` date NOT NULL,
  `sexo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `observaciones` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiares`
--

CREATE TABLE `familiares` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre_1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nombre_2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `apellido_1` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apellido_2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dni` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `f_nacimiento` date NOT NULL,
  `sexo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `vinculo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `observaciones` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED DEFAULT NULL,
  `empleado_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2017_10_04_162942_sucursales_migration', 1),
('2017_10_04_163215_carteras_migration', 1),
('2017_10_04_163834_usuarios_migration', 1),
('2017_10_04_170020_convenios_migration', 1),
('2017_10_04_171044_clientes_migration', 1),
('2017_10_04_210521_pagos_migration', 1),
('2017_10_04_211521_contratos_migration', 1),
('2017_10_04_212128_empleados_migration', 1),
('2017_10_04_212834_familiares_migration', 1),
('2017_10_05_130349_rendiciones_migration', 1),
('2017_10_05_131440_recibos_migration', 1),
('2017_10_05_133330_docs_canceladores_migration', 1),
('2017_10_06_100600_tarifas_cueto_migration', 1),
('2017_10_06_100632_tarifas_cueto_sola_migration', 1),
('2017_10_06_100709_tarifas_convenio_migration', 1),
('2017_10_06_100741_tarifas_convenio_sola_migration', 1),
('2017_10_20_123246_tickets_cartera_migration', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(10) UNSIGNED NOT NULL,
  `monto` double(8,2) NOT NULL,
  `mes` int(11) NOT NULL,
  `anio` int(11) NOT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recibos`
--

CREATE TABLE `recibos` (
  `id` int(10) UNSIGNED NOT NULL,
  `num_recibo` int(11) NOT NULL,
  `importe` int(11) NOT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `mes` int(11) NOT NULL,
  `anio` int(11) NOT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `convenio_id` int(10) UNSIGNED DEFAULT NULL,
  `cartera_id` int(10) UNSIGNED DEFAULT NULL,
  `cliente_id` int(10) UNSIGNED NOT NULL,
  `rendicion_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rendiciones`
--

CREATE TABLE `rendiciones` (
  `id` int(10) UNSIGNED NOT NULL,
  `estado` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sucursal_id` int(10) UNSIGNED NOT NULL,
  `cartera_id` int(10) UNSIGNED NOT NULL,
  `cobrador_id` int(10) UNSIGNED NOT NULL,
  `autorizante_id` int(10) UNSIGNED DEFAULT NULL,
  `f_autorizacion` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifasconvenio`
--

CREATE TABLE `tarifasconvenio` (
  `id` int(10) UNSIGNED NOT NULL,
  `edad_min` int(11) NOT NULL,
  `edad_max` int(11) NOT NULL,
  `tarifa` double(8,2) NOT NULL,
  `carencia` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifasconveniosola`
--

CREATE TABLE `tarifasconveniosola` (
  `id` int(10) UNSIGNED NOT NULL,
  `edad_min` int(11) NOT NULL,
  `edad_max` int(11) NOT NULL,
  `tarifa` double(8,2) NOT NULL,
  `carencia` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifascueto`
--

CREATE TABLE `tarifascueto` (
  `id` int(10) UNSIGNED NOT NULL,
  `edad_min` int(11) NOT NULL,
  `edad_max` int(11) NOT NULL,
  `tarifa` double(8,2) NOT NULL,
  `carencia` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarifascuetosola`
--

CREATE TABLE `tarifascuetosola` (
  `id` int(10) UNSIGNED NOT NULL,
  `edad_min` int(11) NOT NULL,
  `edad_max` int(11) NOT NULL,
  `tarifa` double(8,2) NOT NULL,
  `carencia` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets_cartera`
--

CREATE TABLE `tickets_cartera` (
  `id` int(10) UNSIGNED NOT NULL,
  `ticket` int(11) NOT NULL,
  `cartera_id` int(10) UNSIGNED NOT NULL,
  `cliente_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(10) UNSIGNED NOT NULL,
  `user` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `correo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rol` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `apellido` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sucursal_id` int(10) UNSIGNED DEFAULT NULL,
  `cartera_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carteras`
--
ALTER TABLE `carteras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `carteras_numero_unique` (`numero`),
  ADD KEY `carteras_sucursal_id_foreign` (`sucursal_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clientes_dni_unique` (`dni`),
  ADD KEY `clientes_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `clientes_user_id_foreign` (`user_id`),
  ADD KEY `clientes_cartera_id_foreign` (`cartera_id`),
  ADD KEY `clientes_convenio_id_foreign` (`convenio_id`);

--
-- Indices de la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contratos_num_contrato_unique` (`num_contrato`),
  ADD UNIQUE KEY `contratos_num_documento_unique` (`num_documento`),
  ADD KEY `contratos_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `contratos_cliente_id_foreign` (`cliente_id`);

--
-- Indices de la tabla `convenios`
--
ALTER TABLE `convenios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `convenios_sucursal_id_foreign` (`sucursal_id`);

--
-- Indices de la tabla `docs_canceladores`
--
ALTER TABLE `docs_canceladores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docs_canceladores_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `docs_canceladores_recibo_id_foreign` (`recibo_id`),
  ADD KEY `docs_canceladores_rendicion_id_foreign` (`rendicion_id`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `empleados_dni_unique` (`dni`),
  ADD KEY `empleados_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `empleados_cliente_id_foreign` (`cliente_id`);

--
-- Indices de la tabla `familiares`
--
ALTER TABLE `familiares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `familiares_dni_unique` (`dni`),
  ADD KEY `familiares_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `familiares_cliente_id_foreign` (`cliente_id`),
  ADD KEY `familiares_empleado_id_foreign` (`empleado_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pagos_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `pagos_cliente_id_foreign` (`cliente_id`);

--
-- Indices de la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `recibos_num_recibo_unique` (`num_recibo`),
  ADD KEY `recibos_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `recibos_convenio_id_foreign` (`convenio_id`),
  ADD KEY `recibos_cartera_id_foreign` (`cartera_id`),
  ADD KEY `recibos_cliente_id_foreign` (`cliente_id`),
  ADD KEY `recibos_rendicion_id_foreign` (`rendicion_id`);

--
-- Indices de la tabla `rendiciones`
--
ALTER TABLE `rendiciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rendiciones_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `rendiciones_cartera_id_foreign` (`cartera_id`),
  ADD KEY `rendiciones_cobrador_id_foreign` (`cobrador_id`),
  ADD KEY `rendiciones_autorizante_id_foreign` (`autorizante_id`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sucursales_correo_unique` (`correo`);

--
-- Indices de la tabla `tarifasconvenio`
--
ALTER TABLE `tarifasconvenio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tarifasconveniosola`
--
ALTER TABLE `tarifasconveniosola`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tarifascueto`
--
ALTER TABLE `tarifascueto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tarifascuetosola`
--
ALTER TABLE `tarifascuetosola`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tickets_cartera`
--
ALTER TABLE `tickets_cartera`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tickets_cartera_cartera_id_foreign` (`cartera_id`),
  ADD KEY `tickets_cartera_cliente_id_foreign` (`cliente_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuarios_user_unique` (`user`),
  ADD UNIQUE KEY `usuarios_correo_unique` (`correo`),
  ADD KEY `usuarios_sucursal_id_foreign` (`sucursal_id`),
  ADD KEY `usuarios_cartera_id_foreign` (`cartera_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carteras`
--
ALTER TABLE `carteras`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `contratos`
--
ALTER TABLE `contratos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `convenios`
--
ALTER TABLE `convenios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `docs_canceladores`
--
ALTER TABLE `docs_canceladores`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `familiares`
--
ALTER TABLE `familiares`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `recibos`
--
ALTER TABLE `recibos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `rendiciones`
--
ALTER TABLE `rendiciones`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `tarifasconvenio`
--
ALTER TABLE `tarifasconvenio`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `tarifasconveniosola`
--
ALTER TABLE `tarifasconveniosola`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `tarifascueto`
--
ALTER TABLE `tarifascueto`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `tarifascuetosola`
--
ALTER TABLE `tarifascuetosola`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `tickets_cartera`
--
ALTER TABLE `tickets_cartera`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carteras`
--
ALTER TABLE `carteras`
  ADD CONSTRAINT `carteras_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_cartera_id_foreign` FOREIGN KEY (`cartera_id`) REFERENCES `carteras` (`id`),
  ADD CONSTRAINT `clientes_convenio_id_foreign` FOREIGN KEY (`convenio_id`) REFERENCES `convenios` (`id`),
  ADD CONSTRAINT `clientes_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`),
  ADD CONSTRAINT `clientes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `contratos`
--
ALTER TABLE `contratos`
  ADD CONSTRAINT `contratos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `contratos_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `convenios`
--
ALTER TABLE `convenios`
  ADD CONSTRAINT `convenios_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `docs_canceladores`
--
ALTER TABLE `docs_canceladores`
  ADD CONSTRAINT `docs_canceladores_recibo_id_foreign` FOREIGN KEY (`recibo_id`) REFERENCES `recibos` (`id`),
  ADD CONSTRAINT `docs_canceladores_rendicion_id_foreign` FOREIGN KEY (`rendicion_id`) REFERENCES `rendiciones` (`id`),
  ADD CONSTRAINT `docs_canceladores_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD CONSTRAINT `empleados_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `empleados_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `familiares`
--
ALTER TABLE `familiares`
  ADD CONSTRAINT `familiares_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `familiares_empleado_id_foreign` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`),
  ADD CONSTRAINT `familiares_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `pagos_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `recibos`
--
ALTER TABLE `recibos`
  ADD CONSTRAINT `recibos_cartera_id_foreign` FOREIGN KEY (`cartera_id`) REFERENCES `carteras` (`id`),
  ADD CONSTRAINT `recibos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `recibos_convenio_id_foreign` FOREIGN KEY (`convenio_id`) REFERENCES `convenios` (`id`),
  ADD CONSTRAINT `recibos_rendicion_id_foreign` FOREIGN KEY (`rendicion_id`) REFERENCES `rendiciones` (`id`),
  ADD CONSTRAINT `recibos_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `rendiciones`
--
ALTER TABLE `rendiciones`
  ADD CONSTRAINT `rendiciones_autorizante_id_foreign` FOREIGN KEY (`autorizante_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `rendiciones_cartera_id_foreign` FOREIGN KEY (`cartera_id`) REFERENCES `carteras` (`id`),
  ADD CONSTRAINT `rendiciones_cobrador_id_foreign` FOREIGN KEY (`cobrador_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `rendiciones_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `tickets_cartera`
--
ALTER TABLE `tickets_cartera`
  ADD CONSTRAINT `tickets_cartera_cartera_id_foreign` FOREIGN KEY (`cartera_id`) REFERENCES `carteras` (`id`),
  ADD CONSTRAINT `tickets_cartera_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_cartera_id_foreign` FOREIGN KEY (`cartera_id`) REFERENCES `carteras` (`id`),
  ADD CONSTRAINT `usuarios_sucursal_id_foreign` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
