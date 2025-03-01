/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Expense` table. All the data in the column will be lost.
  - The primary key for the `Trade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ContractName` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `EnteredAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `EntryPrice` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `ExitPrice` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `ExitedAt` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `Fees` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `Id` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `PnL` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `Size` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `TradeDay` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `TradeDuration` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `updatedat` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractname` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enteredat` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryprice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitedat` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exitprice` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fees` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pnl` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeday` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeduration` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Trade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedat` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_pkey",
DROP COLUMN "ContractName",
DROP COLUMN "CreatedAt",
DROP COLUMN "EnteredAt",
DROP COLUMN "EntryPrice",
DROP COLUMN "ExitPrice",
DROP COLUMN "ExitedAt",
DROP COLUMN "Fees",
DROP COLUMN "Id",
DROP COLUMN "PnL",
DROP COLUMN "Size",
DROP COLUMN "TradeDay",
DROP COLUMN "TradeDuration",
DROP COLUMN "Type",
DROP COLUMN "UpdatedAt",
ADD COLUMN     "contractname" TEXT NOT NULL,
ADD COLUMN     "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enteredat" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "entryprice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "exitedat" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exitprice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fees" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "pnl" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "tradeday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tradeduration" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedat" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id");
