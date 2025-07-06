"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Camera, Send, X, CheckCircle, ArrowLeft, MapPin } from "lucide-react";

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: { lat: number; lng: number; address?: string };
  onAlertSubmitted?: () => void;
}

export function IncidentReportModal({ 
  isOpen, 
  onClose, 
  selectedLocation,
  onAlertSubmitted
}: IncidentReportModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(selectedLocation?.address || "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create form data for image upload
      const formData = new FormData();
      formData.append("description", description);
      formData.append("location", location);
      formData.append("lat", selectedLocation?.lat.toString() || "");
      formData.append("lng", selectedLocation?.lng.toString() || "");
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Submit incident report
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: selectedLocation?.lat,
          lng: selectedLocation?.lng,
          address: location,
          description,
          hasImage: !!selectedImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit incident report");
      }

      // If there's an image, upload it separately
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", selectedImage);
        
        const imageResponse = await fetch("/api/alerts/image", {
          method: "POST",
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          console.warn("Failed to upload image, but report was submitted");
        }
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Call the callback to reload alerts on the map
      onAlertSubmitted?.();
    } catch (err) {
      console.error("Error submitting incident report:", err);
      setError(err instanceof Error ? err.message : "Failed to submit report");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset all state when closing
    setSelectedImage(null);
    setDescription("");
    setLocation(selectedLocation?.address || "");
    setIsSubmitted(false);
    setIsSubmitting(false);
    setError(null);
    onClose();
  };

  const handleBackToForm = () => {
    setIsSubmitted(false);
  };

  if (!isOpen) return null;

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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Incident Report Submitted!
                </h2>
                <p className="text-gray-600 text-sm">
                  Your detailed incident report has been submitted and will be reviewed by the safety team.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
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
                {/* Location Display */}
                {selectedLocation && (
                  <div className="space-y-2">
                    <Label>Selected Location</Label>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Photo Evidence (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                    <label htmlFor="image" className="cursor-pointer block">
                      {selectedImage ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(selectedImage)}
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
                    placeholder="Describe what happened, any suspicious activity, or safety concerns..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[11vh] resize-none"
                    required
                  />
                </div>

                {/* Location Input */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location Details *</Label>
                  <Input
                    id="location"
                    placeholder="Enter specific address or location details..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    e.g., "Near the entrance of Robarts Library, University of Toronto"
                  </p>
                </div>

                {/* Map Preview */}
                <Card>
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Selected Location</p>
                        </div>
                      </div>
                      {selectedLocation && (
                        <div className="absolute top-2 left-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full border border-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 pt-4 border-t">
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
  );
} 