"use client";
import { ImagesBadge } from "@/components/ui/images-badge";

const DOCUMENT_PREVIEWS = [
  "/images/badge-nda.svg",
  "/images/badge-contract.svg",
  "/images/badge-sources.svg",
];

export default function ImagesBadgeDemo() {
  return (
    <div className="flex w-full items-center justify-start">
      <ImagesBadge
        text="See the live app preview"
        href="#product-preview"
        images={DOCUMENT_PREVIEWS}
        folderSize={{ width: 36, height: 26 }}
        teaserImageSize={{ width: 22, height: 15 }}
        hoverImageSize={{ width: 52, height: 34 }}
        hoverTranslateY={-38}
      />
    </div>
  );
}
