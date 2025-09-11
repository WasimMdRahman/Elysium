
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Privacy Policy for Elysium</CardTitle>
        <CardDescription>Last updated: September 5, 2025</CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert text-justify">
        <p>Welcome to Elysium, your supportive companion in mental health and well-being. We are committed to creating a safe and empowering environment where you can track your emotions, thoughts, tasks, and personal growth—without worrying about your privacy. This policy explains how we handle your data, what information is collected, and how you can keep your experience secure.</p>

        <h2>1. Introduction</h2>
        <p>Elysium is a cognitive behavioral therapy (CBT) based application designed to help users explore their emotions, manage stress, and improve mental health. We believe that privacy is a fundamental right, and we have built this app to keep your information private and accessible only to you.</p>

        <h2>2. Data Collection and Storage</h2>
        <p>We do not collect or store your data on our servers. All the information you enter, including mood logs, journals, thought records, task lists, and settings, is stored only on your device. This means:</p>
        <ul>
            <li>You don't need to create an account, login, or share your email or other personal details.</li>
            <li>The app operates entirely offline unless you choose to back up data yourself.</li>
            <li>We do not sell, track, or share your data with third parties.</li>
        </ul>

        <h2>3. What Information is Saved Locally</h2>
        <p>The following data is stored on your device and is not shared or transmitted:</p>
        <ul>
            <li><b>Mood Logs:</b> Track daily emotions and feelings.</li>
            <li><b>Journal Entries:</b> Write and save thoughts, reflections, and insights.</li>
            <li><b>Thought Catcher Game:</b> Play interactive exercises to identify positive and negative thoughts.</li>
            <li><b>Task Manager:</b> Keep lists of tasks and track progress.</li>
            <li><b>Settings:</b> Such as dark mode preferences,</li>
        </ul>
        <p>Your device stores this information in local storage, making it accessible only to you.</p>

        <h2>4. Security and Data Protection</h2>
        <p>We take your privacy seriously, but please note:</p>
        <ul>
            <li>We are not responsible for data loss due to device damage, theft, or accidental deletion.</li>
            <li>We recommend regularly backing up your device’s data if you wish to save your information long-term.</li>
            <li>Keep your device protected with passwords, biometrics, or other security measures.</li>
        </ul>

        <h2>5. No Third-Party Tracking</h2>
        <p>We believe that your mental health journey should be private. That’s why:</p>
        <ul>
            <li>We do not use tracking cookies, analytics tools, or advertising networks.</li>
            <li>We do not sell or share your data with third parties for marketing purposes.</li>
        </ul>
        <p>Your data remains strictly between you and your device.</p>

        <h2>6. Emergency Help Disclaimer</h2>
        <p>While Elysium is designed to support mental wellness, it is not a substitute for professional therapy or medical advice. If you are experiencing serious emotional distress, depression, anxiety, or other mental health challenges, we encourage you to contact a licensed healthcare provider or emergency support line.</p>
        <p>Your safety and well-being are important to us, and seeking professional help is a vital step in recovery.</p>

        <h2>7. User Responsibility</h2>
        <p>As the data is stored locally, you are responsible for:</p>
        <ul>
            <li>Managing and securing your device.</li>
            <li>Backing up data if you wish to preserve it.</li>
            <li>Seeking medical support when needed.</li>
        </ul>
        <p>We are here to support you, but the responsibility for keeping your data safe ultimately rests with you.</p>

        <h2>8. Changes to this Privacy Policy</h2>
        <p>We may update this policy from time to time to reflect improvements or changes to the app. You will always be informed of updates, and you can review the latest version at any time within the app or on our website.</p>
      </CardContent>
    </Card>
  );
}
