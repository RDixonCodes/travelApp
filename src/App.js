import React, { useEffect, useState } from "react";
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from "./api/index";

import Header from "./components/Header/header";
import List from "./components/List/list";
import Map from "./components/Map/map";



const App = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([])
    const [childClicked, setChildClicked] = useState(null);

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState("restaurants");
    const [rating, setRating] = useState("");

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(( { coords: {latitude, longitude} }) => {
            setCoordinates({ lat: latitude, lng: longitude})
        })
    },[]);

    useEffect(() => {
        const filteredPlaces = places?.filter((place) => Number(place.rating)  > rating)
        console.log('loading1')
        setFilteredPlaces(filteredPlaces);
    },[places, rating])

    useEffect(() => {
        console.log('loading2')
        if(bounds.sw && bounds.ne) {
        setIsLoading(true)

        getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
            console.log(data)
            setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
            setFilteredPlaces([]);
            setRating('')
            setIsLoading(false);
        })
    }
    },[type, bounds])

    console.log(places)
    console.log(filteredPlaces)

    return(
        <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates}/>
            <Grid container spacing={3} style={{ width: '100%'}}>
            <Grid item xs={12} md={4}>
                <List places={filteredPlaces?.length ? filteredPlaces : places}
                childClicked={childClicked}
                isLoading={isLoading}
                type={type}
                setType={setType}
                rating={rating}
                setRating={setRating}
                />
            </Grid>                                                         
            <Grid item xs={12} md={8}>
                <Map 
                setCoordinates={setCoordinates}
                setBounds={setBounds}
                coordinates={coordinates}
                places={filteredPlaces?.length ? filteredPlaces : places}
                setChildClicked={setChildClicked}
                />
            </Grid>
            </Grid>
        </>
    )
}

export default App;