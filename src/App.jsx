import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CyberParticles } from './components/CyberParticles';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { EventsSection } from './components/EventsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { CertificatePortal } from './components/CertificatePortal';
import { getEventSettings } from './lib/db';
import { EVENTS } from './data/eventsData';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'register' | 'admin' | 'status' | 'certificate'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventSettings, setEventSettings] = useState({});
  const [certSeed, setCertSeed] = useState(null); // full registration record passed for team-roster auto-fetch

  // Load event enable/disable settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getEventSettings();
        setEventSettings(settings || {});
      } catch (err) {
        console.error('Failed to load event settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Handle Hash-based deep linking (e.g. #admin, #register-ideathon)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#check-status') {
        setCurrentView('status');
      } else if (hash.startsWith('#certificate')) {
        setCurrentView('certificate');
      } else if (hash.startsWith('#register/')) {
        const eventId = hash.replace('#register/', '');
        const ev = EVENTS.find((e) => e.id === eventId);
        if (ev) {
          setSelectedEvent(ev);
          setCurrentView('register');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectEvent = (event) => {
    // Never open registration for an event the admin has closed.
    if (eventSettings[event.id] === false) return;
    setSelectedEvent(event);
    setCurrentView('register');
    window.location.hash = `#register/${event.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSelectedEvent(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenParticipant = () => {
    setCurrentView('status');
    window.location.hash = '#check-status';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCertificate = (payload = '') => {
    setCurrentView('certificate');
    if (payload && typeof payload === 'object') {
      // Full registration record (from ParticipantDashboard) – enables team roster auto-fetch
      setCertSeed(payload);
      window.location.hash = '#certificate';
    } else {
      setCertSeed(null);
      const key = typeof payload === 'string' ? payload : '';
      window.location.hash = key ? `#certificate?key=${encodeURIComponent(key)}` : '#certificate';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterAnother = () => {
    setCurrentView('home');
    setSelectedEvent(null);
    window.location.hash = '';
    setTimeout(() => {
      const el = document.getElementById('events');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-black">
      {/* Background Interactive Cyber Particles & Grid */}
      <CyberParticles />

      {/* Main Sticky Navigation */}
      <Navbar
        currentView={currentView}
        onGoHome={handleGoHome}
        onOpenAdmin={handleOpenAdmin}
        onOpenParticipant={handleOpenParticipant}
        onOpenCertificate={handleOpenCertificate}
        onSelectEvent={handleSelectEvent}
      />

      {/* Main Dynamic View Content */}
      <main className="relative z-10">
        {currentView === 'home' && (
          <>
            <Hero
              onExploreEvents={() => {
                const el = document.getElementById('events');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onQuickRegister={() => {
                const el = document.getElementById('events');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onClaimCertificate={() => handleOpenCertificate()}
            />
            <About />
            <EventsSection
              onSelectEvent={handleSelectEvent}
              eventSettings={eventSettings}
            />
            <ScheduleSection />
            <ContactSection />
          </>
        )}

        {currentView === 'register' && selectedEvent && (
          <RegistrationPage
            event={selectedEvent}
            onBackToEvents={handleGoHome}
            onRegisterAnother={handleRegisterAnother}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onBackToFest={handleGoHome} />
        )}

        {currentView === 'status' && (
          <ParticipantDashboard
            onBackToFest={handleGoHome}
            onRegisterAnother={handleRegisterAnother}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {currentView === 'certificate' && (
          <CertificatePortal onBackToFest={handleGoHome} seedRecord={certSeed} />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onOpenCertificate={handleOpenCertificate}
        onSelectSection={(sectionId) => {
          if (currentView !== 'home') {
            handleGoHome();
            setTimeout(() => {
              const el = document.getElementById(sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
