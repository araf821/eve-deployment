import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialLogin from "@/components/auth/SocialLogin";
import Link from "next/link";

export default function SignInPage() {
  return (
    <Card className="border-border/50 bg-card/80 shadow-lg backdrop-blur-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="font-heading text-2xl font-semibold text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to continue your safe campus journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SocialLogin providers={["google", "discord"]} />

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
