"use client"

import { MenuItemForm } from "@/components/admin/menu-item-form"

// Mock restaurant ID - in a real app, this would be dynamic
const RESTAURANT_ID = "123"

export default function EditMenuItem({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Edit Menu Item</h2>
      <MenuItemForm itemId={params.id} restaurantId={RESTAURANT_ID} />
    </div>
  )
}

