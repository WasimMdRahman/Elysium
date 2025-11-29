
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <Card>
      <CardHeader>
        <Button asChild variant="ghost" size="icon">
             <Link href="/dashboard"><ArrowLeft /></Link>
        </Button>
        <CardTitle className="font-headline">Privacy Policy for Elysium</CardTitle>
        <CardDescription>Last updated: November 1, 2025</CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert text-justify">
        <p>Welcome to Elysium. We are committed to creating a safe and empowering environment where you can explore your mental well-being. This policy explains how we handle your data with the privacy and security you deserve.</p>

        <h2>1. Your Data, Your Control</h2>
        <p>Elysium offers two ways to use the app, putting you in control of your data:</p>
        <ul>
          <li><strong>Guest Mode:</strong> If you use the app as a guest, all your data—including mood logs, journal entries, and game progress—is stored <strong>only on your local device</strong>. We do not collect or store this information on our servers.</li>
          <li><strong>Secure Account:</strong> You have the option to create a free, secure account. Creating an account allows you to back up your data and sync it across multiple devices.</li>
        </ul>

        <h2>2. Data Collection and Storage for Account Holders</h2>
        <p>If you create an account, your data is stored securely in the cloud using Google's Firebase services. This is what enables you to sign in from any device and have your information ready for you. Specifically:</p>
        <ul>
            <li><b>User Authentication:</b> We use Firebase Authentication to securely manage your account. We do not see or store your password. Your username is private and used only for account recovery.</li>
            <li><b>Cloud Data Storage:</b> Your app data (journals, mood entries, etc.) is stored in Google's Firestore database. This data is protected by strict security rules that ensure <strong>only you</strong>, when authenticated, can access, read, or write your own information.</li>
        </ul>

        <h2>3. What Information is Saved</h2>
        <p>Whether stored locally or in your secure cloud account, the app saves:</p>
        <ul>
            <li><b>Mood Logs:</b> To track daily emotions.</li>
            <li><b>Journal Entries:</b> Your private reflections and thoughts.</li>
            <li><b>Thought Quest Data:</b> Your game progress and scores.</li>
            <li><b>User-Generated Content:</b> Any other data you create within the app's features.</li>
        </ul>

        <h2>4. Security and Data Protection</h2>
        <p>We take your privacy and security seriously:</p>
        <ul>
            <li>For account holders, your data is protected by Google Cloud's robust security infrastructure and our own strict access rules. No one else can access your data.</li>
            <li>If you use Guest Mode, you are responsible for the security of your device. Data can be lost if your device is damaged, lost, or reset.</li>
        </ul>

        <h2>5. No Third-Party Tracking or Selling of Data</h2>
        <p>We believe your mental health journey is intensely personal. That’s why we promise:</p>
        <ul>
            <li>We do not use third-party tracking cookies, analytics tools (that identify you), or advertising networks.</li>
            <li><strong>We will never sell or share your personal data with third parties for marketing purposes.</strong></li>
        </ul>

        <h2>6. Data Deletion</h2>
        <p>You are in complete control of your data. You can delete individual entries (like a journal post or mood log) from within the app. If you wish to delete your entire account and all associated cloud data, you can do so from the app's settings page. Once deleted, this action cannot be undone.</p>
        
        <h2>7. Emergency Help Disclaimer</h2>
        <p>Elysium is a supportive tool, but it is <strong>not a substitute for professional medical or psychological advice</strong>. If you are in crisis or experiencing severe mental health challenges, please contact a licensed healthcare provider or an emergency support line immediately.</p>

        <h2>8. Changes to this Privacy Policy</h2>
        <p>We may update this policy to reflect improvements to the app. We will notify you of significant changes. You can always review the latest version within the app.</p>
      </CardContent>
    </Card>
  );
}
