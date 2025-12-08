import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import type { DailyActiveUsersDto } from '@stardust/core/profile/entities/dtos'

import { COLORS } from '@/constants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/components/card'
import { ToggleGroup, ToggleGroupItem } from '@/ui/shadcn/components/toggle-group'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/ui/shadcn/components/chart'
import { Loading } from '@/ui/global/widgets/components/Loading'

const CHART_CONFIG = {
  visits: {
    label: "Visits",
  },
  web: {
    label: "Web",
  },
  mobile: {
    label: "Mobile",
  },
} satisfies ChartConfig

type Props = {
  data: DailyActiveUsersDto
  days: number
  isLoading: boolean
  handleDaysSelectChange: (value: number) => void
}

export const DailyActiveUsersChartView = ({ data, days, isLoading, handleDaysSelectChange }: Props) => {
  return (
    <Card className="border-zinc-700">
      <CardHeader className='flex items-center justify-between'>
       <div>
       <CardTitle>Usuários Ativos Diários (UAD)</CardTitle>
        <CardDescription>
          <span>
            Total de visitas no período selecionado para cada plataforma
          </span>
        </CardDescription>
       </div>
        <ToggleGroup
          type="single"
          value={days.toString()}
          onValueChange={(value) => handleDaysSelectChange(Number(value))}
          variant="outline"
        >
          <ToggleGroupItem value="90">Últimos 3 meses</ToggleGroupItem>
          <ToggleGroupItem value="30">Últimos 30 dias</ToggleGroupItem>
          <ToggleGroupItem value="7">Últimos 7 dias</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <Loading size={48} />
          </div>
        ) : (
          <ChartContainer
            config={CHART_CONFIG}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-web)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-web)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="web"
                type="natural"
                fill={COLORS.green[200]}
                stroke={COLORS.green[500]}
                stackId="a"
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill={COLORS.green[800]}
                stroke={COLORS.green[700]}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

