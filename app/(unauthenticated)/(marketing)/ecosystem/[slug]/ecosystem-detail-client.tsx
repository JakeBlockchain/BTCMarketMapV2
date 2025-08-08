"use client"

import { motion } from "framer-motion"
import { getEcosystemDetails } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EcosystemDetailClientProps {
  ecosystem: NonNullable<Awaited<ReturnType<typeof getEcosystemDetails>>>
}

export function EcosystemDetailClient({
  ecosystem
}: EcosystemDetailClientProps) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Link href="/market-map">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Market Map
          </Button>
        </Link>
      </motion.div>

      {/* Ecosystem Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-start gap-6">
          {ecosystem.logoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-shrink-0"
            >
              <Image
                src={ecosystem.logoUrl}
                alt={`${ecosystem.name} logo`}
                width={80}
                height={80}
                className="rounded-lg border"
                priority
              />
            </motion.div>
          )}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-2 flex items-center gap-2"
            >
              <Link
                href="/market-map"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {ecosystem.category.name}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-sm font-medium">{ecosystem.name}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-3 text-3xl font-bold"
            >
              {ecosystem.name}
            </motion.h1>
            {ecosystem.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-muted-foreground text-lg leading-relaxed"
              >
                {ecosystem.description}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mb-6 flex items-center justify-between"
        >
          <h2 className="text-2xl font-semibold">
            Projects Built on {ecosystem.name}
          </h2>
          <div className="text-muted-foreground text-sm">
            {ecosystem.projects.length} project
            {ecosystem.projects.length !== 1 ? "s" : ""}
          </div>
        </motion.div>

        {ecosystem.projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="py-12 text-center"
          >
            <div className="mx-auto max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mb-4"
              >
                <Globe className="text-muted-foreground mx-auto h-12 w-12" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mb-2 text-lg font-medium"
              >
                No Projects Yet
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="text-muted-foreground"
              >
                This ecosystem doesn't have any projects listed yet. Check back
                later for updates.
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ecosystem.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.0 + index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="rounded-lg border p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start gap-4">
                  {project.logoUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.1 + index * 0.1
                      }}
                      className="flex-shrink-0"
                    >
                      <Image
                        src={project.logoUrl}
                        alt={`${project.name} logo`}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    </motion.div>
                  )}
                  <div className="min-w-0 flex-1">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.2 + index * 0.1
                      }}
                      className="mb-1 truncate text-lg font-semibold"
                    >
                      {project.name}
                    </motion.h3>
                    {project.description && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 1.3 + index * 0.1
                        }}
                        className="text-muted-foreground line-clamp-3 text-sm"
                      >
                        {project.description}
                      </motion.p>
                    )}
                  </div>
                </div>

                {project.websiteUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 1.4 + index * 0.1
                    }}
                    className="mt-4"
                  >
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit Website
                    </a>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
