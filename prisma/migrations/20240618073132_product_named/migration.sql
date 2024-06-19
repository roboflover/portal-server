-- AlterTable
ALTER TABLE "Catalog" ADD COLUMN     "links" TEXT[],
ADD COLUMN     "pinnedProductId" INTEGER;

-- AlterTable
ALTER TABLE "Exhibition" ADD COLUMN     "links" TEXT[];

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "links" TEXT[],
ADD COLUMN     "oldPrice" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CatalogProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CatalogProducts_AB_unique" ON "_CatalogProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_CatalogProducts_B_index" ON "_CatalogProducts"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catalog" ADD CONSTRAINT "Catalog_pinnedProductId_fkey" FOREIGN KEY ("pinnedProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatalogProducts" ADD CONSTRAINT "_CatalogProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatalogProducts" ADD CONSTRAINT "_CatalogProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
