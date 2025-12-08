import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/shadcn/components/tabs"
import { RecentUsersTable } from "./RecentUsersTable"
import { RecentChallengesTable } from "./RecentChallengesTable"

export const RecentActivityView = () => {
  return (
    <div>
      <h2 className="text-2xl font-medium">Atividade recente</h2>
      <div className="mt-6">
      <Tabs defaultValue="user">
        <TabsList>
          <TabsTrigger value="user">Usuários</TabsTrigger>
          <TabsTrigger value="challenge">Desafios</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <RecentUsersTable />
        </TabsContent>
        <TabsContent value="challenge">
          <RecentChallengesTable />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

