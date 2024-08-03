-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);
