import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Settings</CardTitle>
        <CardDescription>Manage your account and app preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Settings page content will go here.</p>
      </CardContent>
    </Card>
  );
}
