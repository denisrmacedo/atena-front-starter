import Grid from '@mui/material/Grid2'

import type { Usuario } from "@/types/base/alfa/usuario/usuario.model"
import UsuarioPlanilhaTabela from './UsuarioPlanilhaTabela'

const UsuarioPlanilha = ({ userData }: { userData?: Usuario[] }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <UserListCards />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <UsuarioPlanilhaTabela tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default UsuarioPlanilha
