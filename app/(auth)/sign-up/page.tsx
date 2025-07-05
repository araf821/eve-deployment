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
    <div className="bg-transparent border-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join eve</CardTitle>
              <CardDescription>
                Create your account and start building your campus safety community
              </CardDescription>
          </CardHeader>
          <div className="flex-1 min-h-[2vh]"></div>
          <CardContent>
            <SocialLogin providers={["google", "discord"]} />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="text-primary hover:underline">
                Sign up
              </a>
            </div>
          </CardContent>
        </div>
  );
}
