import { PrismaClient } from "../generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import * as bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const OWNER = {
  name: "Fabricio",
  email: "fabricio@entur.com.br",
  password: "forgebase123",
  title: "Owner",
}

const ORGANIZATION = {
  name: "Entur",
  slug: "entur",
}

const FEATURE_FLAGS = [
  { key: "feature_kanban", label: "Kanban & Boards", description: "Boards, colunas, WIP limits e drag-and-drop.", enabled: true, locked: true },
  { key: "feature_sprints", label: "Sprints & Burndown", description: "Planejamento, burndown e velocity.", enabled: true },
  { key: "feature_docs_editor", label: "Editor de documentos", description: "Rich-text com TOC e comentários.", enabled: true },
  { key: "feature_projects", label: "Projetos", description: "Lista de projetos, timeline e budget.", enabled: true },
  { key: "feature_contracts", label: "Contratos", description: "Acordos comerciais com alerta de vencimento.", enabled: true },
  { key: "feature_billing", label: "Faturamento", description: "Faturas, recebimentos e curva de receita.", enabled: true },
  { key: "feature_reports", label: "Relatórios", description: "Relatórios consolidados e exportações.", enabled: true },
  { key: "feature_playground", label: "Playground visual", description: "Quadro livre para esboços e diagramas.", enabled: false },
  { key: "feature_integrations", label: "Integrações & API", description: "Webhooks, API keys e conectores.", enabled: false },
]

async function seed() {
  await prisma.organization.deleteMany({})
  await prisma.user.deleteMany({})

  const passwordHash = await bcrypt.hash(OWNER.password, 10)
  const owner = await prisma.user.create({
    data: { name: OWNER.name, email: OWNER.email, password: passwordHash, emailVerified: true },
  })

  const organization = await prisma.organization.create({
    data: {
      name: ORGANIZATION.name,
      slug: ORGANIZATION.slug,
      plan: "TEAM",
      status: "ACTIVE",
      region: "sa-east-1",
      databaseName: "pg-sa-east-1-01",
      mrrCents: 0,
    },
  })

  await prisma.membership.create({
    data: { orgId: organization.id, userId: owner.id, role: "OWNER", title: OWNER.title },
  })

  for (const flag of FEATURE_FLAGS) {
    await prisma.featureFlag.create({
      data: {
        orgId: organization.id,
        key: flag.key,
        label: flag.label,
        description: flag.description,
        enabled: flag.enabled,
        locked: flag.locked ?? false,
        enabledAt: flag.enabled ? new Date() : null,
      },
    })
  }

  console.log(`Sistema reiniciado do zero: owner ${owner.email}, org ${organization.slug} (vazia), ${FEATURE_FLAGS.length} feature flags.`)
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
