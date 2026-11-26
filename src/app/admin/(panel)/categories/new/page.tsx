import { PageTitle } from "@/components/admin/ui";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata = { title: "Add category" };

export default function NewCategoryPage() {
  return (
    <>
      <PageTitle title="Add category" />
      <CategoryForm category={null} />
    </>
  );
}
