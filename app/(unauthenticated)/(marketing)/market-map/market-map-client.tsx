"use client"

import { motion } from "framer-motion"
import { CategoryCard } from "@/components/CategoryCard"
import { CategoryWithEcosystems } from "@/app/actions"

interface MarketMapClientProps {
  categoriesWithEcosystems: CategoryWithEcosystems[]
}

export function MarketMapClient({
  categoriesWithEcosystems
}: MarketMapClientProps) {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-foreground text-4xl font-bold sm:text-5xl"
          >
            Bitcoin Ecosystem Market Map
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground mx-auto mt-4 max-w-3xl text-xl"
          >
            Explore the comprehensive landscape of Bitcoin development across
            different layers and protocols
          </motion.p>
        </motion.div>

        {categoriesWithEcosystems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {categoriesWithEcosystems.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="py-12 text-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="border-border bg-card rounded-lg border p-8 shadow-sm"
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-foreground mb-4 text-2xl font-semibold"
              >
                Market Map Coming Soon
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-muted-foreground mb-6"
              >
                The Bitcoin ecosystem data is being prepared. Please check back
                soon to explore the comprehensive market map.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-muted-foreground text-sm"
              >
                <p>Expected categories:</p>
                <motion.ul className="mt-2 space-y-1">
                  {[
                    "Bitcoin L1",
                    "Lightning Network",
                    "Meta-Protocols",
                    "Sidechains",
                    "Rollups",
                    "Off-chain Solutions"
                  ].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                    >
                      • {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
