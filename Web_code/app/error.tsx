"use client";

import { useEffect } from "react";
import EmptyState from "./components/ui/EmptyState";

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return <EmptyState title=" Uh Oh" subtitle="Something Went Wrong!" />;
};

export default ErrorState;
