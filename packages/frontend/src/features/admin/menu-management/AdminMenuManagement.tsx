import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { Button, Loading, ErrorMessage, Modal } from '../../../shared';

interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
  displayOrder: number;
  category: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

export function AdminMenuManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', categoryId: '', imageUrl: '' });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-menus'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/menus');
      return data as { menus: Menu[]; categories: Category[] };
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/admin/categories');
      return data.categories as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post('/admin/menus', {
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description || null,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.put(`/admin/menus/${editingMenu!.id}`, {
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description || null,
        categoryId: formData.categoryId,
        imageUrl: formData.imageUrl || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/menus/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-menus'] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingMenu(null);
    setFormData({ name: '', price: '', description: '', categoryId: '', imageUrl: '' });
  };

  const openEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      price: menu.price.toString(),
      description: menu.description || '',
      categoryId: menu.categoryId,
      imageUrl: menu.imageUrl || '',
    });
    setShowForm(true);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="메뉴를 불러올 수 없습니다." onRetry={refetch} />;

  const menus = data?.menus || [];
  const categories = categoriesData || [];

  return (
    <div style={{ padding: 16 }} data-testid="admin-menu-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, margin: 0 }}>메뉴 관리</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} data-testid="menu-add-button">
          + 메뉴 추가
        </Button>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {menus.map((menu) => (
          <div
            key={menu.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
            data-testid={`admin-menu-item-${menu.id}`}
          >
            {menu.imageUrl && (
              <img src={menu.imageUrl} alt={menu.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{menu.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {menu.category.name} · {menu.price.toLocaleString()}원
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => openEdit(menu)}>수정</Button>
              <Button size="sm" variant="danger" onClick={() => {
                if (confirm(`"${menu.name}" 메뉴를 삭제하시겠습니까?`)) deleteMutation.mutate(menu.id);
              }}>삭제</Button>
            </div>
          </div>
        ))}
      </div>

      {menus.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>등록된 메뉴가 없습니다.</p>
      )}

      <Modal isOpen={showForm} onClose={resetForm} title={editingMenu ? '메뉴 수정' : '메뉴 추가'}>
        <form
          onSubmit={(e) => { e.preventDefault(); editingMenu ? updateMutation.mutate() : createMutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            placeholder="메뉴명 *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
            required
            data-testid="menu-form-name"
          />
          <input
            type="number"
            placeholder="가격 *"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
            required
            data-testid="menu-form-price"
          />
          <textarea
            placeholder="설명"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db', minHeight: 80 }}
            data-testid="menu-form-description"
          />
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
            required
            data-testid="menu-form-category"
          >
            <option value="">카테고리 선택 *</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            placeholder="이미지 URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            style={{ padding: 12, borderRadius: 8, border: '1px solid #d1d5db' }}
            data-testid="menu-form-image"
          />
          <Button type="submit" loading={createMutation.isPending || updateMutation.isPending} data-testid="menu-form-submit">
            {editingMenu ? '수정 완료' : '추가 완료'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
