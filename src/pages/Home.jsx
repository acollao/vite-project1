// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { School, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            SFAC Taguig Admissions Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your centralized hub for college admissions in Manila & Taguig. 
            Track applications, manage deadlines, and prepare documents with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <GraduationCap className="size-10 mb-3 text-primary" />
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Track university applications, deadlines, and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/admissions">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <School className="size-10 mb-3 text-primary" />
              <CardTitle>University Resources</CardTitle>
              <CardDescription>
                Access official links, requirements, and exam schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/admissions">Browse Universities</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="size-10 mb-3 text-primary" />
              <CardTitle>Community Support</CardTitle>
              <CardDescription>
                Connect with contributors and get application guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/contributor">Meet Contributors</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}