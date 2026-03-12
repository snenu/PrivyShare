"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-privy-black px-4">
          <h1 className="text-xl font-semibold text-privy-white">Something went wrong</h1>
          <p className="mt-2 max-w-md text-center text-sm text-privy-gray-400">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <Link href="/" className="btn-primary mt-6">
            Go home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
