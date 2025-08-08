"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { CategoryWithEcosystems } from "@/app/actions"

interface CategoryCardProps {
  category: CategoryWithEcosystems
  index?: number
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: "easeOut"
      }}
      className="border-border bg-card rounded-lg border p-6 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md"
    >
      <div className="mb-4">
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-muted-foreground text-sm">
            {category.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {category.ecosystems.length > 0 ? (
          category.ecosystems.map((ecosystem, ecosystemIndex) => (
            <motion.div
              key={ecosystem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: index * 0.08 + 0.1 + ecosystemIndex * 0.03,
                duration: 0.2
              }}
            >
              <Link
                href={`/ecosystem/${ecosystem.slug}`}
                className="border-border/50 hover:border-border hover:bg-muted/50 block rounded-md border p-3 transition-all duration-150 hover:translate-x-1"
                prefetch={false}
              >
                <div className="flex items-center space-x-3">
                  {ecosystem.logoUrl && (
                    <div className="relative h-8 w-8 flex-shrink-0">
                      <Image
                        src={ecosystem.logoUrl}
                        alt={`${ecosystem.name} logo`}
                        fill
                        sizes="32px"
                        className="rounded-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-sm font-medium">
                      {ecosystem.name}
                    </h3>
                    {ecosystem.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {ecosystem.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm italic">
            No ecosystems available yet
          </p>
        )}
      </div>
    </motion.div>
  )
}
