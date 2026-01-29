interface PriceDisplayProps {
  price: number;
  discount?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function PriceDisplay({ 
  price, 
  discount, 
  size = 'medium',
  className = '' 
}: PriceDisplayProps) {
  const hasDiscount = discount && discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

  const sizeClasses = {
    small: {
      final: 'text-lg',
      original: 'text-sm',
      discount: 'text-xs px-1.5 py-0.5',
    },
    medium: {
      final: 'text-2xl',
      original: 'text-lg',
      discount: 'text-sm px-2 py-1',
    },
    large: {
      final: 'text-4xl',
      original: 'text-2xl',
      discount: 'text-base px-2.5 py-1',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {hasDiscount && (
        <span className={`bg-green-500 text-white font-bold rounded ${classes.discount}`}>
          -{discount}%
        </span>
      )}
      
      <div className="flex flex-col">
        <span className={`font-bold text-neutral-900 ${classes.final}`}>
          R$ {finalPrice.toFixed(2).replace('.', ',')}
        </span>
        
        {hasDiscount && (
          <span className={`text-neutral-500 line-through ${classes.original}`}>
            R$ {price.toFixed(2).replace('.', ',')}
          </span>
        )}
      </div>
    </div>
  );
}
