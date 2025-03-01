'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Util Imports
import { getInitials } from '@/utils/getInitials'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { UsuarioSituacao, type Usuario } from '@/types/base/alfa/usuario/usuario.model'


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsuarioWithAction = Usuario & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Vars
// const userRoleObj: UserRoleType = {
//   admin: { icon: 'ri-vip-crown-line', color: 'error' },
//   author: { icon: 'ri-computer-line', color: 'warning' },
//   editor: { icon: 'ri-edit-box-line', color: 'info' },
//   maintainer: { icon: 'ri-pie-chart-2-line', color: 'success' },
//   subscriber: { icon: 'ri-user-3-line', color: 'primary' }
// }

// Styled Components
const Icon = styled('i')({})

const usuarioSituacaoProps = (situacao: number): { name: string; color: ThemeColor } => {
  if (situacao === UsuarioSituacao.Ativo) {
    return { name: 'Ativo', color: 'success' }
  }

  if (situacao === UsuarioSituacao.Suspenso) {
    return { name: 'Suspenso', color: 'warning' }
  }

  if (situacao === UsuarioSituacao.Banido) {
    return { name: 'Banido', color: 'error' }
  }

  return { name: 'Inativo', color: 'secondary' }
}

const usuarioPerfisProps = (perfis: string): { icon: string; color: string } => {
  if (perfis.startsWith('Super ')) {
    return { icon: 'ri-award-line', color: 'error' }
  }

  if (perfis.startsWith('Administrador')) {
    return { icon: 'ri-vip-crown-line', color: 'warning' }
  }

  if (perfis.startsWith('Supervisor')) {
    return { icon: 'ri-spy-line', color: 'info' }
  }

  return { icon: 'ri-user-3-line', color: 'primary' }
}

// Column Definitions
const columnHelper = createColumnHelper<UsuarioWithAction>()

const UserListTable = ({ tableData }: { tableData?: Usuario[] }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState(...[tableData])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<UsuarioWithAction, any>[]>(
    () => [
      columnHelper.accessor('nome', {
        header: 'Nome',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ imagem: row.original.imagem, nome: row.original.nome })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.nome}
              </Typography>
              <Typography variant='body2'>{row.original.codigo}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'E-mail',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('perfis', {
        header: 'Perfis',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon
              className={classnames('text-[22px]', usuarioPerfisProps(row.original.perfis).icon)}
              sx={{ color: `var(--mui-palette-${usuarioPerfisProps(row.original.perfis).color}-main)` }}
            />
            <Typography color='text.primary'>
              {row.original.perfis}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('situacao', {
        header: 'Situação',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Chip
              variant='tonal'
              className='capitalize'
              label={usuarioSituacaoProps(row.original.situacao).name}
              color={usuarioSituacaoProps(row.original.situacao).color}
              size='small'
            />
          </div>
        )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const table = useReactTable({
    data: data as Usuario[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  const getAvatar = (params: Pick<Usuario, 'imagem' | 'nome'>) => {
    const { imagem: avatar, nome } = params

    if (avatar) {
      return <CustomAvatar src={avatar} skin='light' size={34} />
    } else {
      return (
        <CustomAvatar skin='light' size={34}>
          {getInitials(nome as string)}
        </CustomAvatar>
      )
    }
  }

  return (
    <>
      <Card>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Nenhum
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
      </Card>
    </>
  )
}

export default UserListTable
