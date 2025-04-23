"use client"

import { MenuItemForm } from "@/components/admin/menu-item-form"

// Mock restaurant ID - in a real app, this would be dynamic
const RESTAURANT_ID = "123"

export default function NewMenuItem() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Add New Menu Item</h2>
      <MenuItemForm restaurantId={RESTAURANT_ID} />
    </div>
  )
}

