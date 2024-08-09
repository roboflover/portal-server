-- CreateTable
CREATE TABLE "OrderCatalog" (
    "id" SERIAL NOT NULL,
    "orderNumber" INTEGER,
    "orderTitle" TEXT,
    "orderDescription" TEXT,
    "quantity" INTEGER,
    "summa" DOUBLE PRECISION,
    "deliveryAddress" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "orderStatus" TEXT,
    "comment" TEXT,

    CONSTRAINT "OrderCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review3dPrint" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "links" TEXT[],
    "isPinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Review3dPrint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "reviewId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewImage" ADD CONSTRAINT "ReviewImage_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review3dPrint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
