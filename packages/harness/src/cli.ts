import { CommanderApp } from './app/commander/CommanderApp'
import { ChecksRouter } from './app/commander/routers/ChecksRouter'
import { GatesRouter } from './app/commander/routers/GatesRouter'
import { HarnessRouter } from './app/commander/routers/HarnessRouter'
import { ArchitectureCheckCommand } from './commands/checks/architecture/ArchitectureCheckCommand'
import { ContractCheckCommand } from './commands/checks/contract/ContractCheckCommand'
import { DeadCodeCheckCommand } from './commands/checks/dead-code/DeadCodeCheckCommand'
import { MigrationCheckCommand } from './commands/checks/migration/MigrationCheckCommand'
import { ReadinessCheckCommand } from './commands/checks/readiness/ReadinessCheckCommand'
import { RuntimeCheckCommand } from './commands/checks/runtime/RuntimeCheckCommand'
import { ScopeCheckCommand } from './commands/checks/scope/ScopeCheckCommand'
import { SpecCheckCommand } from './commands/checks/spec/SpecCheckCommand'
import { ConclusionGateCommand } from './commands/gates/conclusion/ConclusionGateCommand'
import { DefinitionGateCommand } from './commands/gates/definition/DefinitionGateCommand'
import { ImplementationGateCommand } from './commands/gates/implementation/ImplementationGateCommand'
import { ReadinessGateCommand } from './commands/gates/readiness/ReadinessGateCommand'
import { QualityRatchetCommand } from './commands/quality-ratchet/QualityRatchetCommand'

const checksRouter = new ChecksRouter([
  new SpecCheckCommand(),
  new ReadinessCheckCommand(),
  new ScopeCheckCommand(),
  new ArchitectureCheckCommand(),
  new RuntimeCheckCommand(),
  new DeadCodeCheckCommand(),
  new MigrationCheckCommand(),
  new ContractCheckCommand(),
])

const gatesRouter = new GatesRouter([
  new DefinitionGateCommand(),
  new ReadinessGateCommand(),
  new ImplementationGateCommand(),
  new ConclusionGateCommand(),
])

const app = new CommanderApp(
  new HarnessRouter(checksRouter, gatesRouter, [new QualityRatchetCommand()]),
)

void app.run()
