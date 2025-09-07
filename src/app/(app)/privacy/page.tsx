import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Privacy Policy</CardTitle>
        <CardDescription>Last updated: June 10, 2024</CardDescription>
      </CardHeader>
      <CardContent className="prose dark:prose-invert">
        <h2>Introduction</h2>
        <p>Welcome to Zenith Mind. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
        
        <h2>Information We Collect</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes personal data, such as your name and email address, and derivative data, such as your IP address, browser type, and operating system, which our servers automatically collect when you access the Application.</p>

        <h2>Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to create and manage your account, email you regarding your account, and monitor and analyze usage and trends to improve your experience with the Application.</p>

        <h2>Security of Your Information</h2>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
      </CardContent>
    </Card>
  );
}
