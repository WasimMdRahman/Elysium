
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <Card>
      <CardHeader>
        <Button asChild variant="ghost" size="icon">
             <Link href="/dashboard"><ArrowLeft /></Link>
        </Button>
        <CardTitle className="font-headline">Terms of Service for Elysium</CardTitle>
        <CardDescription>Last updated: November 1, 2025</CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert text-justify">
        <p>Welcome to Elysium! By using this application, you agree to these Terms of Service. Please read them carefully.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Elysium, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, please do not use the app.</p>

        <h2>2. Our Service</h2>
        <p>Elysium is a cognitive behavioral therapy (CBT) inspired application designed to help users manage their mental well-being. The app provides tools for mood tracking, journaling, and thought exercises.</p>
        <p>We are not a healthcare provider, and Elysium is not intended to replace professional medical or psychological advice, diagnosis, or treatment.</p>

        <h2>3. User Accounts and Data Storage</h2>
        <p>Elysium offers two modes of operation:</p>
        <ul>
            <li><strong>Guest Mode:</strong> All data you create is stored exclusively on your local device. We have no access to it. You are solely responsible for the security and backup of this data.</li>
            <li><strong>Account Mode:</strong> You may choose to create a secure account to enable cloud backup and data synchronization across your devices. By creating an account, you agree to have your data stored on Google Firebase services, protected by security rules that restrict access to only you.</li>
        </ul>

        <h2>4. User Responsibilities</h2>
        <p>You agree that:</p>
        <ul>
            <li>You will use Elysium for personal wellness purposes only.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials (your unique username and password).</li>
            <li>You will seek professional help from a qualified healthcare provider for any serious mental health concerns. Elysium is a tool, not a therapist.</li>
            <li>You are responsible for all activities that occur under your account.</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>All content, design, and functionality within Elysium are the property of the app’s creators and are protected by intellectual property laws. You may not copy, modify, distribute, or sell any part of the app without our express permission.</p>

        <h2>6. Limitation of Liability</h2>
        <p>Elysium is provided "as is" without any warranties. We are not liable for:</p>
        <ul>
            <li>Any harm, distress, or negative outcomes resulting from the use or misuse of the app.</li>
            <li>Loss of data, whether stored locally in Guest Mode or in the cloud with an account, due to any reason including device malfunction, accidental deletion, or service interruption.</li>
            <li>The app's effectiveness or its suitability for your specific needs.</li>
        </ul>
        <p>You use the app at your own risk. Always prioritize professional medical advice.</p>

        <h2>7. Account Termination</h2>
        <p>We reserve the right to suspend or terminate your account if you violate these Terms of Service. You can delete your account and all associated data at any time from within the app settings.</p>

        <h2>8. Modifications and Updates</h2>
        <p>We may update or modify these Terms of Service from time to time. We will notify you of any significant changes. Continued use of the app after such changes constitutes your acceptance of the new terms.</p>
      </CardContent>
    </Card>
  );
}
