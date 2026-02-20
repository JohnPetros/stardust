import { Button } from '@/ui/shadcn/components/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/shadcn/components/dropdown-menu'
import { Badge } from '@/ui/shadcn/components/badge'
import { ChevronDown } from 'lucide-react'

type Props = {
  selectedRoles: string[]
  onChange: (roles: string[]) => void
}

const AVAILABLE_ROLES = [{ value: 'engineer', label: 'Engenheiro' }]

export const InsigniaRolesSelectView = ({ selectedRoles, onChange }: Props) => {
  function handleToggleRole(role: string) {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role))
    } else {
      onChange([...selectedRoles, role])
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='gap-2'>
          Insígnias
          {selectedRoles.length > 0 && (
            <Badge variant='secondary' className='ml-1'>
              {selectedRoles.length}
            </Badge>
          )}
          <ChevronDown className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuLabel>Selecione as insígnias</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AVAILABLE_ROLES.map((role) => (
          <DropdownMenuCheckboxItem
            key={role.value}
            checked={selectedRoles.includes(role.value)}
            onCheckedChange={() => handleToggleRole(role.value)}
          >
            {role.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
