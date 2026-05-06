import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Loading, ErrorMessage } from '../../shared';
import { MenuCard } from './MenuCard';

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

export function MenuList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['menus', selectedCategory],
    queryFn: async () => {
      const params = selectedCategory ? `?categoryId=${selectedCategory}` : '';
      const { data } = await apiClient.get(`/menus${params}`);
      return data as { menus: Menu[]; categories: Category[] };
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="메뉴를 불러올 수 없습니다." onRetry={refetch} />;

  const { menus = [], categories = [] } = data || {};

  return (
    <div style={{ padding: 16 }}>
      {/* Category Tabs */}
      <div
        style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 8 }}
        data-testid="category-tabs"
      >
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: '10px 20px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: !selectedCategory ? '#2563eb' : '#e5e7eb',
            color: !selectedCategory ? '#fff' : '#374151',
            fontWeight: 600,
            cursor: 'pointer',
            minWidth: 44,
            minHeight: 44,
          }}
          data-testid="category-tab-all"
        >
          전체
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '10px 20px',
              borderRadius: 20,
              border: 'none',
              backgroundColor: selectedCategory === cat.id ? '#2563eb' : '#e5e7eb',
              color: selectedCategory === cat.id ? '#fff' : '#374151',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minWidth: 44,
              minHeight: 44,
            }}
            data-testid={`category-tab-${cat.id}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
        data-testid="menu-grid"
      >
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>

      {menus.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
          메뉴가 없습니다.
        </p>
      )}
    </div>
  );
}
