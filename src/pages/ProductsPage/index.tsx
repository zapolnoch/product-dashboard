import {
  LogoutOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import type { TableProps } from "antd"
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  message,
  Progress,
  Table,
  Typography,
} from "antd"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAuthStore } from "@/app/providers/authStore"
import { fetchProducts, type Product } from "@/shared/api/products"
import { formatPriceParts, isLowRating } from "@/shared/lib/format"
import styles from "./ProductsPage.module.css"
import { useSortStore } from "./sortStore"

const { Title, Text } = Typography

const PAGE_SIZE = 20

interface AddProductForm {
  title: string
  price: number
  brand: string
  sku: string
}

function formatPrice(price: number): React.ReactNode {
  const { whole, cents } = formatPriceParts(price)
  return (
    <span className={styles.price}>
      {whole}
      <span className={styles.priceCents}>,{cents}</span>
    </span>
  )
}

function RatingCell({ value }: { value: number }) {
  return (
    <span>
      <span className={isLowRating(value) ? styles.ratingLow : undefined}>
        {value.toFixed(1)}
      </span>
      /5
    </span>
  )
}

export function ProductsPage() {
  const logout = useAuthStore((s) => s.logout)
  const sortField = useSortStore((s) => s.field)
  const sortOrder = useSortStore((s) => s.order)
  const setSort = useSortStore((s) => s.setSort)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [form] = Form.useForm<AddProductForm>()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    document.title = "Товары — Dashboard"
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchProducts({
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        sortBy: sortField ?? undefined,
        order: sortOrder ?? undefined,
        search: search || undefined,
      })
      setProducts(data.products)
      setTotal(data.total)
    } catch (err) {
      messageApi.error(
        err instanceof Error ? err.message : "Ошибка загрузки товаров",
      )
    } finally {
      setLoading(false)
    }
  }, [page, sortField, sortOrder, search, messageApi])

  useEffect(() => {
    load()
  }, [load])

  const handleAddProduct = (values: AddProductForm) => {
    const newProduct: Product = {
      id: Date.now(),
      title: values.title,
      price: values.price,
      brand: values.brand,
      sku: values.sku,
      category: "",
      rating: 0,
      thumbnail: "",
    }
    setProducts((prev) => [newProduct, ...prev])
    setTotal((prev) => prev + 1)
    setAddModalOpen(false)
    form.resetFields()
    messageApi.success(`Товар «${values.title}» добавлен`)
  }

  const columns: TableProps<Product>["columns"] = [
    {
      title: "Наименование",
      dataIndex: "title",
      key: "title",
      width: 280,
      render: (_, record) => (
        <div className={styles.productCell}>
          <Image
            src={record.thumbnail}
            alt={record.title}
            width={48}
            height={48}
            className={styles.productImage}
            preview={false}
            fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjYzRjNGM0Ii8+PC9zdmc+"
          />
          <div className={styles.productInfo}>
            <Text strong className={styles.productTitle}>
              {record.title}
            </Text>
            <Text className={styles.productCategory}>{record.category}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Вендор",
      dataIndex: "brand",
      key: "brand",
      width: 125,
      align: "center",
      render: (brand: string) => (
        <Text strong className={styles.vendorText}>
          {brand || "—"}
        </Text>
      ),
    },
    {
      title: "Артикул",
      dataIndex: "sku",
      key: "sku",
      width: 160,
      align: "center",
    },
    {
      title: "Оценка",
      dataIndex: "rating",
      key: "rating",
      width: 125,
      align: "center",
      sorter: true,
      sortOrder:
        sortField === "rating"
          ? sortOrder === "asc"
            ? "ascend"
            : "descend"
          : null,
      render: (rating: number) => <RatingCell value={rating} />,
    },
    {
      title: "Цена, ₽",
      dataIndex: "price",
      key: "price",
      width: 160,
      align: "center",
      sorter: true,
      sortOrder:
        sortField === "price"
          ? sortOrder === "asc"
            ? "ascend"
            : "descend"
          : null,
      render: (price: number) => formatPrice(price),
    },
  ]

  const handleTableChange: TableProps<Product>["onChange"] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    if (!Array.isArray(sorter)) {
      const newSort = sorter.order
        ? {
            field: sorter.field as string,
            order:
              sorter.order === "ascend" ? ("asc" as const) : ("desc" as const),
          }
        : { field: null, order: null }
      setSort(newSort)
      setPage(1)
    }
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, 400)
  }

  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)

  return (
    <div className={styles.wrapper}>
      {contextHolder}
      <div className={styles.body}>
        {loading && (
          <Progress
            percent={100}
            status="active"
            showInfo={false}
            strokeColor="#242edb"
            className={styles.progress}
          />
        )}

        <div className={styles.navbar}>
          <Title level={3} className={styles.navTitle}>
            Товары
          </Title>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Найти"
            className={styles.searchInput}
            allowClear
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            className={styles.logoutBtn}
          >
            Выйти
          </Button>
        </div>

        <div className={styles.content}>
          <div className={styles.tableHeader}>
            <Title level={4} className={styles.contentTitle}>
              Все позиции
            </Title>
            <div className={styles.actions}>
              <Button
                icon={<ReloadOutlined />}
                onClick={load}
                className={styles.refreshBtn}
              />
              <Button
                type="primary"
                className={styles.addBtn}
                onClick={() => setAddModalOpen(true)}
              >
                Добавить
              </Button>
            </div>
          </div>

          <Table<Product>
            columns={columns}
            dataSource={products}
            rowKey="id"
            loading={false}
            onChange={handleTableChange}
            pagination={false}
            className={styles.table}
            size="middle"
          />

          <div className={styles.footer}>
            <Text className={styles.footerInfo}>
              <span className={styles.footerLabel}>Показано </span>
              <span>
                {from}-{to}
              </span>
              <span className={styles.footerLabel}> из </span>
              <span>{total}</span>
            </Text>
            <div className={styles.pagination}>
              {(() => {
                const totalPages = Math.ceil(total / PAGE_SIZE)
                const maxVisible = 5
                let start = Math.max(1, page - Math.floor(maxVisible / 2))
                const end = Math.min(totalPages, start + maxVisible - 1)
                start = Math.max(1, end - maxVisible + 1)

                const pages: React.ReactNode[] = []

                if (start > 1) {
                  pages.push(
                    <button
                      type="button"
                      key="prev"
                      className={styles.pageBtn}
                      onClick={() => setPage(page - 1)}
                    >
                      &lsaquo;
                    </button>,
                  )
                }

                for (let p = start; p <= end; p++) {
                  pages.push(
                    <button
                      type="button"
                      key={p}
                      className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>,
                  )
                }

                if (end < totalPages) {
                  pages.push(
                    <button
                      type="button"
                      key="next"
                      className={styles.pageBtn}
                      onClick={() => setPage(page + 1)}
                    >
                      &rsaquo;
                    </button>,
                  )
                }

                return pages
              })()}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Добавить товар"
        open={addModalOpen}
        onCancel={() => {
          setAddModalOpen(false)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{ className: styles.addBtn }}
      >
        <Form<AddProductForm>
          form={form}
          layout="vertical"
          onFinish={handleAddProduct}
        >
          <Form.Item
            label="Наименование"
            name="title"
            rules={[{ required: true, message: "Введите наименование" }]}
          >
            <Input placeholder="Введите наименование товара" />
          </Form.Item>
          <Form.Item
            label="Цена, ₽"
            name="price"
            rules={[{ required: true, message: "Введите цену" }]}
          >
            <InputNumber placeholder="0" min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Вендор"
            name="brand"
            rules={[{ required: true, message: "Введите вендора" }]}
          >
            <Input placeholder="Введите название бренда" />
          </Form.Item>
          <Form.Item
            label="Артикул"
            name="sku"
            rules={[{ required: true, message: "Введите артикул" }]}
          >
            <Input placeholder="Введите артикул" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
