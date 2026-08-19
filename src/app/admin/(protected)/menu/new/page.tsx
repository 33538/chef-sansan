import { MenuItemForm } from "@/components/MenuItemForm";

export default function NewMenuItemPage() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-brand-dark">Add menu item</h2>
      <MenuItemForm mode="create" />
    </div>
  );
}
