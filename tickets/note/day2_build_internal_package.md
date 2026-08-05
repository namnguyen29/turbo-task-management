# Task: Hoàn thiện Shared Packages trong pnpm + Turborepo Monorepo

## Mục tiêu

Sau khi đã đưa các contract dùng chung như:

- `Task`
- `ApiErrorResponse`
- `FieldError`

vào `@company/contracts` và sử dụng lại ở cả frontend và backend, bước tiếp theo là hoàn thiện cách tổ chức và sử dụng các shared package trong monorepo.

Mục tiêu của task này là tìm hiểu và áp dụng:

- internal package strategy;
- package exports;
- workspace dependencies;
- shared TypeScript configuration;
- shared ESLint configuration;
- package boundaries;
- package dependency graph.

Không mở rộng thêm business contract nếu không cần thiết.

---

# Step 1 — Hoàn thiện cấu trúc `@company/contracts`

Hiện tại `@company/contracts` đã chứa các contract dùng chung giữa frontend và backend.

Chuẩn hóa cấu trúc package:

```text
packages/
└── contracts/
    ├── src/
    │   ├── task/
    │   │   └── task.ts
    │   └── error/
    │       └── api-error.ts
    ├── package.json
    └── tsconfig.json
```

Không sử dụng một `index.ts` duy nhất để export toàn bộ package.

Thay vào đó, expose từng phần thông qua package subpath exports.

Ví dụ:

```json
{
  "exports": {
    "./task": "./src/task/task.ts",
    "./error": "./src/error/api-error.ts"
  }
}
```

Frontend và backend sử dụng:

```ts
import type { Task } from "@company/contracts/task";

import type { ApiErrorResponse, FieldError } from "@company/contracts/error";
```

### Cần kiểm tra

- Frontend import được contract.
- Backend import được contract.
- Không cần import trực tiếp từ:

```ts
@company/contracts/src/...
```

- Không cần một root `index.ts` export tất cả contract.

### Output

`@company/contracts` có public API rõ ràng và chỉ expose những module cần thiết.

---

# Step 2 — Research Internal Package Strategy

Tìm hiểu cách Turborepo tổ chức internal package.

Tập trung vào hai strategy:

### Just-in-Time package

Package export trực tiếp TypeScript source.

Consumer như Angular hoặc NestJS sẽ compile source đó.

Ví dụ:

```json
{
  "exports": {
    "./task": "./src/task/task.ts"
  }
}
```

### Compiled package

Package có build process riêng.

Ví dụ:

```text
src/
   ↓
tsc
   ↓
dist/
```

Consumer sử dụng output từ `dist`.

### Thực hiện

Đánh giá `@company/contracts` hiện tại và trả lời:

- Package có runtime code không?
- Package có cần build riêng không?
- Package có cần tạo `dist/` không?
- Package chỉ chứa TypeScript types/interfaces có phù hợp với JIT package không?
- Khi nào nên chuyển package sang compiled package?

### Expected result

Đưa ra quyết định cho Starter Kit:

```text
@company/contracts → JIT package
```

hoặc:

```text
@company/contracts → Compiled package
```

và ghi lại lý do lựa chọn.

---

# Step 3 — Khai báo Workspace Dependencies đúng cách

Đảm bảo frontend và backend khai báo dependency tới shared package một cách explicit.

Ví dụ trong:

```text
apps/api/package.json
```

```json
{
  "dependencies": {
    "@company/contracts": "workspace:*"
  }
}
```

và:

```text
apps/web/package.json
```

```json
{
  "dependencies": {
    "@company/contracts": "workspace:*"
  }
}
```

Không dùng TypeScript path alias như một cách thay thế dependency declaration.

Ví dụ không dùng:

```json
{
  "paths": {
    "@company/contracts/*": ["../../packages/contracts/src/*"]
  }
}
```

chỉ để tránh khai báo workspace dependency.

### Cần kiểm tra

pnpm nhận đúng internal package:

```bash
pnpm install
```

Sau đó kiểm tra:

```text
web → contracts
api → contracts
```

được thể hiện thành dependency relationship thực sự.

### Output

Dependency giữa các workspace package được khai báo rõ ràng trong `package.json`.

---

# Step 4 — Tạo Shared TypeScript Configuration

Tạo package:

```text
packages/typescript-config/
```

Mục đích là đưa những TypeScript options có thể dùng chung vào một nơi.

Ví dụ:

```text
packages/
└── typescript-config/
    ├── base.json
    └── package.json
```

`base.json` có thể chứa các rule chung như:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

Sau đó NestJS và Angular extend config chung.

Ví dụ conceptually:

```json
{
  "extends": "@company/typescript-config/base.json"
}
```

### Lưu ý

Không cố ép Angular và NestJS dùng toàn bộ cùng một `tsconfig`.

Framework-specific settings vẫn nằm trong từng application.

Ví dụ:

```text
Shared config
    ↓
common TypeScript rules

Angular tsconfig
    ↓
Angular-specific compiler options

NestJS tsconfig
    ↓
Nest-specific compiler options
```

### Cần kiểm tra

- API build/type-check bình thường.
- Web build/type-check bình thường.
- Shared rules thực sự được kế thừa.
- Framework-specific config không bị phá vỡ.

### Output

Một reusable TypeScript base configuration được sử dụng bởi cả frontend và backend.

---

# Step 5 — Tạo Shared ESLint Configuration

Tạo package:

```text
packages/eslint-config/
```

Mục tiêu là gom các lint rule dùng chung.

Ví dụ:

```text
packages/
└── eslint-config/
    ├── base.js
    ├── package.json
```

Shared config chỉ nên chứa các rule có thể áp dụng chung.

Framework-specific rule vẫn được cấu hình riêng.

Ví dụ:

```text
eslint-config/base
        ↓
       / \
      /   \
 Angular   NestJS
 config    config
```

Angular có thể giữ Angular-specific lint rules.

NestJS có thể giữ Node/Nest-specific lint rules.

### Cần kiểm tra

Chạy lint cho:

```text
apps/web
apps/api
```

và đảm bảo cả hai đều consume shared configuration.

### Output

Các common lint rule không còn cần duplicate giữa frontend và backend.

---

# Step 6 — Research và Test Package Boundaries

Tìm hiểu Turborepo package boundaries.

Chạy:

```bash
turbo boundaries
```

Sau đó chủ động tạo một số trường hợp sai để kiểm tra.

## Case 1 — Undeclared dependency

Ví dụ `web` import:

```ts
import { something } from "@company/utils";
```

nhưng `apps/web/package.json` không khai báo:

```json
"@company/utils": "workspace:*"
```

Kiểm tra Turborepo có phát hiện dependency violation hay không.

---

## Case 2 — Import xuyên qua source của package khác

Ví dụ:

```ts
import type { Task } from "../../../packages/contracts/src/task/task";
```

thay vì:

```ts
import type { Task } from "@company/contracts/task";
```

Đánh giá vì sao cách import trực tiếp source tạo coupling giữa các workspace.

---

## Case 3 — Import internal implementation

Ví dụ package chỉ expose:

```json
{
  "exports": {
    "./task": "./src/task/task.ts"
  }
}
```

thử import:

```ts
@company/contracts/src/task/task
```

và kiểm tra package `exports` có ngăn consumer sử dụng private implementation hay không.

### Output

Ghi lại guideline:

> Applications và packages chỉ được sử dụng public API của package khác và phải khai báo dependency rõ ràng.

---

# Step 7 — Inspect Package Dependency Graph

Sau khi setup xong các package, kiểm tra dependency graph của repository.

Expected architecture:

```text
                     contracts
                    /         \
                  api         web


              typescript-config
                 /          \
               api          web


                eslint-config
                 /          \
               api          web
```

Research cách Turborepo đọc dependency từ workspace `package.json` và xây dựng Package Graph.

Có thể sử dụng Turbo query để inspect graph.

Mục tiêu chưa phải benchmark hoặc caching.

Chỉ cần hiểu:

```text
Nếu web phụ thuộc contracts
```

thì Turborepo biết:

```text
contracts → web
```

và:

```text
Nếu api phụ thuộc contracts
```

thì Turbo biết:

```text
contracts → api
```

### Output

Xác nhận Turborepo nhận đúng dependency relationship giữa các application và shared packages.

---

# Step 8 — Viết Shared Package Guidelines

Sau khi thực hiện các bước trên, viết một document ngắn cho Starter Kit.

Document cần trả lời:

### Khi nào nên tạo shared package?

Ví dụ:

- API contracts được nhiều application sử dụng.
- Shared configuration.
- Utility thực sự dùng ở nhiều nơi.
- Code có ownership và responsibility rõ ràng.

### Khi nào không nên tạo shared package?

Ví dụ:

- Code chỉ được một application sử dụng.
- Business logic thuộc riêng frontend hoặc backend.
- Tạo package chỉ để chia folder.
- Abstraction chưa có use case thực tế.

### Quy tắc dependency

Ví dụ:

```text
apps → packages
```

Không nên:

```text
packages → apps
```

Shared package không được phụ thuộc trực tiếp vào implementation của application.

### Quy tắc import

Prefer:

```ts
import type { Task } from "@company/contracts/task";
```

Avoid:

```ts
import type { Task } from "../../../packages/contracts/src/task/task";
```

---

# Definition of Done

Task hoàn thành khi:

- `@company/contracts` có explicit subpath exports.
- API sử dụng shared Task/Error contract.
- Web sử dụng shared Task/Error contract.
- Workspace dependencies sử dụng `workspace:*`.
- Đã xác định `contracts` nên là JIT hay compiled package.
- Có `@company/typescript-config`.
- API và Web reuse TypeScript base config.
- Có `@company/eslint-config`.
- API và Web reuse ESLint common config.
- Đã test `turbo boundaries`.
- Đã inspect package dependency graph.
- Có guideline ngắn về cách tạo và sử dụng shared packages.

---

# Expected Result

Sau task này, repository không chỉ đơn giản là:

```text
Move interface vào packages/
```

mà phải chứng minh được:

```text
Shared code
    ↓
Clear package ownership
    ↓
Explicit dependencies
    ↓
Controlled public API
    ↓
Dependency graph understood by Turborepo
```

Đây sẽ là nền tảng để sang Day 3 nghiên cứu:

- task graph;
- `dependsOn`;
- build order;
- caching;
- cache invalidation;
- affected tasks;
- parallel execution.

Day 2 tập trung vào **package graph**.

Day 3 mới tập trung vào **task graph và execution**.
