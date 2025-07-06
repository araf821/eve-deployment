"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera, Send, X, CheckCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log({
      image: selectedImage,
      description,
      location,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    // Reset all state when closing
    setSelectedImage(null);
    setDescription("");
    setLocation("");
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex h-full items-center justify-center overflow-hidden bg-black/80 p-4">
      <div className="flex h-[95vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white">
        {isSubmitted ? (
          // Success Screen
          <div className="flex h-full flex-col p-6 text-center">
            <div className="flex flex-1 flex-col justify-center">
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  Report Submitted Successfully!
                </h2>
                <p className="text-sm text-gray-600">
                  Your incident report has been sent to the safety team. They
                  will review it and take appropriate action.
                </p>
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
                <h3 className="mb-2 font-medium text-gray-900">
                  Report Summary:
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Location:</span> {location}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    {description.slice(0, 50)}...
                  </div>
                  {selectedImage && (
                    <div>
                      <span className="font-medium">Photo:</span>{" "}
                      {selectedImage.name}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Report ID:</span> #INC-
                    {Date.now().toString().slice(-6)}
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button
                onClick={handleClose}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Done
              </Button>
              <Button
                onClick={handleBackToForm}
                variant="outline"
                className="w-full bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Submit Another Report
              </Button>
            </div>
          </div>
        ) : (
          // Form Screen
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6 pb-4">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Report Incident</h2>
              </div>
              <Button onClick={handleClose} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Photo Evidence (Optional)</Label>
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-gray-400">
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image" className="block cursor-pointer">
                      {selectedImage ? (
                        <div className="space-y-2">
                          <img
                            src={
                              URL.createObjectURL(selectedImage) ||
                              "/placeholder.svg"
                            }
                            alt="Selected"
                            className="h-24 w-full rounded-md object-cover"
                          />
                          <p className="text-xs text-gray-600">
                            {selectedImage.name}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto mb-1 h-6 w-6 text-gray-400" />
                          <p className="text-xs text-gray-600">
                            Click to upload photo
                          </p>
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
                    onChange={e => setDescription(e.target.value)}
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
                    onChange={e => setLocation(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    e.g., &quot;Robarts Library, University of Toronto&quot;
                  </p>
                </div>

                {/* Map Preview */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src="/placeholder.svg"
                        alt="Campus map"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <div className="h-3 w-3 rounded-full border border-white bg-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="border-t bg-white p-6 pt-4">
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
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
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
  );
}
