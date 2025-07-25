// 受保护路由会在渲染前完成身份验证，既提升安全性又优化性能。

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig);

export const config = {
  // 指定中间件运行的路径。
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
