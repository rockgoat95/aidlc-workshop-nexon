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

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      data-testid={`menu-card-${menu.id}`}
    >
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
            onClick={(e) => {
              e.stopPropagation();
              addItem({ id: menu.id, name: menu.name, price: menu.price }, 1);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 44,
              minHeight: 44,
            }}
            data-testid={`menu-add-${menu.id}`}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
