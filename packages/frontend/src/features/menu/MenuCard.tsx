import { useState } from 'react';
import { useCartStore } from '../../stores/cart-store';

interface MenuCardProps {
  menu: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    imageUrl: string | null;
  };
}

export function MenuCard({ menu }: MenuCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((item) => item.id === menu.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: menu.id, name: menu.name, price: menu.price }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.1s, box-shadow 0.1s',
        ...(added ? { transform: 'scale(0.97)', boxShadow: '0 0 0 2px #2563eb' } : {}),
      }}
      data-testid={`menu-card-${menu.id}`}
    >
      {/* Cart badge */}
      {quantity > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#2563eb',
            color: '#fff',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          data-testid={`menu-badge-${menu.id}`}
        >
          {quantity}
        </div>
      )}

      {menu.imageUrl && (
        <img
          src={menu.imageUrl}
          alt={menu.name}
          style={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
      )}
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{menu.name}</h3>
        {menu.description && (
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#6b7280' }}>
            {menu.description}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#2563eb' }}>
            {menu.price.toLocaleString()}원
          </span>
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: added ? '#16a34a' : '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 44,
              minHeight: 44,
              transition: 'background-color 0.2s, transform 0.1s',
              transform: added ? 'scale(1.1)' : 'scale(1)',
            }}
            data-testid={`menu-add-${menu.id}`}
          >
            {added ? '✓ 담김' : '담기'}
          </button>
        </div>
      </div>
    </div>
  );
}
