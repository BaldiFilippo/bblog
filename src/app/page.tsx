import Parallax, { ProjectItem } from "@/components/parallax";
import { getAllProjects } from "@/lib/projects";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const projects = getAllProjects();

  // Transform the 5 most recent projects to the format expected by Parallax
  const projectItems: ProjectItem[] = projects.slice(0, 5).map((project, index) => ({
    id: index + 1,
    slug: project.slug,
    title: project.title,
    url: project.url,
    image: project.cover || "/images/image1.webp",
    excerpt: project.excerpt,
    date: project.date,
  }));

  return (
    <>
      <LoadingScreen />
      <Parallax projects={projectItems} />
    </>
  );
}
