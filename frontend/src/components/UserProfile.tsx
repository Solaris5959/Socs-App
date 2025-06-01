'use client'
import { Camera } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useProfile } from '../../contexts/UserContext';
import React, { useRef } from "react"

export function UserProfile({
  className,
  ...props
}: React.ComponentProps<"div">) {


  // Use the UserContext to get user profile data and methods
  const { userProfile, updateUserProfile, uploadProfilePicture } = useProfile();


  // Create a ref for the file input to trigger it programmatically
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Handle camera icon click to trigger file input
  function handleCameraClick() {
    fileInputRef.current?.click()
  }

  // Handle form submission for updating user profile
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const values = Object.fromEntries(formData.entries())
    console.log("Form submitted:", values)
    // Implement form submission logic here
  }

  // Handle profile picture upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {

    // Get the selected file from the input
    const file = e.target.files?.[0]


    if (!file) return

    //  Call supabase method to upload the file
    const success = await uploadProfilePicture(file)

    return success

  }



  return (
    <div className={cn("flex items-center justify-center px-4 py-8", className)} {...props}>
      <Card className="w-full  bg-white dark:bg-slate-900 border-none shadow-none">


        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between ">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              User Profile
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Update your profile information, change your password, or delete your account.
            </CardDescription>
          </div>

          {/* Profile Picture Section */}
          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end gap-3 relative">
            <Avatar className="w-32 h-32 shadow-sm  border-slate-300 dark:border-slate-700">
              <AvatarImage
                src={userProfile?.profile_pic_url || ""}
                alt="User Profile"
                className="object-cover w-32 h-32 rounded-full"
              />
              <AvatarFallback className="text-2xl font-semibold  dark:bg-slate-800
               text-slate-600 dark:text-slate-300">
                SOCS
              </AvatarFallback>
            </Avatar>

            {/* Camera Icon Overlay Button */}

            <div className="absolute bottom-1 right-1">
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />

              <button
                type="button"
                aria-label="Upload Profile Picture"
                className="bg-slate-600 hover:bg-blue-500
      text-white p-2 rounded-full shadow-md transition-colors cursor-pointer"
                onClick={handleCameraClick}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="grid gap-2">
                <label htmlFor="firstName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  First Name
                </label>
                <Input id="firstName" name="firstName" defaultValue={userProfile?.firstName || "N/A"} disabled />
              </div>

              {/* Last Name */}
              <div className="grid gap-2">
                <label htmlFor="lastName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Last Name
                </label>
                <Input id="lastName" name="lastName" defaultValue={userProfile?.lastName || "N/A"} disabled />
              </div>

              {/* Display Name */}
              <div className="grid gap-2">
                <label htmlFor="displayName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Display Name
                </label>
                <Input id="displayName" name="displayName" defaultValue={userProfile?.display_name || "N/A"} disabled />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <Input id="email" name="email" type="email" defaultValue={userProfile?.email || "N/A"} disabled />
              </div>

              {/* Phone Number */}
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <Input id="phone" name="phone" type="tel" defaultValue={userProfile?.phone_number || "N/A"} disabled />
              </div>

              {/* Position */}
              <div className="grid gap-2">
                <label htmlFor="position" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Position
                </label>
                <Input id="position" name="position" defaultValue={userProfile?.position || "N/A"} disabled />
              </div>

              {/* Company */}
              <div className="grid gap-2 md:col-span-2">
                <label htmlFor="company" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Company
                </label>
                <Input id="company" name="company" defaultValue={userProfile?.company || "N/A"} disabled />
              </div>
            </div>


            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
              {/* Left-aligned actions */}
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
                <Button
                  type="submit"
                  className="rounded-xl bg-blue-500 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Update Profile
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-blue-500 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Change Password
                </Button>
              </div>

              {/* Right-aligned destructive action */}
              <div className="flex justify-end flex-col sm:flex-row sm:gap-4 gap-3">
                <Button
                  variant="destructive"
                  type="button"
                  className="rounded-xl cursor-pointer"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}