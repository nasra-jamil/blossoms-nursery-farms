import { getAllCategories } from "@/lib/catalog";
import { PageTitle } from "@/components/admin/ui";
import { PlantForm } from "@/components/admin/PlantForm";

export const metadata = { title: "Add plant" };

export default async function NewPlantPage() {
  const categories = await getAllCategories();
  return (
    <>
      <PageTitle title="Add plant" subtitle="It appears on the website as soon as you save." />
      <PlantForm plant={null} categories={categories} />
    </>
  );
}
