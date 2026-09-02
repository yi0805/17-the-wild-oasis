# AGENTS.md

The Wild Oasis 是一个供住宿营运人员管理 cabins、bookings、check-in/out、settings 和 staff account 的单页 dashboard。本文件是此仓库后续工程工作的长期规则。

## Project Positioning

本项目应展示现代 React/TypeScript frontend engineering、可靠 client data handling、Supabase security boundary、测试与 CI。WhereRU 已经展示 Python/FastAPI、AWS、AI、infrastructure 与 backend 能力；除非有明确、经记录的工程理由，本仓库不得复制那套 stack，也不得为简历关键词加入 AI、AWS、microservices、Kubernetes、Kafka、Redis、GraphQL、Redux 或独立 backend。

## Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend | React 18, JavaScript/JSX（计划渐进迁移至 TypeScript）, React Router 6 |
| Server State | TanStack React Query 4 |
| Forms | React Hook Form |
| Database/Auth/Storage | Supabase JavaScript client |
| UI | styled-components, react-icons, react-hot-toast |
| Charts and dates | Recharts, date-fns |
| Error handling | react-error-boundary |
| Build/deployment config | Vite 4, Netlify SPA redirects, Vercel rewrites |
| Testing | 尚未安装；ROADMAP Phase 1 将加入 Vitest + React Testing Library |
| CI | 尚未配置；ROADMAP Phase 1 将加入 GitHub Actions |

## Architecture Rules

- `pages/` 只组合路由级页面；`features/` 按业务域组织 UI、hooks 与 workflow；`ui/` 放可复用、无业务含义的组件；`services/` 是 Supabase/data-access boundary；`utils/` 只放无副作用的共享 helpers。
- Component 保持单一责任。不要把 Supabase calls、query orchestration 和复杂 UI 混在同一 component。
- 所有 server reads/writes 经 feature hook 和 `services/` 进行。维护稳定、可解释的 query keys；mutation 成功后只 invalidate 受影响的 query keys，不要默认刷新全部 queries。
- 对每个 async route/feature 明确处理 loading、error 和 empty state。global ErrorBoundary 只处理 render error，不能代替 query error UI。
- Form validation 要同时考虑 HTML constraints、client feedback 与 database policy。客户端验证提升体验，不是安全边界。
- TypeScript migration 从 ROADMAP Phase 2 开始，必须渐进但以 predominantly TypeScript 为终点：先 service/domain contracts 和 hooks，再到使用它们的 forms/components；不得为了 `.tsx` 扩展名一次性重写整个应用，也不得要求无关 hotfix 迁移整份文件。
- 在已验证 Supabase baseline 后，使用 Supabase-generated `Database` types 作为 table `Row`、`Insert` 和 `Update` contracts 的 source of truth，并据此 type the Supabase client。仅为非数据库 domain/UI transformation 编写补充 types；不得手写复制完整 schema。
- 路由参数、URL search params、file input 和第三方 payload 是 runtime input。只在真正不可信的边界加入 runtime validation；不要默认对每个 Supabase response 加 Zod/schema。新 validation dependency 必须有明确 runtime use case。

## Security Rules

- 不得提交 `.env`、真实 login credentials、access token、service-role key、private key 或 production data dump。只提交安全的 `.env.example`。
- 浏览器只能使用 `VITE_SUPABASE_URL` 与 Supabase publishable/anon key。它是 public configuration，不应被当作 secret；`service_role` key 永远不能进入 Vite client、Git history 或 CI logs。
- React `ProtectedRoute` 只是 UI navigation guard。真实 authorization 必须由 Supabase RLS、Storage policies 和 Auth configuration 实施。先确认产品实际需要和已存在的 access model；不得为 portfolio value 虚构 staff/admin RBAC。
- 所有 tables 与 Storage buckets 都必须有被验证的 policies；测试 anonymous access 和每个实际 authenticated access path。不要依赖客户端隐藏按钮来授权。
- Staff provisioning、password/account actions 与 file uploads 必须有明确授权路径。若需要 privileged server operation，使用受认证的 Supabase server-side mechanism，绝不在 browser 暴露 elevated credentials。
- Validate file MIME type/size in the client for UX and enforce the equivalent constraints/policies server-side. Avoid predictable/colliding file names.
- 用户可见错误信息应可操作但不泄露 internal query details；详细诊断只应进入合适的 development/observability channel。
- 如果采用 Supabase migrations，先建立并验证当前 hosted database/schema/RLS/Storage baseline；不得编造 historical migrations。baseline 后的 future change 必须正常 version control。

## Testing Rules

- 在 ROADMAP Phase 1 前，不要假装 `npm test` 存在或报告未运行的测试。
- 优先 behavioural tests：pure business logic、data-access failure behaviour、form validation 和关键 workflow（login/protected route、cabin create/edit、booking delete、check-in/out、settings update），而不是 component internals。
- UI/feature tests 只在需要时 mock data-access boundary。不要无必要 mock TanStack Query、React Hook Form 或 internal component implementation。
- Service failure/rollback behaviour 直接以 controlled Supabase/Storage mocks 测试，不要让 local/unit tests 写入共享 Supabase data。
- Vitest + React Testing Library 和 GitHub Actions 是 required outcome。Playwright 只有在可隔离、可重复 seed 的 Supabase environment 能以合理复杂度建立时才是 optional stretch goal。
- CI 起步必须使用 `npm ci`，并运行当时存在的 lint、tests 和 build；只在 Phase 2 实际加入 `typecheck` 后把它放入 CI。
- 不追求无意义的 100% coverage。新增或修复关键业务行为时，补能捕捉回归的测试。
- 每个 milestone 运行当时实际存在的 lint、typecheck、test 和 build commands，并报告无法验证的原因。

## Code Quality

- 以当前 active ESLint configuration 为准；修复 warning，不要通过 broad disable 或提高 warning threshold 隐藏问题。
- 保持命名、import casing 和文件名一致；修复明显 typo（例如 `constatns`）时，先确认所有 imports 并在独立、可审查的 milestone 处理。
- 删除或隔离 dead/tutorial-version files、commented-out implementation 和危险 development utilities；不要删除前先假设它们未被使用。
- Comments 解释原因、trade-off 或不明显约束，不重复代码。大型 component 应先按职责拆分，而非引入不必要 design pattern。
- 新 dependency 必须说明工程理由、维护成本、bundle/security impact 和替代方案。所有 dependency changes 后运行 audit、lint 和 build。
- Performance optimisations 必须先测量；记录 baseline 与 outcome，不能虚构 metric。
- Cabin image lifecycle must distinguish application-owned Storage objects from external/default URLs. After a successful replacement, a failed old-object cleanup must be recorded for retry, never compensated by deleting the cabin or the new image.

## Language Rules

所有 source code 和面向项目的公开材料必须使用 English，包括：

- variable 与 function names；
- comments 与 docstrings；
- UI copy 与 error messages；
- README、architecture documentation 与 commit-quality documentation。

内部 planning documents（包括 `AGENTS.md` 和 `ROADMAP.md`）可以使用 Chinese。

## Portfolio Honesty

- README、screenshots、resume bullets 和 project documentation 必须清楚说明 The Wild Oasis 起源于 course/tutorial baseline。
- 将 inherited functionality 与本 roadmap 中独立实施的 engineering improvements 分开描述；不得把 tutorial baseline 全部表述为原创工作。
- 任何 quality、security、performance 或 deployment claim 都必须可由实际代码、配置或 measurement 支持。

## Common Commands

当前存在的 commands：

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

`npm test`、`npm run typecheck` 和 E2E commands 目前不存在；只有在对应 ROADMAP milestone 实际加入 scripts 后才能写入此节并在 CI 使用。

## GitHub Delivery Workflow

### Roles

- ChatGPT：planning、architecture discussion、task definition 和 final code review。
- Codex：implementation、testing、Git operations、handoff documentation 和 Pull Request creation。
- GitHub：code history、branches、commits、diffs、Pull Requests 和 delivery 的 source of truth。
- Human：最终 decision-maker；只有 human 可以决定 merge Pull Request。

### Before Implementation

对每个 implementation task：

1. 运行 `git status`，保留并避开 unrelated existing work；不得 overwrite、discard 或 reset 它。
2. 先以 fast-forward-only 方式更新 local `main`：`git fetch origin --prune`，确认状态后运行 `git pull --ff-only`。若 dirty worktree 阻止安全更新，停止并报告，不得强制覆盖。
3. 不得直接在 `main` implementation。创建 dedicated branch：`task/<task-number>-<short-description>`，例如 `task/003-supabase-settings`。
4. 阅读 `AGENTS.md`、`ROADMAP.md` 及最相关的 `docs/handoff/` 文件，再理解代码和 task。
5. 在 coding 前明确记录 Goal、In scope、Out of scope 和 Acceptance criteria；scope expansion 需要 explicit approval。
6. 只实施 task 所需内容；不要混入 unrelated refactor、formatting、dependency upgrade 或 architecture change。
7. 运行实际适用的 verification（tests、lint、typecheck、build、targeted runtime check），没有运行的检查不得报告为 passed。
8. Commit 前自行 review final Git diff：changed files、scope、secrets/credentials、generated/local files 和 acceptance criteria。

### Handoff

每个 meaningful implementation task 必须在 `docs/handoff/` 创建一个 concise file：

`docs/handoff/task_<number>_<short_description>.md`

文件必须包含：

```text
# Task

## Goal

## Changed

## Not Changed

## Verification

## Risks / Notes

## Next
```

Handoff 是给下一次 Codex session 和 ChatGPT review 的准确摘要；它不能替代 proper code、tests、commit history 或 Pull Request description。内容必须与实际 Git diff 和 repository history 一致。

### Commit, Pull Request and Completion Report

完成 implementation 与 verification 后：

1. Review diff，并只 `git add` intended files。
2. 使用 clear commit message commit task。
3. Push task branch 到 GitHub，并创建 target 为 `main` 的 Pull Request；Codex 不得 merge。
4. Completion report 必须包含 Task、branch name、commit hash、Pull Request URL、changed files、actual verification、handoff file path 和 known risks/unresolved issues。

Human 将 Pull Request 交给 ChatGPT 独立 review，再由 Human 作最终 merge decision。

## Codex Working Rules

1. **大改动先给 plan**：任何 multi-file refactor、architecture change、dependency addition、TypeScript migration、database change、authentication change 或 major feature 开始前，先给简短 implementation plan。
2. **按 ROADMAP 顺序推进**：遵循 `ROADMAP.md`：Phase 1 regression safety/CI 必须先于 Phase 2 TypeScript migration，不要因为后续阶段更有趣而跳过前置工作。
3. **一次只解决一个 milestone**：保持 change reviewable、可理解、可回滚。
4. **修改前先理解现有代码**：不要在不了解现有 abstraction 用途前替换正常工作的实现。
5. **每个 milestone 完成后实际验证**：运行相关 build、lint、tests、typecheck 和 application verification。
6. **不允许“看起来应该能跑”**：无法实际验证时，明确说明未验证内容和原因。
7. **不为简历堆技术**：每个新 dependency/technology 都需要清楚的 engineering reason。
8. **不随意重写整个项目**：除非存在例外且有书面理由，否则优先 incremental improvement。
9. **不虚构结果或性能数据**：resume metric 必须来自实际 measurement，并保留可复查证据。
10. **更新文档**：完成 milestone 后勾选 ROADMAP、必要时更新 `Decisions & Gotchas`，architecture rule 变化时同步更新本文件。Recruiter-ready phase 必须确认真实 deployment target 后才删除另一个平台的 stale configuration。
11. **不确定时先分析**：多个合理方案存在时，先说明 trade-off 再选择。
12. **保持 scope**：目前只允许修改 `E:\reactPractise\17-the-wild-oasis`；在用户明确说明第一个项目完成前，不得修改 `21-the-wild-oasis-website`。
