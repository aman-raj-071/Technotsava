import React, { useState, useEffect } from 'react';
import { saveRegistration, getEventSettings } from '../lib/db';
import { RegistrationSuccess } from '../components/RegistrationSuccess';

export const RegistrationPage = ({ event, onBackToEvents, onRegisterAnother }) => {
  // Common states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [confirmedRecord, setConfirmedRecord] = useState(null);

  // Closed-registration gate: live admin open/close status for this event
  const [isClosed, setIsClosed] = useState(false);
  const [settingsChecked, setSettingsChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const settings = (await getEventSettings()) || {};
        if (mounted) {
          setIsClosed(!settings[event.id]);
          setSettingsChecked(true);
        }
      } catch {
        if (mounted) setSettingsChecked(true);
      }
    })();
    return () => { mounted = false; };
  }, [event.id]);

  // Form Fields State
  const [teamName, setTeamName] = useState('');
  // Leader / Individual / Member 1 fields
  const [leaderName, setLeaderName] = useState('');
  const [leaderUsn, setLeaderUsn] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');

  // Tech Quiz specific Member 2 fields
  const [quizMember2Name, setQuizMember2Name] = useState('');
  const [quizMember2Usn, setQuizMember2Usn] = useState('');
  const [quizMember2Phone, setQuizMember2Phone] = useState('');

  // Dynamic Members (for 2-4 team events: DTH, Ideathon, Free Fire, Video Editing)
  // Initial dynamic member represents Member 2 (required)
  const [dynamicMembers, setDynamicMembers] = useState([
    { name: '', usn: '' }
  ]);

  // Ideathon Theme Selection (must choose exactly 1)
  const [selectedTheme, setSelectedTheme] = useState('');

  // Field validation errors
  const [errors, setErrors] = useState({});

  // Helper validators
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 10;
  };

  const isValidUsn = (usn) => {
    return usn && usn.trim().length >= 5;
  };

  // Add Dynamic Member (Max 4 total including leader, so max 3 dynamic members)
  const handleAddMember = () => {
    if (dynamicMembers.length < 3) {
      setDynamicMembers([...dynamicMembers, { name: '', usn: '' }]);
    }
  };

  // Remove Dynamic Member (Min 2 total including leader, so min 1 dynamic member)
  const handleRemoveMember = (indexToRemove) => {
    if (dynamicMembers.length > 1) {
      setDynamicMembers(dynamicMembers.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...dynamicMembers];
    updated[index][field] = value;
    setDynamicMembers(updated);
  };

  // Comprehensive Form Submission Validator
  const validateForm = () => {
    const errs = {};

    if (event.id === 'minute-to-win-it') {
      // EVENT 5: MINUTE TO WIN IT (Individual)
      if (!leaderName.trim()) errs.leaderName = 'Participant Name is compulsory';
      if (!leaderUsn.trim()) errs.leaderUsn = 'USN is compulsory';
      else if (!isValidUsn(leaderUsn)) errs.leaderUsn = 'Please enter a valid USN';
      if (leaderEmail && !isValidEmail(leaderEmail)) errs.leaderEmail = 'Invalid email address';
      if (leaderPhone && !isValidPhone(leaderPhone)) errs.leaderPhone = 'Invalid phone number';
    } else if (event.id === 'tech-quiz') {
      // EVENT 2: TECH QUIZ (Exactly 2 participants)
      if (!teamName.trim()) errs.teamName = 'Team Name is compulsory';

      // Member 1
      if (!leaderName.trim()) errs.leaderName = 'Member 1 Name is compulsory';
      if (!leaderUsn.trim()) errs.leaderUsn = 'Member 1 USN is compulsory';
      else if (!isValidUsn(leaderUsn)) errs.leaderUsn = 'Please enter a valid USN';
      if (!leaderPhone.trim()) errs.leaderPhone = 'Member 1 Phone Number is compulsory';
      else if (!isValidPhone(leaderPhone)) errs.leaderPhone = 'Phone number must be at least 10 digits';

      // Member 2
      if (!quizMember2Name.trim()) errs.quizMember2Name = 'Member 2 Name is compulsory';
      if (!quizMember2Usn.trim()) errs.quizMember2Usn = 'Member 2 USN is compulsory';
      else if (!isValidUsn(quizMember2Usn)) errs.quizMember2Usn = 'Please enter a valid USN';
      if (!quizMember2Phone.trim()) errs.quizMember2Phone = 'Member 2 Phone Number is compulsory';
      else if (!isValidPhone(quizMember2Phone)) errs.quizMember2Phone = 'Phone number must be at least 10 digits';
    } else {
      // EVENTS 1, 3, 4, 6 (Team 2-4 members with leader)
      if (!teamName.trim()) errs.teamName = 'Team Name is compulsory';

      // Leader
      if (!leaderName.trim()) errs.leaderName = 'Team Leader Name is compulsory';
      if (!leaderUsn.trim()) errs.leaderUsn = 'Team Leader USN is compulsory';
      else if (!isValidUsn(leaderUsn)) errs.leaderUsn = 'Please enter a valid USN';

      if (!leaderEmail.trim()) errs.leaderEmail = 'Email Address is compulsory';
      else if (!isValidEmail(leaderEmail)) errs.leaderEmail = 'Please provide a valid email';

      if (!leaderPhone.trim()) errs.leaderPhone = 'Phone Number is compulsory';
      else if (!isValidPhone(leaderPhone)) errs.leaderPhone = 'Phone number must be at least 10 digits';

      // Ideathon Theme Selection Check
      if (event.id === 'ideathon' && !selectedTheme) {
        errs.theme = 'You must select exactly one Ideathon theme to proceed';
      }

      // Member 2 is mandatory (since min team size is 2)
      if (!dynamicMembers[0].name.trim()) {
        errs.member2Name = 'Team Member 2 Name is required (minimum team size is 2)';
      }
      if (!dynamicMembers[0].usn.trim()) {
        errs.member2Usn = 'Team Member 2 USN is required';
      }

      // Optional Members 3 & 4: If name is given, USN must be provided and vice-versa
      dynamicMembers.slice(1).forEach((m, idx) => {
        const memberNum = idx + 3;
        if (m.name.trim() && !m.usn.trim()) {
          errs[`member${memberNum}Usn`] = `USN is required for Member ${memberNum}`;
        }
        if (!m.name.trim() && m.usn.trim()) {
          errs[`member${memberNum}Name`] = `Name is required for Member ${memberNum}`;
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Re-verify the event is still open before saving.
    // This closes the race where admin disables an event while a participant.
    // is mid-form.
    try {
      const settings = (await getEventSettings()) || {};
      if (!settings[event.id]) {
        setIsClosed(true);
        setSubmitError('Registrations for this event are currently closed by the organizers.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } catch { /* render-gate above already covers offline/error cases */ }

    if (!validateForm()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      let formData = {};

      if (event.id === 'minute-to-win-it') {
        formData = {
          participantName: leaderName.trim(),
          usn: leaderUsn.trim().toUpperCase(),
          email: leaderEmail.trim() || null,
          phone: leaderPhone.trim() || null
        };
      } else if (event.id === 'tech-quiz') {
        formData = {
          teamName: teamName.trim(),
          member1Name: leaderName.trim(),
          member1Usn: leaderUsn.trim().toUpperCase(),
          member1Phone: leaderPhone.trim(),
          member2Name: quizMember2Name.trim(),
          member2Usn: quizMember2Usn.trim().toUpperCase(),
          member2Phone: quizMember2Phone.trim()
        };
      } else {
        // Filter out empty optional members
        const validMembers = dynamicMembers
          .filter(m => m.name.trim() && m.usn.trim())
          .map(m => ({
            name: m.name.trim(),
            usn: m.usn.trim().toUpperCase()
          }));

        formData = {
          teamName: teamName.trim(),
          leaderName: leaderName.trim(),
          leaderUsn: leaderUsn.trim().toUpperCase(),
          leaderEmail: leaderEmail.trim(),
          leaderPhone: leaderPhone.trim(),
          members: validMembers,
          theme: event.id === 'ideathon' ? selectedTheme : null
        };
      }

      // Persist to Database (Supabase + Local fallback)
      const savedRecord = await saveRegistration(formData, event);
      setConfirmedRecord(savedRecord);
    } catch (err) {
      console.error('Registration submission failed:', err);
      setSubmitError(err.message || 'Failed to submit registration. Please check your network and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already confirmed, render the Official Ticket / Confirmation
  if (confirmedRecord) {
    return (
      <RegistrationSuccess
        record={confirmedRecord}
        onBackToEvents={onBackToEvents}
        onRegisterAnother={onRegisterAnother}
      />
    );
  }

  // If the event is closed (admin turned it off), block registration.
  if (settingsChecked && isClosed) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-xl mx-auto text-center glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-tech font-extrabold text-white mb-3">Registrations are closed</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {event.name} is not accepting new registrations right now. Please check back later or pick another event.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={onBackToEvents} className="px-5 py-2.5 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">Back to All Events</button>
            <button onClick={onRegisterAnother} className="px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl shadow-lg">Register for Another Event</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl mx-auto">
        {/* Navigation & Event Header */}
        <div className="mb-8">
          <button
            onClick={onBackToEvents}
            className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-4 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to All Events</span>
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {event.category}
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              {event.teamSizeText}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-tech font-extrabold text-white mb-2">
            {event.name} <span className="text-gradient-cyan">Registration</span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* Submission Error Banner */}
        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <div className="font-semibold text-red-300">Registration Submission Error</div>
              <div>{submitError}</div>
            </div>
          </div>
        )}

        {/* Main Registration Form */}
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/25 shadow-2xl space-y-8">

          {/* ======================================================== */}
          {/* CASE 1: MINUTE TO WIN IT (INDIVIDUAL PARTICIPATION)       */}
          {/* ======================================================== */}
          {event.id === 'minute-to-win-it' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Participant Details</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Individual competition. Please provide your official college credentials.
                </p>
              </div>

              {/* Participant Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Participant Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${errors.leaderName ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                />
                {errors.leaderName && (
                  <p className="text-xs text-rose-400 mt-1">{errors.leaderName}</p>
                )}
              </div>

              {/* USN */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  University / College USN <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1RV21CS001"
                  value={leaderUsn}
                  onChange={(e) => setLeaderUsn(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${errors.leaderUsn ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    } text-white placeholder-slate-500 text-sm font-mono focus:outline-none uppercase transition-colors`}
                />
                {errors.leaderUsn && (
                  <p className="text-xs text-rose-400 mt-1">{errors.leaderUsn}</p>
                )}
              </div>

              {/* Contact Phone (for ticket receipt) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Contact Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                  />
                  {errors.leaderPhone && (
                    <p className="text-xs text-rose-400 mt-1">{errors.leaderPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. student@college.edu"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                  />
                  {errors.leaderEmail && (
                    <p className="text-xs text-rose-400 mt-1">{errors.leaderEmail}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CASE 2: TECH QUIZ (EXACTLY 2 MEMBERS COMPULSORY)          */}
          {/* ======================================================== */}
          {event.id === 'tech-quiz' && (
            <div className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Team Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Binary Brains"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${errors.teamName ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                    } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                />
                {errors.teamName && (
                  <p className="text-xs text-rose-400 mt-1">{errors.teamName}</p>
                )}
              </div>

              {/* Team Member 1 */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Team Member 1 (Compulsory)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Lead Quizzer</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Rao"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${errors.leaderName ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      } text-white placeholder-slate-600 text-sm focus:outline-none`}
                  />
                  {errors.leaderName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.leaderName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      USN <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1BM22CS045"
                      value={leaderUsn}
                      onChange={(e) => setLeaderUsn(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${errors.leaderUsn ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                        } text-white placeholder-slate-600 text-sm font-mono uppercase focus:outline-none`}
                    />
                    {errors.leaderUsn && (
                      <p className="text-xs text-rose-400 mt-1">{errors.leaderUsn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${errors.leaderPhone ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                        } text-white placeholder-slate-600 text-sm focus:outline-none`}
                    />
                    {errors.leaderPhone && (
                      <p className="text-xs text-rose-400 mt-1">{errors.leaderPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Team Member 2 (Compulsory)</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Partner Quizzer</span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Kulkarni"
                    value={quizMember2Name}
                    onChange={(e) => setQuizMember2Name(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${errors.quizMember2Name ? 'border-rose-500' : 'border-slate-700 focus:border-purple-400'
                      } text-white placeholder-slate-600 text-sm focus:outline-none`}
                  />
                  {errors.quizMember2Name && (
                    <p className="text-xs text-rose-400 mt-1">{errors.quizMember2Name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      USN <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1BM22CS089"
                      value={quizMember2Usn}
                      onChange={(e) => setQuizMember2Usn(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${errors.quizMember2Usn ? 'border-rose-500' : 'border-slate-700 focus:border-purple-400'
                        } text-white placeholder-slate-600 text-sm font-mono uppercase focus:outline-none`}
                    />
                    {errors.quizMember2Usn && (
                      <p className="text-xs text-rose-400 mt-1">{errors.quizMember2Usn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543211"
                      value={quizMember2Phone}
                      onChange={(e) => setQuizMember2Phone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-950 border ${errors.quizMember2Phone ? 'border-rose-500' : 'border-slate-700 focus:border-purple-400'
                        } text-white placeholder-slate-600 text-sm focus:outline-none`}
                    />
                    {errors.quizMember2Phone && (
                      <p className="text-xs text-rose-400 mt-1">{errors.quizMember2Phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CASE 3: TEAM EVENTS (DTH, IDEATHON, FREE FIRE, VIDEO)    */}
          {/* ======================================================== */}
          {event.id !== 'minute-to-win-it' && event.id !== 'tech-quiz' && (
            <div className="space-y-8">
              {/* SECTION: TEAM DETAILS */}
              <div>
                <div className="border-b border-slate-800 pb-2 mb-4">
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Team Details</span>
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Team Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CyberKnights"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/90 border ${errors.teamName ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                      } text-white placeholder-slate-500 text-sm focus:outline-none transition-colors`}
                  />
                  {errors.teamName && (
                    <p className="text-xs text-rose-400 mt-1">{errors.teamName}</p>
                  )}
                </div>
              </div>

              {/* IDEATHON SPECIFIC: SELECTABLE THEME CARDS */}
              {event.id === 'ideathon' && (
                <div>
                  <div className="border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-base font-display font-bold text-amber-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span>Select Your Ideathon Theme <span className="text-rose-400">*</span></span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Participants must select exactly one theme for their innovation proposal.
                    </p>
                  </div>

                  {errors.theme && (
                    <p className="text-xs text-rose-400 mb-3 font-semibold">{errors.theme}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Theme 1 */}
                    <div
                      onClick={() => setSelectedTheme('Smart Campus & Student Life')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative ${selectedTheme === 'Smart Campus & Student Life'
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                          Theme 01
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedTheme === 'Smart Campus & Student Life'
                            ? 'border-amber-400 bg-amber-400 text-slate-950'
                            : 'border-slate-600'
                            }`}
                        >
                          {selectedTheme === 'Smart Campus & Student Life' && (
                            <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        Smart Campus & Student Life
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Solutions for campus infrastructure, automated administration, lab access, hostel security, student wellness, and collaborative study platforms.
                      </p>
                    </div>

                    {/* Theme 2 */}
                    <div
                      onClick={() => setSelectedTheme('Daily Life Productivity & Digital Utilities')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative ${selectedTheme === 'Daily Life Productivity & Digital Utilities'
                        ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                          Theme 02
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedTheme === 'Daily Life Productivity & Digital Utilities'
                            ? 'border-amber-400 bg-amber-400 text-slate-950'
                            : 'border-slate-600'
                            }`}
                        >
                          {selectedTheme === 'Daily Life Productivity & Digital Utilities' && (
                            <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        Daily Life Productivity & Digital Utilities
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Intelligent utilities, micro-productivity systems, assistive tech, automated budgeting, and AI tools enhancing personal everyday workflows.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: TEAM LEADER DETAILS */}
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2">
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Team Leader Details</span>
                  </h3>
                  <p className="text-xs text-slate-400">Primary point of contact for team notifications and scheduling.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Team Leader Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikramaditya"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-900 border ${errors.leaderName ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                        } text-white placeholder-slate-600 text-sm focus:outline-none`}
                    />
                    {errors.leaderName && (
                      <p className="text-xs text-rose-400 mt-1">{errors.leaderName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Team Leader USN <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1MS21CS099"
                      value={leaderUsn}
                      onChange={(e) => setLeaderUsn(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-900 border ${errors.leaderUsn ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                        } text-white placeholder-slate-600 text-sm font-mono uppercase focus:outline-none`}
                    />
                    {errors.leaderUsn && (
                      <p className="text-xs text-rose-400 mt-1">{errors.leaderUsn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. leader@college.edu"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-900 border ${errors.leaderEmail ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                        } text-white placeholder-slate-600 text-sm focus:outline-none`}
                    />
                    {errors.leaderEmail && (
                      <p className="text-xs text-rose-400 mt-1">{errors.leaderEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                      Phone Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={leaderPhone}
                      onChange={(e) => setLeaderPhone(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-900 border ${errors.leaderPhone ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                        } text-white placeholder-slate-600 text-sm focus:outline-none`}
                    />
                    {errors.leaderPhone && (
                      <p className="text-xs text-rose-400 mt-1">{errors.leaderPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION: DYNAMIC TEAM MEMBERS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      <span>Team Members</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Minimum 2 participants (Leader + Member 2). Maximum 4 participants.
                    </p>
                  </div>
                  <div className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    Total: {dynamicMembers.length + 1} / 4 Members
                  </div>
                </div>

                {/* Member 2 (Compulsory) */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                    <span>Team Member 2 (Compulsory)</span>
                    <span className="text-[10px] font-mono text-cyan-400/80">Required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Team Member 2 Name *"
                        value={dynamicMembers[0]?.name || ''}
                        onChange={(e) => handleMemberChange(0, 'name', e.target.value)}
                        className={`w-full px-3.5 py-2 rounded-lg bg-slate-950 border ${errors.member2Name ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                          } text-white placeholder-slate-600 text-sm focus:outline-none`}
                      />
                      {errors.member2Name && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.member2Name}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Team Member 2 USN *"
                        value={dynamicMembers[0]?.usn || ''}
                        onChange={(e) => handleMemberChange(0, 'usn', e.target.value.toUpperCase())}
                        className={`w-full px-3.5 py-2 rounded-lg bg-slate-950 border ${errors.member2Usn ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-400'
                          } text-white placeholder-slate-600 text-sm font-mono uppercase focus:outline-none`}
                      />
                      {errors.member2Usn && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.member2Usn}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional Member 3 and 4 */}
                {dynamicMembers.slice(1).map((member, idx) => {
                  const memberNumber = idx + 3;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 relative group">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>Team Member {memberNumber} (Optional)</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx + 1)}
                          className="text-rose-400 hover:text-rose-300 text-xs font-mono flex items-center gap-1 hover:underline"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder={`Team Member ${memberNumber} Name`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx + 1, 'name', e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-600 text-sm focus:outline-none"
                          />
                          {errors[`member${memberNumber}Name`] && (
                            <p className="text-[11px] text-rose-400 mt-1">{errors[`member${memberNumber}Name`]}</p>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder={`Team Member ${memberNumber} USN`}
                            value={member.usn}
                            onChange={(e) => handleMemberChange(idx + 1, 'usn', e.target.value.toUpperCase())}
                            className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-white placeholder-slate-600 text-sm font-mono uppercase focus:outline-none"
                          />
                          {errors[`member${memberNumber}Usn`] && (
                            <p className="text-[11px] text-rose-400 mt-1">{errors[`member${memberNumber}Usn`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Member Button (if less than 4 total) */}
                {dynamicMembers.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="w-full py-2.5 rounded-xl border border-dashed border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 bg-cyan-500/5 hover:bg-cyan-500/10 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>+ Add Optional Team Member ({dynamicMembers.length + 2}/4)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Form Submit Button & Disclaimer */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:opacity-95 transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <span>Confirm Registration for {event.name}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500">
              By submitting this form, you confirm that all entered student USN details are authentic.
              A unique Registration ID and pass will be instantly generated upon confirmation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
