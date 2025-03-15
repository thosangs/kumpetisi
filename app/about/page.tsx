import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kumpetisi - The ultimate platform for managing pushbike race competitions",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          About Kumpetisi
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Kumpetisi is the ultimate platform for organizing and managing
            pushbike race competitions with ease. Our mission is to simplify the
            complex process of managing bracket competitions, allowing event
            organizers to focus on creating amazing experiences for participants
            and spectators.
          </p>

          <h2>Our Story</h2>
          <p>
            Founded in 2023, Kumpetisi was born out of the frustration
            experienced by event organizers who struggled with outdated tools
            and manual processes for managing race competitions. We set out to
            create a comprehensive solution that would streamline every aspect
            of competition management, from participant registration to results
            tracking.
          </p>

          <h2>What We Offer</h2>
          <ul>
            <li>Easy-to-use competition management tools</li>
            <li>Streamlined participant registration with CSV upload</li>
            <li>Flexible class and batch management</li>
            <li>Comprehensive results tracking system</li>
            <li>
              Public-facing competition pages for participants and spectators
            </li>
            <li>Penalty points system for fair competition</li>
          </ul>

          <h2>Our Vision</h2>
          <p>
            We envision a future where every pushbike race competition,
            regardless of size, can be managed efficiently and professionally.
            Our goal is to become the go-to platform for event organizers across
            Indonesia and beyond, helping to grow the sport and create better
            experiences for all involved.
          </p>

          <h2>Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you! Reach out to
            our team at
            <a
              href="mailto:info@kumpetisi.com"
              className="text-kumpetisi-blue ml-1"
            >
              info@kumpetisi.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
