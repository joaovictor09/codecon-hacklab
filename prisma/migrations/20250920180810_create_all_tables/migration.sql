-- CreateTable
CREATE TABLE "public"."ideas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "current_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "payment_link_id" TEXT NOT NULL,
    "payment_link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."donors" (
    "id" TEXT NOT NULL,
    "idea_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "donor_name" TEXT,
    "donor_email" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."donors" ADD CONSTRAINT "donors_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "public"."ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
