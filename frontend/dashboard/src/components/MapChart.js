import React from "react";
import { scaleLinear } from "d3-scale";
import {
    ComposableMap,
    Geographies,
    Geography,
    Sphere,
    Graticule,
} from "react-simple-maps";
import { Card } from "@themesberg/react-bootstrap";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

export const MapChart = (props) => {
    const { title, data } = props;

    const maxCount = data.sort((a, b) => b.count - a.count)[0].count;
    const minCount = data.sort((a, b) => a.count - b.count)[0].count;

    const colorScale = scaleLinear()
        .domain([minCount, maxCount])
        .range(["#d5e4e2", "#1B998B"]);

    return (
        <Card border="light" className="shadow-sm">
            <Card.Header>
                <h5>{title}</h5>
            </Card.Header>
            <div className="px-5">
                <ComposableMap
                    projectionConfig={{
                        rotate: [-10, 0, 0],
                        scale: 147,
                    }}
                >
                    <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                    <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                    {data.length > 0 && (
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const d = data.find(
                                        (s) => s.ISO3 === geo.properties.ISO_A3
                                    );
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={
                                                d
                                                    ? colorScale(d["count"])
                                                    : "#F5F4F6"
                                            }
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    )}
                </ComposableMap>
            </div>
        </Card>
    );
};

export default MapChart;
