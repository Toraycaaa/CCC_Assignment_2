import {useState, useEffect, useCallback, useMemo} from 'react';
import MapGL, {Source, Layer} from 'react-map-gl';
// import ControlPanel from './control-panel';
import {dataLayer} from './map-style.js';
import {updatePercentiles} from './utils';
import { makeStyles } from "@material-ui/core/styles";

const MAPBOX_TOKEN = 'pk.eyJ1IjoidG9yYXljYWFhIiwiYSI6ImNrZXhmOTk4YzBqb2Mydm1mZzB3cnUxNWQifQ.tCTNSJ5vcc_-pF57gh7PVw'; // Set your mapbox token here


const useStyles = makeStyles(() => ({
  tooltip:{
    position: "absolute",
    margin: "8px",
    padding: "4px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    maxWidth: "300px",
    fontSize: "10px",
    zIndex: 9,
    pointerEvents: "none",
  }
 }))

function Map() {
  const classes = useStyles();
  const [viewport, setViewport] = useState({
    latitude: -27,
    longitude: 135,
    zoom: 4,
    bearing: 0,
    pitch: 0
  });
  const [year, setYear] = useState(1);
  const [allData, setAllData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch(
      'https://raw.githubusercontent.com/tonywr71/GeoJson-Data/master/australian-states.json'
    )
      .then(resp => resp.json())
      .then((json) => {
        setAllData(json)
      });
  }, []);

  const onHover = useCallback(event => {
    const {
      features,
      srcEvent: {offsetX, offsetY}
    } = event;
    const hoveredFeature = features && features[0];
    console.log(offsetX)
    setHoverInfo(
      hoveredFeature
        ? {
            feature: hoveredFeature,
            x: offsetX,
            y: offsetY
          }
        : null
    );
  }, []);

  const data = useMemo(() => {
    return allData && updatePercentiles(allData, f => f.properties.STATE_CODE);
  }, [allData, year]);

  return (
    <>
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onHover={onHover}
      >
        <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
        {hoverInfo && (
          <div className={classes.tooltip} style={{left: hoverInfo.x, top: hoverInfo.y}}>
            <div>State: {hoverInfo.feature.properties.STATE_NAME}</div>
            <div>State Code: {hoverInfo.feature.properties.STATE_CODE}</div>
            <div>State Code: {JSON.stringify(hoverInfo.x)}</div>
          </div>
        )}
      </MapGL>

      {/* <ControlPanel year={year} onChange={value => setYear(value)} /> */}
    </>
  );
}
export default Map;