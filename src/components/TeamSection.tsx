import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Award, Globe, Heart } from 'lucide-react';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Suneeta Modekurty",
      title: "Co-Founder & CEO",
      image: "/Suneeta.png",
      icon: <User className="h-6 w-6 text-primary" />,
      achievements: [
        "O-1A visa holder",
        "MS Bioinformatics & Data Science",
        "Colorectal cancer survivor",
        "AI & Data Science leadership experience"
      ]
    },
    {
      name: "Nithin Bolla, PharmD, MSHI",
      title: "Co-Founder & Sr. Clinical Data Analyst",
      image: "/Nithin.jpeg",
      icon: <Award className="h-6 w-6 text-primary" />,
      achievements: [
        "Expertise in HIPAA, HITECH, and ICH-GCP compliance",
        "Experienced in clinical trial data flows, cohort identification, and longitudinal patient analysis"
      ]
    },
    {
      name: "Kevin Blighe, PhD",
      title: "Co-Founder & Chief Bioinformatics Advisor",
      image: "/Kevin.png",
      icon: <Globe className="h-6 w-6 text-primary" />,
      achievements: [
        "Author of multiple Bio Conductor packages",
        "Extensive cancer genomics expertise",
        "UK-based research leader"
      ]
    },
    {
      name: "Marie Gorski, MFN, RD, LD",
      title: "Co-Founder & Chief Clinical Nutrition Advisor",
      image: "/marie.png",
      icon: <Heart className="h-6 w-6 text-primary" />,
      achievements: [
        "Specialized in oncology nutrition",
        "GI recovery expert",
        "US-based clinical practice"
      ]
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-sanjeevani-blue">
            World-Class Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the exceptional professionals behind SANJEEVANI AI, combining clinical expertise,
            research excellence, and personal experience to revolutionize cancer survivorship support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="glass-card hover:shadow-lg transition-all duration-200 border-gray-200"
            >
              <CardContent className="p-6">
                <div className="flex gap-6 items-start">
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-32 rounded-lg object-cover object-top border-2 border-primary/20 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-32 rounded-lg bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                        {member.icon}
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold text-sm mb-4">
                      {member.title}
                    </p>

                    <ul className="space-y-2">
                      {member.achievements.map((achievement, achievementIndex) => (
                        <li
                          key={achievementIndex}
                          className="flex items-start space-x-2 text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-xs leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;