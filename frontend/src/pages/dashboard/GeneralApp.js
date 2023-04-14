// material
import { Container, Grid } from '@material-ui/core';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppFeatured,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers
} from '../../components/_dashboard/general-app';
import { EcommerceYearlySales } from '../../components/_dashboard/general-ecommerce';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();

  return (
    <Page title="General: App | dataSracper">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome displayName={user.displayName} />
          </Grid>
          <Grid item xs={12} md={4}>
            <AppTotalActiveUsers />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalInstalled />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalDownloads />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <EcommerceYearlySales />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
