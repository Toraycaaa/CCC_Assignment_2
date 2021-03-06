import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import StatisticsTweetsNum from "../statistics-charts/statistics-tweets-num";
import StatisticsTweetsSuburbs from "../statistics-charts/statistics-tweets-suburbs";
import StatisticsAurinPop from "../statistics-charts/statistics-aurin-population";
import StatisticsAurinProjection from "../statistics-charts/statistics-aurin-projection";
import StatisticsTweetsEmployment from "../statistics-charts/statistics-tweets-unemployment";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          centered
        >
          <Tab label="AURIN" {...a11yProps(0)} />
          <Tab label="Twitter" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={1}>
        <Container maxWidth="md">
            <StatisticsTweetsEmployment></StatisticsTweetsEmployment>
          <StatisticsTweetsNum></StatisticsTweetsNum>
          <StatisticsTweetsSuburbs></StatisticsTweetsSuburbs>
        </Container>
      </TabPanel>
      <TabPanel value={value} index={0}>
        <Container maxWidth="md">
            <StatisticsAurinPop></StatisticsAurinPop>
            <StatisticsAurinProjection></StatisticsAurinProjection>
        </Container>
      </TabPanel>
    </>
  );
}
