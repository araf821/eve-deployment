"use client"

import type React from "react"

import { useState } from "react"
import { AlertModal } from "@/components/alert"

interface AlertModalWrapperProps {
  children: React.ReactNode
}

export function AlertModalWrapper({ children }: AlertModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <AlertModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
