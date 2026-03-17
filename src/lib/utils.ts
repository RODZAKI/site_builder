import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { Artifact, CardExport } from "./types";

export function artifactToCardExport(artifact: Artifact): CardExport {
  return {
    id: artifact.id,
    thread: artifact.field_id,
    title: artifact.title,
    content: artifact.content.slice(0, 500),
    domain: ["logos"],   // temporary default
    axis: "structural",  // temporary default
    depth: 3,            // temporary default
    relations: [],
    version: (artifact.version_count ?? 1).toString(),
    created: artifact.created_at,
    status: artifact.state === "LIVE" ? "approved" : "candidate",
  };
}