
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Terms of Service for Elysium</CardTitle>
        <CardDescription>Last updated: September 5, 2025</CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert">
        <p>Welcome to Elysium! By using this application, you agree to these Terms of Service. Please read them carefully to understand how Elysium operates and what your rights and responsibilities are when using this app.</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using Elysium, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, please do not use the app.</p>

        <h2>2. Our Service</h2>
        <p>Elysium is a cognitive behavioral therapy (CBT) inspired application designed to help users manage emotions, track moods, journal thoughts, organize tasks, and engage in thought exercises—all in a private, offline environment.</p>
        <p>We are not a healthcare provider, and Elysium is not intended to replace professional medical or psychological advice.</p>

        <h2>3. No Account or Third-Party Data Sharing</h2>
        <p>Elysium is designed to respect your privacy:</p>
        <ul>
            <li>No sign-up or login is required.</li>
            <li>All data is stored locally on your device.</li>
            <li>We do not collect, store, or share your personal data.</li>
            <li>We do not use advertising networks, trackers, or analytics.</li>
            <li>You are responsible for protecting your device and managing your data.</li>
        </ul>

        <h2>4. User Responsibilities</h2>
        <p>You agree that:</p>
        <ul>
            <li>You will use Elysium for personal wellness and mental health support only.</li>
            <li>You will not misuse the app or attempt to access other users’ data.</li>
            <li>You are responsible for securing your device and backing up your data if needed.</li>
            <li>You will consult a healthcare provider in case of serious mental health concerns or emergencies.</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>All content, design elements, and functionality within Elysium are the property of the app’s creators and are protected by intellectual property laws.</p>
        <p>You may not copy, distribute, or sell any part of the app without permission.</p>

        <h2>6. Limitation of Liability</h2>
        <p>While we aim to provide a helpful and supportive tool, Elysium is not responsible for:</p>
        <ul>
            <li>Any harm resulting from the use or misuse of the app.</li>
            <li>Data loss caused by device malfunction or accidental deletion.</li>
            <li>Emotional distress or other mental health issues that require professional intervention.</li>
        </ul>
        <p>You use the app at your own risk and are responsible for seeking proper medical care when necessary.</p>

        <h2>7. Modifications and Updates</h2>
        <p>We reserve the right to update or modify these Terms of Service and our Privacy Policy at any time. Any changes will be communicated within the app or through our website.</p>
        <p>It is your responsibility to stay informed about updates to the terms.</p>

        <h2>8. Governing Law</h2>
        <p>These terms are governed by the laws of the jurisdiction in which the app is developed and provided. Any disputes will be handled according to applicable laws.</p>
      </CardContent>
    </Card>
  );
}
