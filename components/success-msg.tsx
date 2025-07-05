import { CheckCircle, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SuccessMessage() {
  return (
    <Card className="bg-green-50 border-green-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Incident report submitted successfully!</p>
              <p className="text-sm text-green-600 mt-1">Safety team has been notified and will respond shortly.</p>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
            <Link href="/">
              <X className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
