import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">Terms and Conditions</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing and using Padhai Co, you accept and agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our platform.
              </p>
              <p className="text-sm text-muted-foreground">
                Effective date: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
              <p>You must provide accurate and complete information when creating your account.</p>
              <p>You agree to notify us immediately of any unauthorized use of your account.</p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Content Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground mb-2">When uploading content to Padhai Co, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Only upload content you have the right to share</li>
                <li>Ensure content is accurate and educational in nature</li>
                <li>Not upload copyrighted material without proper authorization</li>
                <li>Not share offensive, inappropriate, or harmful content</li>
                <li>Respect intellectual property rights of others</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Gyan Points System</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Gyan Points are virtual credits used within our platform. They have no cash value and cannot be 
                transferred or redeemed for money. We reserve the right to adjust point values and requirements 
                at our discretion.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground mb-2">You may not:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use the platform for any illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users' access to the platform</li>
                <li>Upload malicious code or viruses</li>
                <li>Engage in spamming or harassment</li>
                <li>Misrepresent your identity or affiliation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Padhai Co is provided "as is" without warranties of any kind. We are not liable for any damages 
                arising from your use of the platform, including but not limited to academic outcomes, data loss, 
                or service interruptions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                We reserve the right to modify these terms at any time. Continued use of the platform after 
                changes constitutes acceptance of the updated terms. We will notify users of significant changes 
                via email or platform notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
