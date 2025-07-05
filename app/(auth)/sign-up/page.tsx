import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialLogin from "@/components/auth/SocialLogin";

export default function SignUpPage() {
  return (
    <Card className="bg-transparent border-transparent">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join eve</CardTitle>
        <CardDescription>
          Create your account and start building your campus safety community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialLogin providers={["google", "discord"]} />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/sign-in" className="text-primary hover:underline">
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
