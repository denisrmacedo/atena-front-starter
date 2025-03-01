'use client'

import Grid from '@mui/material/Grid2'

import useFetch from "@/libs/useFetch";
import { useToken } from "@/libs/useToken";
import type { Usuario } from "@/types/base/alfa/usuario/usuario.model";
import UsuarioPlanilha from "@/views/base/alfa/usuario/UsuarioPlanilha";
import Saudacoes from '@/views/avaliacao/dashboard/Saudacoes';
import CardStatVertical from '@/views/avaliacao/dashboard/Vertical';
import { DashboardResumo } from '@/types/avaliacao/dashboard/dashboard-resumo.model';
import { useEffect, useState } from 'react';

export default function Page() {

  const token = useToken()

  const { data: resumoAnterior, error: resumoAnteriorError } = useFetch<DashboardResumo>('/avaliacao/analise/dashboard/resumo?intervalo=-semana')

  const { data: resumoAtual, error: resumoAtualError } = useFetch<DashboardResumo>('/avaliacao/analise/dashboard/resumo?intervalo=semana')

  const { loading: usuariosLoading, data: usuarios, error: usuariosError } = useFetch<Usuario[]>('/base/alfa/usuario/lista')

  const [percentualUsuarios, setPercentualUsuarios] = useState(0);
  const [percentualAutorizacoes, setPercentualAutorizacoes] = useState(0);

  useEffect(() => {
    if (resumoAtual && resumoAnterior) {
      setPercentualUsuarios(((resumoAtual.usuarios - resumoAnterior.usuarios) / (resumoAnterior.usuarios || 1)) * 100);
      setPercentualAutorizacoes(((resumoAtual.autorizacoes - resumoAnterior.autorizacoes) / (resumoAnterior.autorizacoes || 1)) * 100);
      return;
    }
    setPercentualUsuarios(0);
    setPercentualAutorizacoes(0);
  }, [resumoAnterior, resumoAtual]);

  return (
    <>
      {resumoAnteriorError && <p>{resumoAnteriorError}</p>}
      {resumoAtualError && <p>{resumoAtualError}</p>}
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Saudacoes />
        </Grid>
        <Grid size={{ xs: 12, lg: 2 }}>
          <CardStatVertical
            stats={resumoAtual?.usuarios?.toString() || '...'}
            title='Novos usuários'
            trend={percentualUsuarios >= 0 ? 'positive' : 'negative'}
            trendNumber={Math.abs(percentualUsuarios).toFixed(1) + '%'}
            chipText='Nos últimos 7 dias'
            avatarColor='info'
            avatarIcon='ri-user-add-line'
            avatarSkin='light'
            chipColor='secondary'
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 2 }}>
          <CardStatVertical
            stats={resumoAtual?.autorizacoes?.toString() || '...'}
            title='Total de acessos'
            trend={percentualAutorizacoes >= 0 ? 'positive' : 'negative'}
            trendNumber={Math.abs(percentualAutorizacoes).toFixed(1) + '%'}
            chipText='Nos últimos 7 dias'
            avatarColor='warning'
            avatarIcon='ri-links-line'
            avatarSkin='light'
            chipColor='secondary'
          />
        </Grid>
      </Grid>
      <hr />
      <Grid container spacing={6} className='mt-4' >
        <Grid size={{ xs: 12 }}>
          <h2 className='mt-4'>Usuários</h2>
          {/* <h2>Seja bem vindo {session?.user?.name}!</h2> */}
          {usuariosLoading && <div>Iniciando...</div>}
          {usuariosError && <p>{usuariosError}</p>}
          {usuarios && <UsuarioPlanilha userData={usuarios} />}
        </Grid>
      </Grid>
    </>
  );
}
