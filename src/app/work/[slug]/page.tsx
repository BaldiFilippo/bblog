import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectSlugs, getProjectWithHtml, getNextProject, formatDate } from "@/lib/projects";
import { ProjectContent } from "@/components/projects/project-content";
import { ProjectFixedHero } from "@/components/projects/ProjectFixedHero";

const SITE_NAME = "BDESIGN";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all projects
export async function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectWithHtml(slug);

  if (!project) {
    return {
      title: "Progetto non trovato",
    };
  }

  const metadata: Metadata = {
    title: `${project.title} | ${SITE_NAME}`,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: "article",
      publishedTime: project.date,
      url: `${SITE_URL}/work/${project.slug}`,
    },
    twitter: {
      card: project.cover ? "summary_large_image" : "summary",
      title: project.title,
      description: project.excerpt,
    },
  };

  if (project.cover) {
    metadata.openGraph!.images = [
      {
        url: project.cover.startsWith("http") ? project.cover : `${SITE_URL}${project.cover}`,
        width: 1200,
        height: 630,
        alt: project.title,
      },
    ];
    metadata.twitter!.images = [project.cover.startsWith("http") ? project.cover : `${SITE_URL}${project.cover}`];
  }

  return metadata;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectWithHtml(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(slug);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: project.title,
    description: project.excerpt,
    datePublished: project.date,
    image: project.cover ? (project.cover.startsWith("http") ? project.cover : `${SITE_URL}${project.cover}`) : undefined,
    url: `${SITE_URL}/work/${project.slug}`,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen  bg-background relative overflow-x-hidden">
        {/* Hero - Title + Author + Meta (scrolls naturally) */}
        <ProjectFixedHero
          title={project.title}
          url={project.url}
          date={project.date}
          formattedDate={formatDate(project.date)}
          readingTime={project.readingTime}
        />

        {/* Content (cover, body, back button) */}
        <div className="mt-[-10vh]">
          <ProjectContent
            cover={project.cover}
            title={project.title}
            contentHtml={project.contentHtml}
            nextProject={nextProject ? { slug: nextProject.slug, title: nextProject.title, cover: nextProject.cover, excerpt: nextProject.excerpt } : undefined}
          />
        </div>

      </article>
    </>
  );
}
