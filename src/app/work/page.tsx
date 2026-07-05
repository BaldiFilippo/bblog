import { Metadata } from "next";
import { getAllProjects } from "@/lib/projects";
import { AllProjectsList } from "@/components/projects/all-projects-list";

const SITE_NAME = "BDESIGN";

export const metadata: Metadata = {
  title: `Progetti | ${SITE_NAME}`,
  description: "Tutti i progetti realizzati da BDESIGN",
};

export default function AllProjectsPage() {
  const projects = getAllProjects();

  return <AllProjectsList projects={projects} />;
}
