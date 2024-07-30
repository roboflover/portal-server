-- CreateTable
CREATE TABLE "OrderPrint3d" (
    "id" SERIAL NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "orderName" TEXT NOT NULL,
    "orderDetails" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "OrderPrint3d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPrint3d" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemQuantity" INTEGER NOT NULL,
    "itemPrice" DOUBLE PRECISION NOT NULL,
    "itemDetails" TEXT NOT NULL,
    "item3DModel" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "ItemPrint3d_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderPrint3d_orderNumber_key" ON "OrderPrint3d"("orderNumber");

-- AddForeignKey
ALTER TABLE "ItemPrint3d" ADD CONSTRAINT "ItemPrint3d_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderPrint3d"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
