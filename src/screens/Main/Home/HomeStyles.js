import heroBg from '../../../assets/images/bottom-bg.png';

const styles = (theme) => ({
  HeroActionsSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2.5),
    minHeight: '460px',
    padding: theme.spacing(6, 2),
    backgroundImage: `url(${heroBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
    '@media (max-width: 600px)': {
      minHeight: '360px',
      padding: theme.spacing(4, 2),
    },
  },

  HeroActionButton: {
    width: '100%',
    maxWidth: '320px',
    padding: theme.spacing(1, 3),
    fontSize: '16px',
  },
});

export default styles;
