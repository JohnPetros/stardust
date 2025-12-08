import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/shadcn/components/tabs"
import { RecentUsersTable } from "./RecentUsersTable"
import { RecentChallengesTable } from "./RecentChallengesTable"

export const RecentActivityView = () => {
  return (
    <div>
      <h2 className="text-2xl font-medium">Atividade recente</h2>
      <div className="mt-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Usuários</TabsTrigger>
          <TabsTrigger value="password">Desafios</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <RecentUsersTable />
        </TabsContent>
        <TabsContent value="password">
          <RecentChallengesTable />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

