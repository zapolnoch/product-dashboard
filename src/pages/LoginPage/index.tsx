import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Alert, Button, Checkbox, Divider, Form, Input, Typography } from "antd"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuthStore } from "@/app/providers/authStore"
import logoSrc from "@/shared/assets/logo.svg"
import styles from "./LoginPage.module.css"

const { Title, Text } = Typography

interface LoginFormValues {
  username: string
  password: string
  remember: boolean
}

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = "Вход — Dashboard"
  }, [])

  const onFinish = async (values: LoginFormValues) => {
    setError(null)
    setLoading(true)

    try {
      await login(values.username, values.password, values.remember)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.inner}>
          <div className={styles.logo}>
            <img src={logoSrc} alt="Logo" width={35} height={34} />
          </div>

          <div className={styles.heading}>
            <Title level={2} className={styles.title}>
              Добро пожаловать!
            </Title>
            <Text className={styles.subtitle}>Пожалуйста, авторизируйтесь</Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              className={styles.alert}
            />
          )}

          <Form<LoginFormValues>
            layout="vertical"
            onFinish={onFinish}
            className={styles.form}
            requiredMark={false}
            initialValues={{ remember: false }}
          >
            <Form.Item
              label="Логин"
              name="username"
              rules={[{ required: true, message: "Введите логин" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Введите логин"
                allowClear
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              className={styles.passwordItem}
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введите пароль"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              className={styles.rememberItem}
            >
              <Checkbox className={styles.remember}>Запомнить данные</Checkbox>
            </Form.Item>

            <Form.Item className={styles.buttonItem}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className={styles.submitBtn}
              >
                Войти
              </Button>
            </Form.Item>

            <Divider className={styles.divider}>или</Divider>
          </Form>

          <Text className={styles.register}>
            Нет аккаунта?{" "}
            <Link to="/register" className={styles.registerLink}>
              Создать
            </Link>
          </Text>
        </div>
      </div>
    </div>
  )
}
