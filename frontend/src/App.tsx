import React, { useState, useEffect, Fragment } from 'react';
import { TopDevice } from './TopDevice';
import { io } from "socket.io-client";
import { PlayerStats } from './PlayerStats';
import { CentreDevice } from './CentreDevice';
const socket = io("http://localhost:12345");

export function App() {
    const [gsiData, setGSIData] = React.useState({} as Object);

    useEffect(() => {
        function onConnect() {
            console.log("connected!");
        }

        function onDisconnect() {
            console.log("disconnected!");
        }

        function onEvent(value) {
            //console.log("VALUE RECEIVED str: " + value);
            setGSIData(JSON.parse(value));
        }
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.onAny(onEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.offAny(onEvent);
        }

    }, []);
    let ts: Object[] = []
    let cts: Object[] = []
    if (gsiData.hasOwnProperty("allplayers")) {
        const allPlayerData: Object = gsiData["allplayers"]
        ts = Object.values(allPlayerData).filter((player) => player.team == "T");
        cts = Object.values(allPlayerData).filter((player) => player.team == "CT");
    }
    const ctsOnLeft = ts.length > 0 && ts[0]['observer_slot'] > 4;
    const teamsSwapped = gsiData["map"]?.round >= 12 || (gsiData["map"] - 23) % 6 <= 2;


    return <React.Fragment>
        {"allplayers" in gsiData &&
            <React.Fragment>
                <TopDevice data={gsiData["map"]} phaseCountdowns={gsiData["phase_countdowns"]} ctsOnLeft={ctsOnLeft} teamsSwapped={teamsSwapped}/>
                {"extradata" in gsiData && "mapDamage" in (gsiData["extradata"] as object) &&
                    <PlayerStats data={gsiData["allplayers"]} round={gsiData["map"]["round"]} roundPhase={gsiData["round"]["phase"]} roundDamage={(gsiData["extradata"] as object)["mapDamage"][gsiData["map"]["name"]]} currentSpec={gsiData["player"]}/>
                }
            </React.Fragment>
        }
        {"player" in gsiData && "allplayers" in gsiData && 
            <CentreDevice data={(gsiData['allplayers'] as object)[(gsiData['player'] as object)['steamid']]} roundPhase={gsiData["round"]["phase"]} roundDamage={(gsiData["extradata"] as object)["mapDamage"][gsiData["map"]["name"]]}/>
        }
        {/*<div className="flex w-screen justify-between content-center px-5 absolute bottom-20">
            <div>
                {ts.map((player: any) =>
                    <h1 className="my-1 p-3 pr-20 bg-southLanPurple">{player.name} K: {player.match_stats.kills} A: {player.match_stats.assists} D: {player.match_stats.deaths}</h1>
                )}
            </div>
            <div className='text-right'>
                {cts.map((player: any) =>
                    <h1 className="my-1 p-3 pl-20 bg-southLanGreen">K: {player.match_stats.kills} A: {player.match_stats.assists} D: {player.match_stats.deaths} {player.name}</h1>
                )}
            </div>
        </div>*/}
    </React.Fragment>;
}
