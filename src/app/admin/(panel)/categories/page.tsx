import { getAllCategories, getCategoryCounts } from "@/lib/catalog";
import { PageTitle } from "@/components/admin/ui";
import { CategoriesTable } from "@/components/admin/CategoriesTable";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([getAllCategories(), getCategoryCounts()]);
  return (
    <>
      <PageTitle
        title="Categories"
        subtitle="A category can only be deleted once it has no plants."
        action={{ href: "/admin/categories/new", label: "+ Add category" }}
      />
      <CategoriesTable categories={categories} counts={counts} />
    </>
  );
}
