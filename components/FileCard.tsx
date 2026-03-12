"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/formatPrice";

interface FileCardProps {
  fileId: number;
  price: string;
  index?: number;
}

export function FileCard({ fileId, price, index = 0 }: FileCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/files/${fileId}`}
        className="card block transition hover:border-privy-gray-600 group"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-privy-gray-800">
            <img src="/file-badge.svg" alt="" className="h-5 w-5 opacity-70" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs text-privy-gray-500">#{fileId}</span>
            <p className="mt-1 font-medium group-hover:text-privy-white">File {fileId}</p>
            <p className="mt-1 text-sm text-privy-gray-400">Price: {formatPrice(price)}</p>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
