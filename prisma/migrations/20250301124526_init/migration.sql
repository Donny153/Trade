/*
  Warnings:

  - The primary key for the `Trade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contractName` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `enteredAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `entryPrice` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `exitPrice` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `exitedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `pnl` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `tradeDay` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `tradeDuration` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `ContractName` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EnteredAt` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EntryPrice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ExitPrice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ExitedAt` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Fees` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PnL` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Size` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TradeDay` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TradeDuration` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_pkey",
DROP COLUMN "contractName",
DROP COLUMN "createdAt",
DROP COLUMN "enteredAt",
DROP COLUMN "entryPrice",
DROP COLUMN "exitPrice",
DROP COLUMN "exitedAt",
DROP COLUMN "fees",
DROP COLUMN "id",
DROP COLUMN "pnl",
DROP COLUMN "size",
DROP COLUMN "tradeDay",
DROP COLUMN "tradeDuration",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
ADD COLUMN     "ContractName" TEXT NOT NULL,
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "EnteredAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "EntryPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ExitPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ExitedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Fees" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD COLUMN     "PnL" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Size" TEXT NOT NULL,
ADD COLUMN     "TradeDay" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "TradeDuration" TEXT NOT NULL,
ADD COLUMN     "Type" TEXT NOT NULL,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("Id");
