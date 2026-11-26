import { getAllCategories, getAllPlants } from "@/lib/catalog";
import { PageTitle } from "@/components/admin/ui";
import { PlantsTable } from "@/components/admin/PlantsTable";

export const metadata = { title: "Plants" };

export default async function AdminPlantsPage() {
  const [plants, categories] = await Promise.all([getAllPlants(), getAllCategories()]);
  return (
    <>
      <PageTitle title="Plants" subtitle={`${plants.length} plants in the catalogue`} action={{ href: "/admin/plants/new", label: "+ Add plant" }} />
      <PlantsTable plants={plants} categories={categories} />
    </>
  );
}
