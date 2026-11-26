import { notFound } from "next/navigation";
import { getCategoryBySlug, getCategoryCounts } from "@/lib/catalog";
import { PageTitle } from "@/components/admin/ui";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, counts] = await Promise.all([getCategoryBySlug(slug), getCategoryCounts()]);
  if (!category) notFound();
  return (
    <>
      <PageTitle title={`Edit ${category.name}`} subtitle={`${counts[slug] ?? 0} plants in this category`} />
      <CategoryForm category={category} plantCount={counts[slug] ?? 0} />
    </>
  );
}
