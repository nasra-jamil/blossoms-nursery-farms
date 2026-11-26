import { notFound } from "next/navigation";
import { getAllCategories, getPlantById } from "@/lib/catalog";
import { PageTitle } from "@/components/admin/ui";
import { PlantForm } from "@/components/admin/PlantForm";

export const metadata = { title: "Edit plant" };

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [plant, categories] = await Promise.all([getPlantById(id), getAllCategories()]);
  if (!plant) notFound();
  return (
    <>
      <PageTitle title={`Edit ${plant.name}`} subtitle={`/plants/${plant.slug}`} />
      <PlantForm plant={plant} categories={categories} />
    </>
  );
}
