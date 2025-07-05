import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialLogin from "@/components/auth/SocialLogin";

export default function SignInPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back to NiteLite</CardTitle>
        <CardDescription>
          Sign in to your account to continue your safe campus journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialLogin providers={["google", "discord"]} />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-primary hover:underline">
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
