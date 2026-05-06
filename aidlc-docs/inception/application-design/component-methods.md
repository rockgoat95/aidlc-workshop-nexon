# Component Methods

> Note: 상세 비즈니스 규칙은 Functional Design (CONSTRUCTION phase)에서 정의됩니다.

---

## Backend - Controllers

### AuthController
```typescript
POST /api/tables/login
  Input: { storeId: string, tableNumber: number, password: string }
  Output: { token: string, tableId: string, sessionId: string }

POST /api/admin/login
  Input: { storeId: string, username: string, password: string }
  Output: { token: string, admin: { id, username, storeId } }
```

### MenuController
```typescript
GET /api/menus?categoryId=xxx
  Output: { menus: Menu[], categories: Category[] }

GET /api/menus/:id
  Output: { menu: MenuDetail }

POST /api/admin/menus
  Input: { name, price, description, categoryId, imageUrl }
  Output: { menu: Menu }

PUT /api/admin/menus/:id
  Input: { name?, price?, description?, categoryId?, imageUrl? }
  Output: { menu: Menu }

DELETE /api/admin/menus/:id
  Output: { success: boolean }

PATCH /api/admin/menus/:id/order
  Input: { displayOrder: number }
  Output: { menu: Menu }
```

### OrderController
```typescript
POST /api/orders
  Input: { storeId, tableId, sessionId, items: [{ menuId, quantity, price }], totalAmount }
  Output: { order: Order, orderNumber: string }

GET /api/orders?sessionId=xxx
  Output: { orders: Order[] }

GET /api/admin/orders?status=xxx
  Output: { orders: OrderWithTable[] }

PATCH /api/admin/orders/:id/status
  Input: { status: 'pending' | 'preparing' | 'completed' }
  Output: { order: Order }

DELETE /api/admin/orders/:id
  Output: { success: boolean }
```

### TableController
```typescript
POST /api/admin/tables/:id/setup
  Input: { tableNumber: number, password: string }
  Output: { table: Table, session: TableSession }

POST /api/admin/tables/:id/complete
  Output: { success: boolean }

GET /api/admin/tables/:id/history?startDate=xxx&endDate=xxx
  Output: { orders: OrderHistory[] }
```

### CategoryController
```typescript
GET /api/admin/categories
  Output: { categories: Category[] }

POST /api/admin/categories
  Input: { name: string, displayOrder?: number }
  Output: { category: Category }

PUT /api/admin/categories/:id
  Input: { name?: string, displayOrder?: number }
  Output: { category: Category }

DELETE /api/admin/categories/:id
  Output: { success: boolean }
```

### SSEController
```typescript
GET /api/admin/orders/stream
  Output: SSE stream (event types: new-order, order-status-changed, order-deleted)
```

---

## Backend - Services

### AuthService
```typescript
loginTable(storeId, tableNumber, password): Promise<{ token, tableId, sessionId }>
loginAdmin(storeId, username, password): Promise<{ token, admin }>
verifyToken(token): Promise<{ userId, role, storeId }>
hashPassword(password): Promise<string>
comparePassword(plain, hashed): Promise<boolean>
checkLoginAttempts(identifier): Promise<boolean>
```

### MenuService
```typescript
getMenus(storeId, categoryId?): Promise<Menu[]>
getMenuById(id): Promise<Menu>
createMenu(data): Promise<Menu>
updateMenu(id, data): Promise<Menu>
deleteMenu(id): Promise<void>
updateDisplayOrder(id, order): Promise<Menu>
validateMenuData(data): ValidationResult
```

### OrderService
```typescript
createOrder(data): Promise<Order>
getOrdersBySession(sessionId): Promise<Order[]>
getOrdersForAdmin(storeId, status?): Promise<Order[]>
updateOrderStatus(id, status): Promise<Order>
deleteOrder(id): Promise<void>
calculateTotalAmount(items): number
```

### TableService
```typescript
setupTable(tableId, tableNumber, password): Promise<{ table, session }>
completeTable(tableId): Promise<void>
getTableHistory(tableId, dateRange?): Promise<OrderHistory[]>
getActiveSession(tableId): Promise<TableSession | null>
```

### CategoryService
```typescript
getCategories(storeId): Promise<Category[]>
createCategory(data): Promise<Category>
updateCategory(id, data): Promise<Category>
deleteCategory(id): Promise<void>
```

---

## Frontend - Stores (Zustand)

### useCartStore
```typescript
interface CartStore {
  items: CartItem[]
  addItem(menu: Menu, quantity: number): void
  removeItem(menuId: string): void
  updateQuantity(menuId: string, quantity: number): void
  clear(): void
  getTotalAmount(): number
}
// localStorage 연동으로 새로고침 시 유지
```

### useAuthStore
```typescript
interface AuthStore {
  token: string | null
  role: 'customer' | 'admin' | null
  tableId: string | null
  sessionId: string | null
  setAuth(data): void
  logout(): void
  isAuthenticated(): boolean
}
```

---

## Frontend - React Query Hooks

```typescript
// 메뉴
useMenus(categoryId?): { data: Menu[], isLoading, error }
useMenuDetail(id): { data: Menu, isLoading, error }

// 주문
useOrders(sessionId): { data: Order[], isLoading, error }
useCreateOrder(): { mutate, isLoading, error }

// 관리자
useAdminOrders(status?): { data: Order[], isLoading, error }
useUpdateOrderStatus(): { mutate, isLoading }
useDeleteOrder(): { mutate, isLoading }

// SSE
useOrderStream(): { orders: Order[], isConnected: boolean }
```
