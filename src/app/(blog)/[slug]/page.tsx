import React, { Suspense } from "react";

import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts } from "@/lib/api/blog";
import { BASE_URL, POSTS_DIR } from "@/lib/constants";
import { ViewCounter } from "@/components/view-counter";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { FadeLeft, FadeUp, FadeIn } from "@/components/animations";

export async function generateStaticParams() {
  let posts = getBlogPosts(POSTS_DIR);

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let post = getBlogPosts(POSTS_DIR).find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let { title, publishedAt: publishedTime, summary: description, image } = post;
  let ogImage = image ? image : `${BASE_URL}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${BASE_URL}/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }) {
  const { slug } = await params;
  let post = getBlogPosts(POSTS_DIR).find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex-auto min-w-0 flex flex-col px-2 md:px-0">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            description: post.summary,
            image: post.image
              ? `${BASE_URL}/${post.image}`
              : `/opengraph-image`,
            url: `${BASE_URL}/${post.slug}`,
            author: {
              "@type": "Person",
              name: "My Portfolio",
            },
          }),
        }}
      />
      <FadeLeft delay={0.3}>
        <h1 className="font-semibold text-3xl tracking-tighter">
          <Balancer>{post.title}</Balancer>
        </h1>
      </FadeLeft>
      <FadeUp delay={0.3 * 2}>
        <div className="flex justify-between items-center mt-2 mb-4 text-sm flex-nowrap">
          <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 shrink-0">
            <Link
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-gray-800 dark:hover:text-gray-400"
              href="https://github.com/1chooo"
            >
              @1chooo
            </Link>
            {" | "}
            {formatDate(post.publishedAt)}
            {" | "}
            {post.readingTime}
          </p>
          <Suspense fallback={<div className="text-xs">Loading views...</div>}>
            <ViewCounter
              className="font-mono text-xs text-neutral-600 dark:text-neutral-400 shrink-0"
              slug={post.slug}
              trackView
            />
          </Suspense>
        </div>
      </FadeUp>
      <FadeIn delay={0.3 * 3}>
        <article className="prose">
          <CustomMDX source={post.content} />
        </article>
      </FadeIn>

      <FadeUp delay={0.3 * 2}>
        <div className="my-4 flex items-center hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
          <Link href="/" className="flex items-center">
            ← Writing
          </Link>
        </div>
      </FadeUp>
    </main>
  );
}
