import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import type { NavigateFunction, Location } from 'react-router-dom';

export interface RouterProps {
  navigate: NavigateFunction;
  location: Location;
  params: Readonly<Record<string, string>>;
}

/**
 * withRouter – HOC that injects navigate, location, and params
 * into class components (React Router v6 equivalent of the old withRouter).
 */
export function withRouter<P extends RouterProps>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof RouterProps>> {
  const Wrapper = (props: Omit<P, keyof RouterProps>) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    return <Component {...(props as P)} navigate={navigate} location={location} params={params} />;
  };
  Wrapper.displayName = `withRouter(${Component.displayName ?? Component.name})`;
  return Wrapper;
}
