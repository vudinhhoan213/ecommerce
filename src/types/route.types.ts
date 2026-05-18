import type React from "react";

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  layout: React.ComponentType<{ children: React.ReactNode }> | null;
  category: string;
}
