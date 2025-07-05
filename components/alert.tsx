"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Camera, Send, X, CheckCircle, ArrowLeft } from "lucide-react"
import { useState } from "react"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log({
      image: selectedImage,
      description,
      location,
    })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleClose = () => {
    // Reset all state when closing
    setSelectedImage(null)
    setDescription("")
    setLocation("")
    setIsSubmitted(false)
    setIsSubmitting(false)
    onClose()
  }

  const handleBackToForm = () => {
    setIsSubmitted(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 overflow-hidden h-full">
      <div className="bg-white rounded-lg max-w-md w-full h-[95vh] flex flex-col overflow-hidden">
        {isSubmitted ? (
          // Success Screen
          <div className="p-6 text-center flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Submitted Successfully!</h2>
                <p className="text-gray-600 text-sm">
                  Your incident report has been sent to the safety team. They will review it and take appropriate
                  action.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-2">Report Summary:</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Location:</span> {location}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {description.slice(0, 50)}...
                  </div>
                  {selectedImage && (
                    <div>
                      <span className="font-medium">Photo:</span> {selectedImage.name}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Report ID:</span> #INC-{Date.now().toString().slice(-6)}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span> {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Done
              </Button>
              <Button onClick={handleBackToForm} variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Submit Another Report
              </Button>
            </div>
          </div>
        ) : (
          // Form Screen
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Report Incident</h2>
              </div>
              <Button onClick={handleClose} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Photo Evidence (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <label htmlFor="image" className="cursor-pointer block">
                      {selectedImage ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(selectedImage) || "/placeholder.svg"}
                            alt="Selected"
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <p className="text-xs text-gray-600">{selectedImage.name}</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-600">Click to upload photo</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happened..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[11vh] resize-none"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Enter address or location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">e.g., "Robarts Library, University of Toronto"</p>
                </div>

                {/* Map Preview */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt="Campus map"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full border border-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 pt-4 border-t bg-white">
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
