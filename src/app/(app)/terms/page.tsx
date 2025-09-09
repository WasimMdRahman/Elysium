
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Terms of Service</CardTitle>
        <CardDescription>Last updated: June 10, 2024</CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert">
        <h2>Agreement to Terms</h2>
        <p>By using our application, Elysium, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the Application.</p>
        
        <h2>User Accounts</h2>
        <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        
        <h2>Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Elysium and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>

        <h2>Termination</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
      </CardContent>
    </Card>
  );
}

    