// App.jsx — hash router.
// Default: the visual homepage. #/experience: the scroll film. #/audit: conversion page.
import React, { useEffect, useState } from 'react';
import HomePage from './HomePage.jsx';
import ScrollExperience from './experience/ScrollExperience.jsx';
import StaticExperience from './StaticExperience.jsx';
import AuditPage from './AuditPage.jsx';
import BrokenPage from './BrokenPage.jsx';
import ReviewPage from './ReviewPage.jsx';
import WebinarPage from './WebinarPage.jsx';
import './experience/styles.css';

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const h = () => { setRoute(window.location.hash); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  if (route.startsWith('#/audit')) return <AuditPage />;
  if (route.startsWith('#/broken')) return <BrokenPage />;
  if (route.startsWith('#/review')) return <ReviewPage />;
  if (route.startsWith('#/webinar')) return <WebinarPage />;
  if (route.startsWith('#/experience')) return reduced ? <StaticExperience /> : <ScrollExperience />;
  return <HomePage />;
}
