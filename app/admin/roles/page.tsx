"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Save, ShieldCheck } from "lucide-react"

// Mock permissions data
const permissions = {
  admin: {
    restaurant: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    menu: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    users: {
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    settings: {
      view: true,
      edit: true,
    },
    ai: {
      view: true,
      edit: true,
    },
  },
  staff: {
    restaurant: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    menu: {
      view: true,
      create: true,
      edit: true,
      delete: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    settings: {
      view: true,
      edit: false,
    },
    ai: {
      view: true,
      edit: false,
    },
  },
  customer: {
    restaurant: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    menu: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
    users: {
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    settings: {
      view: false,
      edit: false,
    },
    ai: {
      view: false,
      edit: false,
    },
  },
}

export default function RolesAndPermissionsPage() {
  const [rolePermissions, setRolePermissions] = useState(permissions)
  const [isSaving, setIsSaving] = useState(false)

  // Handle permission change
  const handlePermissionChange = (role: string, module: string, permission: string, checked: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [module]: {
          ...prev[role as keyof typeof prev][module as keyof (typeof prev)[keyof typeof prev]],
          [permission]: checked,
        },
      },
    }))
  }

  // Save permissions
  const savePermissions = () => {
    setIsSaving(true)

    // In a real app, you would call an API to save the permissions
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Success",
        description: "Permissions saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold">Roles & Permissions</h2>
        <Button onClick={savePermissions} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Permissions
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Role-Based Access Control
          </CardTitle>
          <CardDescription>Configure what each role can access and modify in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="space-y-4">
            <TabsList>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
            </TabsList>

            {(["admin", "staff", "customer"] as const).map((role) => (
              <TabsContent key={role} value={role} className="space-y-4">
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Restaurant Management</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-restaurant-view`}
                          checked={rolePermissions[role].restaurant.view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "restaurant", "view", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-restaurant-view`}>View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-restaurant-create`}
                          checked={rolePermissions[role].restaurant.create}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "restaurant", "create", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-restaurant-create`}>Create</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-restaurant-edit`}
                          checked={rolePermissions[role].restaurant.edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "restaurant", "edit", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-restaurant-edit`}>Edit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-restaurant-delete`}
                          checked={rolePermissions[role].restaurant.delete}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "restaurant", "delete", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-restaurant-delete`}>Delete</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Menu Management</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-menu-view`}
                          checked={rolePermissions[role].menu.view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "menu", "view", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-menu-view`}>View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-menu-create`}
                          checked={rolePermissions[role].menu.create}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "menu", "create", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-menu-create`}>Create</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-menu-edit`}
                          checked={rolePermissions[role].menu.edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "menu", "edit", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-menu-edit`}>Edit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-menu-delete`}
                          checked={rolePermissions[role].menu.delete}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "menu", "delete", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-menu-delete`}>Delete</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">User Management</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-users-view`}
                          checked={rolePermissions[role].users.view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "users", "view", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-users-view`}>View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-users-create`}
                          checked={rolePermissions[role].users.create}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "users", "create", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-users-create`}>Create</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-users-edit`}
                          checked={rolePermissions[role].users.edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "users", "edit", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-users-edit`}>Edit</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-users-delete`}
                          checked={rolePermissions[role].users.delete}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "users", "delete", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-users-delete`}>Delete</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Settings</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-settings-view`}
                          checked={rolePermissions[role].settings.view}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "settings", "view", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-settings-view`}>View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-settings-edit`}
                          checked={rolePermissions[role].settings.edit}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(role, "settings", "edit", checked as boolean)
                          }
                        />
                        <Label htmlFor={`${role}-settings-edit`}>Edit</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">AI Integration</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-ai-view`}
                          checked={rolePermissions[role].ai.view}
                          onCheckedChange={(checked) => handlePermissionChange(role, "ai", "view", checked as boolean)}
                        />
                        <Label htmlFor={`${role}-ai-view`}>View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role}-ai-edit`}
                          checked={rolePermissions[role].ai.edit}
                          onCheckedChange={(checked) => handlePermissionChange(role, "ai", "edit", checked as boolean)}
                        />
                        <Label htmlFor={`${role}-ai-edit`}>Edit</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

