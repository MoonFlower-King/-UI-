// 示例简历（中文 / 英文各一份），写法见 resume-core.js 开头的说明。
// 人物、公司、学校、项目、网址全部是虚构的（域名用保留的 .example，电话是占位号），只为演示程序员简历该写什么：
// 技术栈分类写、经历用数字说成果、项目带链接和星标、单列一栏开源贡献。
(function (g) {
  const zh = `# 林舟
> 后端 / 基础设施工程师 · 7 年经验 · 专注高并发与可观测性

- 邮箱: linzhou@mail.example
- 电话: 138-0000-0000
- 城市: 杭州
- GitHub: github.example/linzhou
- 博客: linzhou.example

## 个人简介
7 年后端经验，做过支付、消息队列和监控平台。习惯先写设计文档再写代码，喜欢把“偶尔出问题”的系统改成“出了问题马上知道”。

## 技术栈
- 语言: Go, Rust, TypeScript, Python, SQL
- 后端: gRPC, Kafka, Redis, PostgreSQL, ClickHouse
- 基础设施: Kubernetes, Terraform, Prometheus, OpenTelemetry
- 工具: Linux, Git, GitHub Actions, Grafana

## 工作经历
### 远帆科技 | 高级后端工程师 · 技术负责人 | 2022.03 - 至今
- 主导支付核心从单体拆分为 14 个服务，发布频率从每周 1 次提高到每天 6 次
- 设计基于 Kafka 的对账流水线，日处理 **3.2 亿**条记录，延迟从小时级降到 90 秒
- 搭建全链路追踪，线上故障平均定位时间从 47 分钟缩短到 8 分钟
- 带 5 人小组，建立代码评审和值班制度，新人上手时间缩短一半
技术栈: Go, Kafka, PostgreSQL, Kubernetes, OpenTelemetry

### 青石数据 | 后端工程师 | 2019.07 - 2022.02
- 负责实时指标平台的写入链路，单集群峰值写入 120 万点/秒
- 把查询层从 MySQL 迁到 ClickHouse，常用报表查询从 12 秒降到 0.4 秒
技术栈: Go, ClickHouse, Redis, gRPC

## 项目经历
### tidewatch | github.example/linzhou/tidewatch | ★ 2.4k
开源的轻量服务监控工具：一个二进制文件，配置 3 行就能给 HTTP / gRPC 服务加上健康检查和告警。
- 支持 Prometheus 指标导出和飞书、Slack、邮件告警
- 被多家中小团队用于生产环境，收到 60+ 位外部贡献者的 PR
技术栈: Go, Prometheus, SQLite

## 开源贡献
- 为一个主流 Go 消息队列客户端修复消费组重平衡时的消息重复问题（PR 已合并）
- 在本地技术大会分享《把对账做成流水线》，讲稿和代码已开源

## 教育经历
### 东湖理工大学 | 计算机科学与技术 · 本科 | 2015 - 2019
- 校 ACM 集训队成员，省赛二等奖；英语 CET-6，能用英文读写技术文档、开会
`;

  const en = `# Lin Zhou
> Backend / Infrastructure Engineer · 7 years · High-throughput systems & observability

- Email: linzhou@mail.example
- Phone: +86 138-0000-0000
- Location: Hangzhou, China
- GitHub: github.example/linzhou
- Blog: linzhou.example

## Summary
Backend engineer with 7 years across payments, message queues and monitoring. I write the design doc before the code, and I like turning systems that "sometimes break" into systems that tell you the moment they do.

## Skills
- Languages: Go, Rust, TypeScript, Python, SQL
- Backend: gRPC, Kafka, Redis, PostgreSQL, ClickHouse
- Infra: Kubernetes, Terraform, Prometheus, OpenTelemetry
- Tools: Linux, Git, GitHub Actions, Grafana

## Experience
### Farsail Tech | Senior Backend Engineer · Tech Lead | Mar 2022 - Present
- Split the payment core from a monolith into 14 services; releases went from once a week to 6 times a day
- Designed a Kafka-based reconciliation pipeline processing **320M** records a day, cutting latency from hours to 90 seconds
- Rolled out end-to-end tracing; mean time to locate incidents dropped from 47 to 8 minutes
- Lead a team of 5; set up code review and on-call rotations, halving new-hire ramp-up time
Stack: Go, Kafka, PostgreSQL, Kubernetes, OpenTelemetry

### Bluestone Data | Backend Engineer | Jul 2019 - Feb 2022
- Owned the ingestion path of the real-time metrics platform, peaking at 1.2M points/s per cluster
- Migrated the query layer from MySQL to ClickHouse; common reports went from 12 s to 0.4 s
Stack: Go, ClickHouse, Redis, gRPC

## Projects
### tidewatch | github.example/linzhou/tidewatch | ★ 2.4k
A lightweight open-source service monitor: one binary and three lines of config add health checks and alerts to any HTTP / gRPC service.
- Exports Prometheus metrics; alerts via Lark, Slack and email
- Used in production by several small teams, with PRs from 60+ outside contributors
Stack: Go, Prometheus, SQLite

## Open Source
- Fixed duplicate deliveries during consumer-group rebalancing in a popular Go message-queue client (PR merged)
- Spoke at a local tech conference on "Reconciliation as a Pipeline"; slides and code are open source

## Education
### Donghu Institute of Technology | B.Eng. in Computer Science | 2015 - 2019
- University ACM team; second prize at the provincial contest
`;

  g.JY_RESUME_SAMPLE = { zh, en };
})(typeof window !== 'undefined' ? window : globalThis);
