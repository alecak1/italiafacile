import { Navigate } from 'react-router-dom';

const Index = () => {
  const onboardingComplete = localStorage.getItem('onboarding_complete');
  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Navigate to="/" replace />;
};

export default Index;
