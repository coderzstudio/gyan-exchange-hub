import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Upload, Award, Unlock, Users, TrendingUp, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Unlock India's Largest{" "}
              <span className="text-primary">Student-Powered</span>{" "}
              Study Library
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Share your notes, earn Gyan Points, and access top-quality study material from students at every university. For free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary-hover text-lg px-8 py-6 h-auto"
              >
                Join the Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/notes")}
                className="text-lg px-8 py-6 h-auto"
              >
                Browse Notes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students helping each other succeed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center space-y-4 border-2 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Upload Your Notes</h3>
              <p className="text-muted-foreground">
                Share your best class notes, summaries, or past papers. Every contribution helps another student.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 border-2 hover:border-accent/50 transition-colors">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Earn Gyan Points</h3>
              <p className="text-muted-foreground">
                Our automated system rewards you with 'Gyan Points' for every high-quality, helpful upload.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 border-2 hover:border-success/50 transition-colors">
              <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                <Unlock className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Unlock Any Note</h3>
              <p className="text-muted-foreground">
                Use your earned points to instantly access and download any study material you need from our entire library.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Padhai Co. is Different
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A smarter way to share and access quality education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 space-y-4 bg-background">
              <Users className="h-12 w-12 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Community-Powered</h3>
              <p className="text-muted-foreground">
                Built by student, for students. Our quality is maintained by a smart, community-driven rating and reputation system.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-background">
              <TrendingUp className="h-12 w-12 text-accent" />
              <h3 className="text-xl font-bold text-foreground">Completely Gamified</h3>
              <p className="text-muted-foreground">
                Earn points, level up your reputation, and become a 'Top Contributor' in our community.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-background">
              <Shield className="h-12 w-12 text-success" />
              <h3 className="text-xl font-bold text-foreground">100% Free, Always</h3>
              <p className="text-muted-foreground">
                We believe that knowledge and educational resources should be accessible to every student, without any cost.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students already sharing and learning together
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-accent hover:bg-accent-hover text-accent-foreground text-lg px-8 py-6 h-auto"
          >
            Create Your Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Padhai Co. Made with ❤️ for students, by student.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
