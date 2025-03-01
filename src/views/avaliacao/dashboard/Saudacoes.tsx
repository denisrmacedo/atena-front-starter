import { useSession } from 'next-auth/react'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'

const Saudacoes = () => {
  const { data: session } = useSession()

  return (
    <Card className='relative bs-full'>
      <CardContent className='sm:pbe-0'>
        <Grid container spacing={6}>
          <Grid size={8} className='flex flex-col items-start gap-4'>
            <Typography variant='h4'>
              Seja bem-vindo <span className='font-bold'>{session?.user?.name}!</span> 🎉
            </Typography>
            <div>
              <Typography>A plataforma Aurora está pronta para te ajudar a gerenciar seu negócio 😎</Typography>
              <Typography>Estamos apenas começando</Typography>
            </div>
            {/* <Button variant='contained'>View Portfolio</Button> */}
          </Grid>
          <Grid size={4} className='max-sm:-order-1 max-sm:flex max-sm:justify-center'>
            <img
              alt='Upgrade Account'
              src='/images/cards/user-john-light.png'
              className='max-bs-[186px] sm:absolute block-end-0 inline-end-0 max-is-full'
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Saudacoes
