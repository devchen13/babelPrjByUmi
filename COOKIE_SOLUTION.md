# Cookie请求头问题解决方案

## 问题描述

当您遇到以下错误时：

```
Refused to set unsafe header "Cookie"
```

这是因为浏览器出于安全考虑，不允许JavaScript直接设置Cookie请求头。这是浏览器的安全策略，无法绕过。

## 解决方案

### 方案1：使用withCredentials（推荐）

浏览器会自动处理Cookie，无需手动设置Cookie请求头：

```javascript
// 在axios配置中设置
const axiosInstance = axios.create({
  withCredentials: true, // 让浏览器自动处理Cookie
  timeout: 10000,
})

// 或者在请求时设置
const response = await axios.get('/api/data', {
  withCredentials: true,
})
```

### 方案2：通过URL参数传递Cookie（特殊需求）

如果确实需要手动传递Cookie信息，可以通过URL参数：

```javascript
import { configureCookieStrategy } from '@/utils/request'

// 启用通过URL参数传递Cookie
configureCookieStrategy({
  passCookieViaUrl: true,
  cookieParamName: '_cookie',
})

// 请求时会自动添加Cookie参数
// 例如：/api/data?_cookie=sessionId%3Dabc123
```

### 方案3：服务器端处理

服务器端可以通过以下方式接收Cookie：

```javascript
// Node.js Express示例
app.get('/api/data', (req, res) => {
  // 从请求头获取Cookie（浏览器自动发送）
  const cookies = req.headers.cookie

  // 从URL参数获取Cookie（手动传递）
  const cookieParam = req.query._cookie

  console.log('请求头Cookie:', cookies)
  console.log('URL参数Cookie:', cookieParam)

  res.json({ message: 'Hello' })
})
```

## 当前实现

### Cookie管理配置

```javascript
const COOKIE_CONFIG = {
  // 是否通过URL参数传递Cookie（用于特殊需求）
  passCookieViaUrl: false,
  // 是否启用withCredentials
  withCredentials: true,
  // Cookie参数名
  cookieParamName: '_cookie',
}
```

### 配置函数

```javascript
import { configureCookieStrategy, getCookieConfig } from '@/utils/request'

// 配置Cookie策略
configureCookieStrategy({
  passCookieViaUrl: true, // 启用URL参数传递
  cookieParamName: 'session', // 自定义参数名
})

// 获取当前配置
const config = getCookieConfig()
console.log(config)
```

## 最佳实践

### 1. 优先使用withCredentials

```javascript
// 推荐：让浏览器自动处理Cookie
const response = await axios.get('/api/data', {
  withCredentials: true,
})
```

### 2. 服务器端正确配置CORS

```javascript
// 服务器端需要设置正确的CORS头
app.use(
  cors({
    origin: 'http://localhost:8001',
    credentials: true, // 允许携带Cookie
  })
)
```

### 3. 避免手动设置Cookie请求头

```javascript
// ❌ 错误：浏览器会拒绝
config.headers['Cookie'] = 'sessionId=abc123'

// ✅ 正确：使用withCredentials
config.withCredentials = true
```

### 4. 特殊需求使用URL参数

```javascript
// 仅在特殊情况下使用
configureCookieStrategy({
  passCookieViaUrl: true,
})
```

## 常见问题

### Q: 为什么不能设置Cookie请求头？

A: 这是浏览器的安全策略，防止恶意网站窃取或伪造Cookie。只能通过withCredentials让浏览器自动处理。

### Q: withCredentials不工作怎么办？

A: 检查服务器端CORS配置，确保设置了`credentials: true`和正确的`Access-Control-Allow-Origin`。

### Q: 如何调试Cookie问题？

A: 在浏览器开发者工具的Network标签中查看请求头，确认Cookie是否正确发送。

### Q: 跨域Cookie有什么限制？

A: 跨域Cookie需要服务器端正确配置CORS，且Cookie的domain和path设置要正确。

## 调试方法

### 1. 检查请求头

在浏览器开发者工具中查看请求是否包含Cookie：

```
Request Headers:
Cookie: sessionId=abc123; userId=456
```

### 2. 检查CORS配置

确保服务器返回正确的CORS头：

```
Access-Control-Allow-Origin: http://localhost:8001
Access-Control-Allow-Credentials: true
```

### 3. 检查Cookie设置

确保Cookie设置了正确的domain和path：

```javascript
// 设置Cookie时指定domain
document.cookie = 'sessionId=abc123; domain=.example.com; path=/'
```

## 更新日志

- v1.2.0 - 移除target参数功能，简化配置
- v1.1.0 - 修复Cookie请求头设置问题
- 添加Cookie管理配置选项
- 支持通过URL参数传递Cookie（特殊需求）
- 提供Cookie策略配置函数
