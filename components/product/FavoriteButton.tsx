"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked(!liked)}
      className="absolute top-3 right-3 p-2 rounded-full bg-transparent  transition"
    >
      <Heart
        size={20}
        className={`transition ${
          liked ? "fill-fuchsia-900 text-fuchsia-900" : "text-primary"
        }`}
      />
    </button>
  );
}