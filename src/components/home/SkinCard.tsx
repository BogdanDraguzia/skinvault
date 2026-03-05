'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice, getExteriorClass, getQualityClass } from '@/lib/utils';
import type { Skin } from '@/types';

interface Props {
  skin: Skin;
  index?: number;
  featured?: boolean;
}

export default function SkinCard({ skin, index = 0, featured = false }: Props) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const inCart = isInCart(skin.id);
  const revealClass = `card-reveal-${Math.min((index % 10) + 1, 10)}`;

  function handleCartToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (inCart) {
      removeFromCart(skin.id);
    } else {
      addToCart(skin);
    }
  }

  return (
    <Link
      href={`/product/${skin.id}`}
      className={`group block glass-card rounded-xl overflow-hidden scan-line-effect elastic-scale ${revealClass} ${
        featured ? 'ring-1 ring-[rgba(6,182,212,0.3)]' : ''
      }`}
    >
      {/* Ribbon */}
      {featured && (
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-bold bg-[#06b6d4] text-[#0a0e1a]">
          Limited Offer
        </div>
      )}

      {/* Image area */}
      <div className="relative bg-gradient-to-br from-[#0f1729] to-[#162033] flex items-center justify-center p-6 h-40 overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, transparent 70%)',
          }}
        />
        <Image
          src={skin.imageUrl}
          alt={skin.title}
          width={160}
          height={120}
          className="object-contain max-h-28 w-auto transform group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://placehold.co/200x150?text=No+Image';
          }}
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Quality */}
        <p className={`text-xs font-medium mb-1 ${getQualityClass(skin.quality)}`}>
          {skin.quality}
        </p>

        {/* Title */}
        <h3 className="text-white text-sm font-semibold leading-snug mb-2 line-clamp-2 group-hover:text-[#06b6d4] transition-colors">
          {skin.title}
        </h3>

        {/* Exterior badge */}
        {skin.exterior && skin.exterior !== 'Not Painted' && (
          <span
            className={`inline-block text-[10px] px-1.5 py-0.5 rounded border mb-3 ${getExteriorClass(skin.exterior)}`}
          >
            {skin.exterior}
          </span>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div className="pulse-ring-price inline-block">
            <span className="text-[#06b6d4] font-bold text-base">
              {formatPrice(skin.price)}
            </span>
          </div>

          {skin.isAvailable ? (
            <button
              onClick={handleCartToggle}
              className={`btn-press px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inCart
                  ? 'bg-[rgba(6,182,212,0.15)] text-[#06b6d4] border border-[rgba(6,182,212,0.4)]'
                  : 'bg-[#06b6d4] text-[#0a0e1a] hover:bg-[#0ea5e9]'
              }`}
            >
              {inCart ? '✓ In Cart' : 'Add'}
            </button>
          ) : (
            <span className="text-xs text-slate-600">Sold</span>
          )}
        </div>
      </div>
    </Link>
  );
}
