"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, MapPin, Heart } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Your Crew's Got Your Back",
    description:
      "Connect with trusted friends who can track your journey in real-time. No more 'made it home' texts - your crew knows you're safe.",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: Shield,
    title: "AI Guardian Always Watching",
    description:
      "Our friendly AI companion checks in when you stop moving, providing an extra layer of care without being intrusive.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: MapPin,
    title: "Community Glow Map",
    description:
      "Discover the safest routes through community-shared insights. Light up paths for others and benefit from collective wisdom.",
    gradient: "from-green-500/20 to-blue-500/20",
  },
  {
    icon: Heart,
    title: "Safety Through Connection",
    description:
      "Building trust and community, not fear. Every feature is designed to strengthen friendships while keeping everyone safe.",
    gradient: "from-pink-500/20 to-red-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full max-w-6xl px-6 py-16">
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Technology That Brings Us Together
        </motion.h2>
        <motion.p
          className="mx-auto max-w-2xl text-lg text-foreground/70"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Eve isn't just another safety app. It's a community platform that
          transforms how friends look out for each other on campus.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="relative h-full overflow-hidden">
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`}
              />

              <CardHeader className="relative z-10">
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <p className="leading-relaxed text-foreground/70">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Community emphasis section */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 p-8 backdrop-blur-sm">
          <motion.h3
            className="mb-4 font-heading text-2xl font-semibold text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Powered by Community, Enhanced by Technology
          </motion.h3>
          <motion.p
            className="mx-auto max-w-3xl text-lg text-foreground/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Every feature in Eve is designed to strengthen the bonds between
            friends while leveraging smart technology to keep everyone safe.
            It's not about surveillance—it's about care, connection, and
            community.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
