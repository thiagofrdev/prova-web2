-- CreateTable
CREATE TABLE `Crianca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeCompleto` VARCHAR(191) NOT NULL,
    `nomePai` VARCHAR(191) NOT NULL,
    `nomeMae` VARCHAR(191) NOT NULL,
    `sexo` VARCHAR(191) NOT NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `certidaoNascimento` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Crianca_certidaoNascimento_key`(`certidaoNascimento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vacina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `quantidadeDosesNormal` INTEGER NOT NULL,
    `quantidadeDosesReforco` INTEGER NOT NULL,

    UNIQUE INDEX `Vacina_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doenca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `cid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Doenca_nome_key`(`nome`),
    UNIQUE INDEX `Doenca_cid_key`(`cid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aplicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataAplicacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tipoDose` VARCHAR(191) NOT NULL,
    `numeroDose` INTEGER NOT NULL,
    `criancaId` INTEGER NOT NULL,
    `vacinaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DoencaToVacina` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DoencaToVacina_AB_unique`(`A`, `B`),
    INDEX `_DoencaToVacina_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Aplicacao` ADD CONSTRAINT `Aplicacao_criancaId_fkey` FOREIGN KEY (`criancaId`) REFERENCES `Crianca`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aplicacao` ADD CONSTRAINT `Aplicacao_vacinaId_fkey` FOREIGN KEY (`vacinaId`) REFERENCES `Vacina`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DoencaToVacina` ADD CONSTRAINT `_DoencaToVacina_A_fkey` FOREIGN KEY (`A`) REFERENCES `Doenca`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DoencaToVacina` ADD CONSTRAINT `_DoencaToVacina_B_fkey` FOREIGN KEY (`B`) REFERENCES `Vacina`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
