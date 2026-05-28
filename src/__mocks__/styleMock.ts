// Mock cho CSS modules — trả về Proxy object mà mọi key đều return tên key
// Ví dụ: styles.container → "container"
const handler: ProxyHandler<Record<string, string>> = {
  get: (_target, prop: string) => prop,
};

const styleMock = new Proxy({} as Record<string, string>, handler);
export default styleMock;
