
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      ageRange: '40-49',
      location: 'United States',
      avatar: '👩‍💻',
      struggle: 'Daily life has changed. Especially in social situations. Where I eat when, what and how much are all considerations. Eating out is tricky. Knowing where all the WCs are when out and about.',
      support: 'Diet suggestions. Useful supplements. Sharing tips and hints. Info on how the condition can impact life moving forward.',
      highlight: 'Need for predictability and community support'
    },
    {
      id: 2,
      ageRange: '60-69',
      location: 'International',
      avatar: '👨‍🦱',
      struggle: 'Urgency, clustering a lot of the time. Some days are good. The emotional stress is big and has affected my sleep and lifestyle. Very rarely leave home now for fear of accidents.',
      support: 'Diet, tips from other survivors, emotional support',
      highlight: 'Seeking emotional support and lifestyle guidance'
    },
    {
      id: 3,
      ageRange: '30-39',
      location: 'United States',
      avatar: '👩‍⚕️',
      struggle: 'Yes. Gas, clustering and sensitive for specific foods. Radiation proctitis, narrowing of the lumen, clustering and constipation.',
      support: 'Avoid fodmap and high fiber foods. Eat small portions. I only eat 2 times a day.',
      highlight: 'Dietary management challenges'
    },
    {
      id: 4,
      ageRange: '40-49',
      location: 'International',
      avatar: '👨‍💼',
      struggle: 'Barely existing social life. Try to be active but lately the side effects have gotten worse. Emotional health has taken a hit again. Feel depressed, lost and no interest.',
      support: 'Something that can help with predictability in day-to-day life',
      highlight: 'Struggling with depression and social isolation'
    },
    {
      id: 5,
      ageRange: '60-69',
      location: 'India',
      avatar: '👩‍🎨',
      struggle: 'I am living my life full and no regret of having permanent colostomy, it\'s saved my life and thankful to God whatever I have.',
      support: 'I think first you have to accept it fully, only then you will be able to live your life fully',
      highlight: 'Acceptance and gratitude despite challenges'
    },
    {
      id: 6,
      ageRange: '70-79',
      location: 'International',
      avatar: '👨‍🎓',
      struggle: 'Yes. Urgency, clustering, gas, chronic diarrhea, emotional distress, anxiety. Multiple bowel movements close together throughout the day.',
      support: 'Hoping to learn more about what strategies and treatments work for others',
      highlight: 'Managing multiple LARS symptoms daily'
    },
    {
      id: 7,
      ageRange: '40-49',
      location: 'International',
      avatar: '👩‍💼',
      struggle: 'Quality of life is fair. As always, I fear how the next day would be. Emotionally sometimes weak about how things will improve.',
      support: 'Diet suggestion, daily routines or tips, exercises. Yoga???',
      highlight: 'Daily uncertainty and fear about symptoms'
    },
    {
      id: 8,
      ageRange: '60-69',
      location: 'International',
      avatar: '👨‍🔬',
      struggle: 'Was more immediately after surgery. Needed to visit the washroom 10-12 times per day. Now, after two years post-surgery, frequency much less.',
      support: 'Tips from survivors, for example dealing with constipation etc.',
      highlight: 'Gradual improvement but ongoing challenges'
    },
    {
      id: 9,
      ageRange: '30-39',
      location: 'Uganda',
      avatar: '👩‍🔬',
      struggle: 'Life is complicated, and this challenging LARS makes me weak, depressed, and overthink sometimes when and how I will come out of this situation.',
      support: 'May be to get something which really help to come out of this syndrome',
      highlight: 'Seeking hope for recovery from LARS'
    },
    {
      id: 10,
      ageRange: '70-79',
      location: 'International',
      avatar: '👨‍⚕️',
      struggle: 'Really have no complaints. Considering what one has gone through. I feel most comfortable at home and welcome friends, but get a bit anxious if one has to go out.',
      support: 'Hopefully, to provide some answers to understand better one\'s condition',
      highlight: 'Managing anxiety around leaving home'
    },
    {
      id: 11,
      ageRange: '40-49',
      location: 'United States',
      avatar: '👩‍💻',
      struggle: 'My QOL is pretty good compared to others with LARS. But I still have bouts of intense clustering, gas, pain, and diarrhea often with no discernible cause.',
      support: 'A good tool for symptom and stool tracking combined with a food diary would be very helpful',
      highlight: 'Need for symptom tracking and pattern recognition'
    },
    {
      id: 12,
      ageRange: '40-49',
      location: 'United States',
      avatar: '👩‍🦱',
      struggle: 'The ongoing bowel issues especially diarrhea, gas, and discomfort are draining and unpredictable. Socially, I\'ve pulled back totally.',
      support: 'Symptom tracking is very important to me and I like diet, as well as mindfulness in my daily routine',
      highlight: 'Social withdrawal due to unpredictable symptoms'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-50/40 to-accent/5"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            Real LARS Experiences
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Authentic stories from cancer survivors living with Low Anterior Resection Syndrome (LARS). Names anonymized for privacy.
          </p>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden md:block relative">
          <div className="flex justify-center items-center space-x-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="card-3d rounded-full w-12 h-12 p-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex space-x-6 max-w-5xl">
              {getVisibleTestimonials().map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  className={`testimonial-card w-80 ${index === 1 ? 'scale-110 z-10' : 'scale-95 opacity-75'
                    } transition-all duration-700`}
                >
                  <div className="relative">
                    <Quote className="absolute top-0 right-4 w-8 h-8 text-sanjeevani-blue/20" />

                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sanjeevani-blue to-sanjeevani-coral flex items-center justify-center text-2xl floating-element">
                        {testimonial.avatar}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-bold text-gray-800">Age {testimonial.ageRange}</h4>
                        <p className="text-sm text-sanjeevani-blue font-medium">{testimonial.location}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-800 mb-2">Challenge:</h5>
                      <p className="text-gray-600 leading-relaxed text-sm italic">
                        "{testimonial.struggle}"
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-gray-800 mb-2">What would help:</h5>
                      <p className="text-gray-600 leading-relaxed text-sm">
                        "{testimonial.support}"
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-sanjeevani-blue/10 to-sanjeevani-coral/10 rounded-lg p-3">
                      <p className="text-sm font-semibold gradient-text">
                        {testimonial.highlight}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="card-3d rounded-full w-12 h-12 p-0"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <Card className="testimonial-card max-w-md mx-auto">
            <div className="relative">
              <Quote className="absolute top-0 right-4 w-8 h-8 text-sanjeevani-blue/20" />

              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sanjeevani-blue to-sanjeevani-coral flex items-center justify-center text-2xl floating-element">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">Age {testimonials[currentIndex].ageRange}</h4>
                  <p className="text-sm text-sanjeevani-blue font-medium">{testimonials[currentIndex].location}</p>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">Challenge:</h5>
                <p className="text-gray-600 leading-relaxed text-sm italic">
                  "{testimonials[currentIndex].struggle}"
                </p>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">What would help:</h5>
                <p className="text-gray-600 leading-relaxed text-sm">
                  "{testimonials[currentIndex].support}"
                </p>
              </div>

              <div className="bg-gradient-to-r from-sanjeevani-blue/10 to-sanjeevani-coral/10 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold gradient-text">
                  {testimonials[currentIndex].highlight}
                </p>
              </div>

              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-sanjeevani-blue' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Join Our Community CTA */}
        <div className="text-center mt-16">
          <Button
            size="lg"
            className="btn-3d bg-gradient-to-r from-sanjeevani-mint to-sanjeevani-emerald text-white hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
          >
            Join Our LARS Community 🤝
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
